import os
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class MLflowRegistry:
    """
    Lightweight, embedded experiment tracker and model registry compatible
    with MLflow's tracking concepts (runs, metrics, parameters, artifact URIs).
    Persists training runs, tracks Champion vs Challenger models, and records versions.
    """
    def __init__(self, base_artifact_dir: str = "artifacts/ml"):
        self.base_artifact_dir = base_artifact_dir
        os.makedirs(self.base_artifact_dir, exist_ok=True)

    def log_run(
        self,
        experiment_name: str,
        model_name: str,
        version: str,
        params: Dict[str, Any],
        metrics: Dict[str, Any],
        artifact_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """Logs an experimental training run."""
        run_record = {
            "experiment_name": experiment_name,
            "model_name": model_name,
            "version": version,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "params": params,
            "metrics": metrics,
            "artifact_path": artifact_path,
        }

        exp_dir = os.path.join(self.base_artifact_dir, experiment_name)
        os.makedirs(exp_dir, exist_ok=True)
        run_file = os.path.join(exp_dir, f"{model_name}_v{version}.json")

        with open(run_file, "w", encoding="utf-8") as f:
            json.dump(run_record, f, indent=2)

        return run_record

mlflow_registry = MLflowRegistry()
