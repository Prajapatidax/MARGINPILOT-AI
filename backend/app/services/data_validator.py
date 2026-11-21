from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple, Optional
import pandas as pd
import numpy as np
from app.services.column_mapper import CANONICAL_SCHEMAS

def validate_dataset(
    df: pd.DataFrame,
    target_entity: str,
    column_mapping: Dict[str, Optional[str]]
) -> Dict[str, Any]:
    """
    Validates mapped DataFrame records against canonical domain business rules.
    Identifies missing required values, invalid types, negative amounts, invalid dates,
    suspicious pricing, and duplicate identifiers.
    """
    entity_schema = CANONICAL_SCHEMAS.get(target_entity.lower(), CANONICAL_SCHEMAS["sales"])
    canonical_fields = entity_schema["fields"]

    errors: List[Dict[str, Any]] = []
    warnings: List[Dict[str, Any]] = []

    # 1. Check if all required canonical fields are mapped to a column present in df
    missing_required_mappings = []
    for canon_field, field_def in canonical_fields.items():
        if field_def["required"]:
            mapped_col = column_mapping.get(canon_field)
            if not mapped_col or mapped_col not in df.columns:
                missing_required_mappings.append(canon_field)

    if missing_required_mappings:
        return {
            "is_valid": False,
            "total_rows": len(df),
            "valid_rows": 0,
            "invalid_rows": len(df),
            "critical_error": f"Required fields missing from mapping: {missing_required_mappings}",
            "errors": [{"row": None, "field": f, "message": "Required field not mapped to any dataset column", "severity": "CRITICAL"} for f in missing_required_mappings],
            "warnings": [],
            "valid_records": []
        }

    # Invert mapping to read from df: canonical_field -> df_column
    valid_records: List[Dict[str, Any]] = []
    seen_identifiers = set()

    now = datetime.now(timezone.utc)

    for idx, row in df.iterrows():
        row_num = int(idx) + 1  # 1-indexed for human readability
        row_errors: List[str] = []
        row_warnings: List[str] = []
        canonical_record: Dict[str, Any] = {}

        for canon_field, field_def in canonical_fields.items():
            mapped_col = column_mapping.get(canon_field)
            if not mapped_col or mapped_col not in df.columns:
                canonical_record[canon_field] = None
                continue

            val = row[mapped_col]
            if pd.isna(val) or val is None or str(val).strip() == "":
                if field_def["required"]:
                    row_errors.append(f"Required field '{canon_field}' is empty")
                canonical_record[canon_field] = None
                continue

            # Data type validations
            expected_type = field_def["type"]

            if expected_type == "numeric":
                try:
                    num_val = float(str(val).replace("$", "").replace(",", "").strip())
                    
                    # Business logic: Quantities and prices must not be negative
                    if canon_field in ["quantity", "unit_price", "cost_price", "selling_price"]:
                        if num_val < 0:
                            row_errors.append(f"Field '{canon_field}' cannot be negative ({num_val})")
                    if canon_field in ["unit_price", "selling_price"] and num_val == 0:
                        row_warnings.append(f"Field '{canon_field}' is 0.00 (possible giveaway or promotion)")

                    canonical_record[canon_field] = num_val
                except (ValueError, TypeError):
                    row_errors.append(f"Field '{canon_field}' must be a valid number, got '{val}'")
                    canonical_record[canon_field] = None

            elif expected_type == "datetime":
                try:
                    parsed_dt = pd.to_datetime(val)
                    if pd.isna(parsed_dt):
                        row_errors.append(f"Invalid date format in '{canon_field}': '{val}'")
                        canonical_record[canon_field] = None
                    else:
                        canonical_record[canon_field] = parsed_dt.isoformat()
                except Exception:
                    row_errors.append(f"Invalid date format in '{canon_field}': '{val}'")
                    canonical_record[canon_field] = None

            else:  # string
                canonical_record[canon_field] = str(val).strip()

        # Check identifier uniqueness (e.g. order_number or sku or customer_code)
        id_field = "order_number" if target_entity == "sales" else ("sku" if target_entity == "products" else "customer_code")
        id_val = canonical_record.get(id_field)
        if id_val and target_entity in ["products", "customers"]:
            if id_val in seen_identifiers:
                row_warnings.append(f"Duplicate {id_field} '{id_val}' in file; will be updated (upserted)")
            else:
                seen_identifiers.add(id_val)

        # Collect row issues
        if row_errors:
            for err in row_errors:
                errors.append({"row": row_num, "field": canon_field, "message": err, "severity": "ERROR"})
        else:
            valid_records.append(canonical_record)

        if row_warnings:
            for w in row_warnings:
                warnings.append({"row": row_num, "field": canon_field, "message": w, "severity": "WARNING"})

    total_rows = len(df)
    valid_count = len(valid_records)
    invalid_count = total_rows - valid_count

    return {
        "is_valid": len(errors) == 0,
        "total_rows": total_rows,
        "valid_rows": valid_count,
        "invalid_rows": invalid_count,
        "errors": errors[:100],  # Return up to 100 errors to prevent bloated response
        "total_error_count": len(errors),
        "warnings": warnings[:100],
        "total_warning_count": len(warnings),
        "valid_records": valid_records
    }
