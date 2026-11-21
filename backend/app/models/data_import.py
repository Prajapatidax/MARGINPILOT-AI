import enum
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ImportStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    MAPPED = "MAPPED"
    VALIDATING = "VALIDATING"
    VALIDATED = "VALIDATED"
    IMPORTING = "IMPORTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ROLLED_BACK = "ROLLED_BACK"

class DataImportJob(Base):
    __tablename__ = "data_import_jobs"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_format: Mapped[str] = mapped_column(String(16), nullable=False)  # csv, xlsx, json
    target_entity: Mapped[str] = mapped_column(String(64), nullable=False)  # sales, products, customers, suppliers, inventory
    status: Mapped[str] = mapped_column(String(32), default=ImportStatus.UPLOADED.value, nullable=False)
    
    total_rows: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    valid_rows: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    invalid_rows: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    column_mappings: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    sample_preview: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    validation_report: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
