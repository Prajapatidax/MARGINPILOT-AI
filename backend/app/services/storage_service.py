import os
import uuid
from typing import Optional, Dict, Any, List
from pathlib import Path
from app.core.config import settings

class NeonStorageService:
    """
    Document and artifact storage service supporting Neon S3-compatible bucket storage
    (via boto3 / AWS Signature v4) with automatic local filesystem fallback for development/testing.
    """
    def __init__(self):
        self.mode = "local"
        self.s3_client = None
        self.bucket = settings.NEON_STORAGE_BUCKET or "marginpilot-docs"
        self.local_dir = Path("./storage_uploads")

        if os.environ.get("TESTING") == "true":
            self.mode = "local"
            self.local_dir.mkdir(parents=True, exist_ok=True)
            return

        if settings.NEON_STORAGE_ENDPOINT and settings.NEON_STORAGE_ACCESS_KEY and settings.NEON_STORAGE_SECRET_KEY:
            try:
                import boto3
                from botocore.config import Config

                self.s3_client = boto3.client(
                    "s3",
                    endpoint_url=settings.NEON_STORAGE_ENDPOINT,
                    aws_access_key_id=settings.NEON_STORAGE_ACCESS_KEY,
                    aws_secret_access_key=settings.NEON_STORAGE_SECRET_KEY,
                    region_name=settings.NEON_STORAGE_REGION or "us-east-1",
                    config=Config(signature_version="s3v4")
                )
                self.mode = "neon_s3"
            except Exception as e:
                print(f"Neon S3 storage client initialization error: {e}. Falling back to local storage.")
                self.mode = "local"

        if self.mode == "local":
            self.local_dir.mkdir(parents=True, exist_ok=True)

    def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "application/octet-stream",
        folder: str = "documents"
    ) -> Dict[str, Any]:
        """
        Uploads file to Neon storage bucket (or local filesystem fallback).
        Returns key, access url, size, and storage engine type.
        """
        ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4().hex[:12]}_{filename}"
        key = f"{folder.strip('/')}/{unique_name}" if folder else unique_name

        if self.mode == "neon_s3" and self.s3_client:
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_bytes,
                ContentType=content_type
            )
            endpoint_clean = settings.NEON_STORAGE_ENDPOINT.rstrip("/")
            url = f"{endpoint_clean}/{self.bucket}/{key}"
            return {
                "key": key,
                "url": url,
                "filename": filename,
                "size": len(file_bytes),
                "content_type": content_type,
                "storage": "neon_s3"
            }
        else:
            local_path = self.local_dir / key
            local_path.parent.mkdir(parents=True, exist_ok=True)
            with open(local_path, "wb") as f:
                f.write(file_bytes)
            return {
                "key": key,
                "url": f"/static/storage/{key}",
                "filename": filename,
                "size": len(file_bytes),
                "content_type": content_type,
                "storage": "local"
            }

    def download_file(self, key: str) -> Optional[bytes]:
        """Downloads file content bytes by key."""
        try:
            if self.mode == "neon_s3" and self.s3_client:
                response = self.s3_client.get_object(Bucket=self.bucket, Key=key)
                return response["Body"].read()
            else:
                local_path = self.local_dir / key
                if local_path.exists():
                    with open(local_path, "rb") as f:
                        return f.read()
                return None
        except Exception:
            return None

    def get_presigned_url(self, key: str, expiry: int = 3600) -> Optional[str]:
        """Generates a presigned download URL with configurable TTL."""
        try:
            if self.mode == "neon_s3" and self.s3_client:
                return self.s3_client.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": self.bucket, "Key": key},
                    ExpiresIn=expiry
                )
            return f"/static/storage/{key}"
        except Exception:
            return None

    def delete_file(self, key: str) -> bool:
        """Deletes an object by key."""
        try:
            if self.mode == "neon_s3" and self.s3_client:
                self.s3_client.delete_object(Bucket=self.bucket, Key=key)
                return True
            else:
                local_path = self.local_dir / key
                if local_path.exists():
                    local_path.unlink()
                    return True
                return False
        except Exception:
            return False

storage_service = NeonStorageService()
