from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict
from app.models.data_import import ImportStatus

class DataImportJobResponse(BaseModel):
    id: str
    organization_id: str
    filename: str
    file_format: str
    target_entity: str
    status: str
    total_rows: int
    valid_rows: int
    invalid_rows: int
    column_mappings: Optional[Dict[str, Any]] = None
    sample_preview: Optional[List[Dict[str, Any]]] = None
    validation_report: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ColumnMappingRequest(BaseModel):
    mappings: Dict[str, Optional[str]]

class ValidationReportResponse(BaseModel):
    is_valid: bool
    total_rows: int
    valid_rows: int
    invalid_rows: int
    errors: List[Dict[str, Any]]
    warnings: List[Dict[str, Any]]
    preview_valid_count: int

class CommitImportResponse(BaseModel):
    status: str
    imported_count: int
    target_entity: str
    job_id: str
