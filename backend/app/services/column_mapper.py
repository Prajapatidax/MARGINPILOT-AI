import re
from typing import Dict, Any, List, Optional

# Canonical field definitions with required flags and common semantic aliases
CANONICAL_SCHEMAS: Dict[str, Dict[str, Any]] = {
    "sales": {
        "fields": {
            "order_number": {"required": True, "type": "string", "aliases": ["order_id", "order_no", "invoice_no", "invoice_number", "sale_id", "id"]},
            "customer_code": {"required": False, "type": "string", "aliases": ["customer_id", "client_code", "client_id", "cust_id", "customer"]},
            "transaction_date": {"required": True, "type": "datetime", "aliases": ["order_date", "date", "created_at", "timestamp", "sale_date"]},
            "sku": {"required": True, "type": "string", "aliases": ["product_id", "product_code", "item_code", "item_id", "item", "product_sku"]},
            "product_name": {"required": False, "type": "string", "aliases": ["item_name", "product", "description", "title"]},
            "quantity": {"required": True, "type": "numeric", "aliases": ["qty", "count", "units", "amount_sold", "volume"]},
            "unit_price": {"required": True, "type": "numeric", "aliases": ["price", "selling_price", "rate", "unit_selling_price"]},
            "unit_cost": {"required": False, "type": "numeric", "aliases": ["cost", "cost_price", "unit_cogs", "cogs"]},
            "discount": {"required": False, "type": "numeric", "aliases": ["discount_amount", "discount_value", "disc"]},
            "total_amount": {"required": False, "type": "numeric", "aliases": ["total", "line_total", "order_total", "grand_total", "net_sales"]},
            "status": {"required": False, "type": "string", "aliases": ["order_status", "state", "fulfillment_status"]}
        }
    },
    "products": {
        "fields": {
            "sku": {"required": True, "type": "string", "aliases": ["product_id", "product_code", "item_code", "code", "id"]},
            "name": {"required": True, "type": "string", "aliases": ["product_name", "title", "description", "item_name"]},
            "category_code": {"required": False, "type": "string", "aliases": ["category", "cat_code", "category_name", "department"]},
            "cost_price": {"required": True, "type": "numeric", "aliases": ["cost", "unit_cost", "purchase_price", "standard_cost"]},
            "selling_price": {"required": True, "type": "numeric", "aliases": ["price", "unit_price", "retail_price", "list_price"]},
            "reorder_point": {"required": False, "type": "numeric", "aliases": ["min_stock", "reorder_level", "rop"]},
            "safety_stock": {"required": False, "type": "numeric", "aliases": ["buffer_stock", "safety_level"]},
            "lead_time_days": {"required": False, "type": "numeric", "aliases": ["lead_time", "delivery_days", "supplier_lead_time"]}
        }
    },
    "customers": {
        "fields": {
            "customer_code": {"required": True, "type": "string", "aliases": ["customer_id", "client_id", "code", "cust_code", "id"]},
            "name": {"required": True, "type": "string", "aliases": ["customer_name", "client_name", "company_name", "full_name"]},
            "email": {"required": False, "type": "string", "aliases": ["contact_email", "email_address", "mail"]},
            "phone": {"required": False, "type": "string", "aliases": ["telephone", "mobile", "contact_number"]},
            "segment": {"required": False, "type": "string", "aliases": ["tier", "customer_tier", "group", "type"]}
        }
    },
    "inventory": {
        "fields": {
            "sku": {"required": True, "type": "string", "aliases": ["product_id", "product_code", "item_code", "item_sku"]},
            "warehouse_code": {"required": False, "type": "string", "aliases": ["warehouse", "wh_code", "location_code", "store_id"]},
            "transaction_type": {"required": True, "type": "string", "aliases": ["type", "movement_type", "action"]},
            "quantity": {"required": True, "type": "numeric", "aliases": ["qty", "units", "amount", "delta"]},
            "unit_cost": {"required": False, "type": "numeric", "aliases": ["cost", "cost_price", "valuation_rate"]},
            "reference_id": {"required": False, "type": "string", "aliases": ["reference", "ref_no", "order_id", "po_number"]},
            "transaction_date": {"required": True, "type": "datetime", "aliases": ["date", "timestamp", "movement_date"]}
        }
    }
}

def normalize_col_name(col: str) -> str:
    """Normalizes column names by converting to lower snake_case and stripping symbols."""
    col = re.sub(r"[^\w\s]", "", str(col).lower().strip())
    return re.sub(r"[-\s]+", "_", col)

def generate_column_suggestions(
    uploaded_columns: List[str],
    target_entity: str
) -> Dict[str, Any]:
    """
    Intelligently suggests mappings from uploaded file columns to canonical target schema.
    Uses fuzzy alias matching, normalized similarity, and canonical schema definitions.
    """
    entity_schema = CANONICAL_SCHEMAS.get(target_entity.lower(), CANONICAL_SCHEMAS["sales"])
    canonical_fields = entity_schema["fields"]

    mappings: Dict[str, Optional[str]] = {}
    confidence_scores: Dict[str, float] = {}

    normalized_uploaded = {col: normalize_col_name(col) for col in uploaded_columns}

    # For each canonical field, find the best matching uploaded column
    assigned_uploaded_cols = set()

    for canon_field, field_def in canonical_fields.items():
        aliases = [canon_field] + field_def.get("aliases", [])
        best_col = None
        best_score = 0.0

        for col, norm_col in normalized_uploaded.items():
            if col in assigned_uploaded_cols:
                continue

            # Exact match
            if norm_col in aliases:
                best_col = col
                best_score = 1.0
                break

            # Substring match
            for alias in aliases:
                if alias in norm_col or norm_col in alias:
                    score = 0.85
                    if score > best_score:
                        best_col = col
                        best_score = score

        if best_col and best_score >= 0.7:
            mappings[canon_field] = best_col
            confidence_scores[canon_field] = best_score
            assigned_uploaded_cols.add(best_col)
        else:
            mappings[canon_field] = None
            confidence_scores[canon_field] = 0.0

    return {
        "target_entity": target_entity,
        "suggested_mappings": mappings,
        "confidence_scores": confidence_scores,
        "canonical_fields": canonical_fields,
        "unmapped_columns": [col for col in uploaded_columns if col not in assigned_uploaded_cols]
    }
