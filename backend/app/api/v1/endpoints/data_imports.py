import os
from typing import List, Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.api.deps import get_current_user, get_tenant_context, require_roles
from app.core.tenant import TenantContext
from app.models.user import User
from app.models.membership import OrganizationRole
from app.models.data_import import DataImportJob, ImportStatus
from app.schemas.data_import import DataImportJobResponse, ColumnMappingRequest, CommitImportResponse
from app.services.data_profiler import profile_dataframe, read_file_to_df
from app.services.column_mapper import generate_column_suggestions
from app.services.data_validator import validate_dataset
from app.services.data_importer import commit_import_job

router = APIRouter()

# Temporary in-memory cache for raw upload bytes by job_id during onboarding session
UPLOAD_CACHE: Dict[str, bytes] = {}

@router.get("/", response_model=List[DataImportJobResponse])
def list_import_jobs(
    target_entity: Optional[str] = None,
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Any:
    """Lists all data import jobs for the active organization workspace."""
    query = select(DataImportJob).where(DataImportJob.organization_id == tenant.organization_id)
    if target_entity:
        query = query.where(DataImportJob.target_entity == target_entity)
    query = query.order_by(DataImportJob.created_at.desc())

    jobs = db.execute(query).scalars().all()
    return jobs

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    target_entity: str = Form("sales"),
    tenant: TenantContext = Depends(require_roles([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.MANAGER])),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Accepts CSV, XLSX, or JSON business datasets.
    Profiles the file structure and generates intelligent column mapping suggestions.
    """
    allowed_exts = [".csv", ".xlsx", ".xls", ".json"]
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(allowed_exts)}"
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    try:
        df = read_file_to_df(content, file.filename or "data.csv")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse file: {str(e)}"
        )

    # 1. Profile dataset
    profile = profile_dataframe(df)

    # 2. Generate intelligent column mappings
    mapping_suggestions = generate_column_suggestions(list(df.columns), target_entity)

    # 3. Create import job record
    job = DataImportJob(
        organization_id=tenant.organization_id,
        user_id=tenant.user_id,
        filename=file.filename or "unknown",
        file_format=ext.replace(".", ""),
        target_entity=target_entity,
        status=ImportStatus.UPLOADED.value,
        total_rows=profile["total_rows"],
        sample_preview=profile["preview_rows"],
        column_mappings=mapping_suggestions["suggested_mappings"]
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Store file content in session cache for validation & commit
    UPLOAD_CACHE[job.id] = content

    return {
        "job_id": job.id,
        "filename": job.filename,
        "target_entity": job.target_entity,
        "total_rows": profile["total_rows"],
        "columns_profile": profile["columns"],
        "sample_preview": profile["preview_rows"],
        "suggested_mappings": mapping_suggestions["suggested_mappings"],
        "confidence_scores": mapping_suggestions["confidence_scores"],
        "canonical_fields": mapping_suggestions["canonical_fields"],
        "unmapped_columns": mapping_suggestions["unmapped_columns"]
    }

@router.get("/{job_id}", response_model=DataImportJobResponse)
def get_import_job(
    job_id: str,
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieves import job state and validation reports."""
    job = db.execute(
        select(DataImportJob).where(
            DataImportJob.id == job_id,
            DataImportJob.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Import job not found.")

    return job

@router.post("/{job_id}/validate")
def validate_job_mapping(
    job_id: str,
    payload: ColumnMappingRequest,
    tenant: TenantContext = Depends(require_roles([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.MANAGER])),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Validates the dataset against confirmed column mappings.
    Detects missing values, invalid types, negative amounts, and anomalies.
    """
    job = db.execute(
        select(DataImportJob).where(
            DataImportJob.id == job_id,
            DataImportJob.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Import job not found.")

    content = UPLOAD_CACHE.get(job_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content expired from session. Please re-upload the file."
        )

    df = read_file_to_df(content, job.filename)
    validation_result = validate_dataset(df, job.target_entity, payload.mappings)

    # Update job record with mapping and validation summary
    job.column_mappings = payload.mappings
    job.valid_rows = validation_result["valid_rows"]
    job.invalid_rows = validation_result["invalid_rows"]
    job.validation_report = {
        "is_valid": validation_result["is_valid"],
        "total_error_count": validation_result.get("total_error_count", 0),
        "total_warning_count": validation_result.get("total_warning_count", 0),
        "errors": validation_result["errors"],
        "warnings": validation_result["warnings"],
    }
    job.status = ImportStatus.VALIDATED.value if validation_result["is_valid"] else ImportStatus.MAPPED.value
    db.commit()

    return {
        "job_id": job.id,
        "is_valid": validation_result["is_valid"],
        "total_rows": validation_result["total_rows"],
        "valid_rows": validation_result["valid_rows"],
        "invalid_rows": validation_result["invalid_rows"],
        "errors": validation_result["errors"],
        "warnings": validation_result["warnings"],
        "preview_records": validation_result["valid_records"][:5]
    }

@router.post("/{job_id}/commit", response_model=CommitImportResponse)
def commit_dataset(
    job_id: str,
    tenant: TenantContext = Depends(require_roles([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.MANAGER])),
    db: Session = Depends(get_db)
) -> Any:
    """
    Commits validated dataset into canonical business entities.
    Executes within an atomic transaction with audit logging.
    """
    job = db.execute(
        select(DataImportJob).where(
            DataImportJob.id == job_id,
            DataImportJob.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Import job not found.")

    if not job.column_mappings:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Column mapping not configured.")

    content = UPLOAD_CACHE.get(job_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content expired from session. Please re-upload the file."
        )

    df = read_file_to_df(content, job.filename)
    validation_result = validate_dataset(df, job.target_entity, job.column_mappings)

    if validation_result["valid_rows"] == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot commit import: zero valid rows found."
        )

    result = commit_import_job(db, job, validation_result["valid_records"])

    # Clean cache
    UPLOAD_CACHE.pop(job_id, None)

    return CommitImportResponse(
        status=result["status"],
        imported_count=result["imported_count"],
        target_entity=result["target_entity"],
        job_id=job.id
    )
