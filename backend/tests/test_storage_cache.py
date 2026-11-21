import pytest
from app.services.cache_service import cache_service
from app.services.storage_service import storage_service

def test_cache_service_operations():
    """Verify cache service set, get, delete with automatic fallback."""
    key = "test:user_session_token"
    val = {"user_id": "usr_999", "role": "OWNER", "active": True}

    # Set
    success = cache_service.set(key, val, ex=60)
    assert success is True

    # Get
    retrieved = cache_service.get(key)
    assert retrieved is not None
    assert retrieved["user_id"] == "usr_999"
    assert retrieved["role"] == "OWNER"

    # Delete
    deleted = cache_service.delete(key)
    assert deleted is True

    # Verify deleted
    assert cache_service.get(key) is None

def test_storage_service_lifecycle():
    """Verify Neon bucket storage service (or local fallback) lifecycle."""
    content = b"header1,header2\nvalue1,value2\n"
    filename = "test_sales_data.csv"

    # 1. Upload
    upload_res = storage_service.upload_file(
        file_bytes=content,
        filename=filename,
        content_type="text/csv",
        folder="test_uploads"
    )

    assert "key" in upload_res
    assert upload_res["filename"] == filename
    assert upload_res["size"] == len(content)
    assert upload_res["content_type"] == "text/csv"
    assert upload_res["storage"] in ("neon_s3", "local")

    file_key = upload_res["key"]

    # 2. Download
    downloaded = storage_service.download_file(file_key)
    assert downloaded == content

    # 3. Presigned URL
    url = storage_service.get_presigned_url(file_key, expiry=300)
    assert url is not None
    assert file_key in url or "test_uploads" in url

    # 4. Delete
    delete_res = storage_service.delete_file(file_key)
    assert delete_res is True

    # 5. Confirm deleted
    assert storage_service.download_file(file_key) is None
