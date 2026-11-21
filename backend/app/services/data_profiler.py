import io
from typing import Dict, Any, List
import pandas as pd
import numpy as np

def profile_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs comprehensive statistical profiling on an uploaded business dataset.
    Computes column data types, missing value percentages, cardinality, and summary stats.
    """
    total_rows = len(df)
    total_cols = len(df.columns)

    columns_profile = []
    for col in df.columns:
        series = df[col]
        null_count = int(series.isnull().sum())
        null_pct = round((null_count / total_rows * 100) if total_rows > 0 else 0, 2)
        unique_count = int(series.nunique(dropna=True))
        
        # Sample values (up to 5 distinct non-null strings)
        sample_vals = [str(x) for x in series.dropna().unique()[:5]]

        # Infer refined type
        dtype_str = "string"
        stats: Dict[str, Any] = {}

        if pd.api.types.is_numeric_dtype(series):
            dtype_str = "numeric"
            non_null = series.dropna()
            if len(non_null) > 0:
                stats = {
                    "min": float(non_null.min()),
                    "max": float(non_null.max()),
                    "mean": round(float(non_null.mean()), 2),
                    "median": round(float(non_null.median()), 2),
                }
        elif pd.api.types.is_datetime64_any_dtype(series):
            dtype_str = "datetime"
        elif pd.api.types.is_bool_dtype(series):
            dtype_str = "boolean"
        else:
            # Check if strings can be parsed as dates
            try:
                pd.to_datetime(series.dropna().head(20), errors="raise")
                dtype_str = "datetime"
            except Exception:
                dtype_str = "string"

        columns_profile.append({
            "column_name": str(col),
            "inferred_type": dtype_str,
            "null_count": null_count,
            "null_percentage": null_pct,
            "unique_count": unique_count,
            "sample_values": sample_vals,
            "stats": stats
        })

    # Sample rows (first 10 rows converted to JSON-serializable dictionaries)
    preview_df = df.head(10).replace({np.nan: None})
    sample_rows = preview_df.to_dict(orient="records")

    return {
        "total_rows": total_rows,
        "total_columns": total_cols,
        "columns": columns_profile,
        "preview_rows": sample_rows
    }

def read_file_to_df(content: bytes, filename: str) -> pd.DataFrame:
    """Reads CSV, XLSX, or JSON file bytes into a clean Pandas DataFrame."""
    lower_name = filename.lower()
    if lower_name.endswith(".csv"):
        return pd.read_csv(io.BytesIO(content))
    elif lower_name.endswith((".xlsx", ".xls")):
        return pd.read_excel(io.BytesIO(content))
    elif lower_name.endswith(".json"):
        return pd.read_json(io.BytesIO(content))
    else:
        # Default try CSV
        return pd.read_csv(io.BytesIO(content))
