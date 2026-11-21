import os
import sys
from sqlalchemy import text, inspect
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
import app.models

def clean_database():
    print("=" * 60)
    print("1. CLEANING DATABASE (NEON POSTGRESQL)")
    print("=" * 60)
    
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    print(f"Found {len(table_names)} tables in database:")
    
    with engine.connect() as conn:
        counts = {}
        for table in table_names:
            try:
                res = conn.execute(text(f'SELECT COUNT(*) FROM "{table}"'))
                count = res.scalar()
                counts[table] = count
                print(f"  - {table}: {count} rows")
            except Exception as e:
                print(f"  - {table}: Could not count ({e})")
                
    print("\nTruncating all tables with CASCADE...")
    with engine.begin() as conn:
        # Disable triggers if needed, or truncate cascade
        for table in table_names:
            try:
                conn.execute(text(f'TRUNCATE TABLE "{table}" RESTART IDENTITY CASCADE;'))
                print(f"  [OK] Truncated {table}")
            except Exception as e:
                print(f"  [WARN] Truncate failed on {table} ({e}), trying DELETE...")
                try:
                    conn.execute(text(f'DELETE FROM "{table}";'))
                    print(f"  [OK] Deleted from {table}")
                except Exception as e2:
                    print(f"  [ERROR] Failed to delete from {table}: {e2}")

    print("\nVerifying database is empty:")
    total_remaining = 0
    with engine.connect() as conn:
        for table in table_names:
            res = conn.execute(text(f'SELECT COUNT(*) FROM "{table}"'))
            count = res.scalar()
            total_remaining += count
            if count > 0:
                print(f"  [!] {table}: still has {count} rows!")
            else:
                print(f"  [0] {table}: 0 rows")

    print(f"\nDatabase clean complete! Total rows remaining: {total_remaining}")
    return total_remaining == 0


def clean_bucket():
    print("\n" + "=" * 60)
    print("2. CLEANING DOCUMENT STORAGE BUCKET (NEON S3)")
    print("=" * 60)
    
    import boto3
    from botocore.config import Config

    endpoint = settings.NEON_STORAGE_ENDPOINT
    access_key = settings.NEON_STORAGE_ACCESS_KEY
    secret_key = settings.NEON_STORAGE_SECRET_KEY
    bucket_name = settings.NEON_STORAGE_BUCKET or "marginpilot-docs"
    region = settings.NEON_STORAGE_REGION or "ap-southeast-1"

    print(f"Bucket: {bucket_name}")
    print(f"Endpoint: {endpoint}")
    print(f"Region: {region}")

    if not (endpoint and access_key and secret_key):
        print("Neon S3 credentials not fully configured in settings.")
        return False

    try:
        s3 = boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
            config=Config(signature_version="s3v4")
        )

        print("\nListing objects in bucket...")
        paginator = s3.get_paginator("list_objects_v2")
        deleted_count = 0

        for page in paginator.paginate(Bucket=bucket_name):
            if "Contents" in page:
                objects_to_delete = [{"Key": obj["Key"]} for obj in page["Contents"]]
                print(f"Found {len(objects_to_delete)} objects in bucket to delete:")
                for obj in objects_to_delete:
                    print(f"  - Deleting: {obj['Key']}")
                
                resp = s3.delete_objects(
                    Bucket=bucket_name,
                    Delete={"Objects": objects_to_delete, "Quiet": False}
                )
                deleted_count += len(objects_to_delete)
            else:
                print("No objects found in this page.")

        print(f"\nTotal objects deleted from bucket '{bucket_name}': {deleted_count}")

        # Verify bucket is empty
        verify_resp = s3.list_objects_v2(Bucket=bucket_name, MaxKeys=5)
        remaining = verify_resp.get("KeyCount", 0)
        print(f"Remaining objects in bucket: {remaining}")
        if remaining == 0:
            print("Bucket is completely empty!")
        return remaining == 0
    except Exception as e:
        print(f"Error accessing/cleaning S3 bucket: {e}")
        return False


def clean_local_storage():
    print("\n" + "=" * 60)
    print("3. CLEANING LOCAL STORAGE UPLOADS")
    print("=" * 60)
    import shutil
    from pathlib import Path
    
    local_dir = Path("./storage_uploads")
    if local_dir.exists():
        files_deleted = 0
        for item in local_dir.glob("**/*"):
            if item.is_file():
                item.unlink()
                files_deleted += 1
        print(f"Cleaned {files_deleted} files from local ./storage_uploads")
    else:
        print("No local ./storage_uploads directory found.")


def clean_redis():
    print("\n" + "=" * 60)
    print("4. CLEANING CACHE (UPSTASH REDIS)")
    print("=" * 60)
    try:
        import redis
        if settings.REDIS_URL:
            r = redis.from_url(settings.REDIS_URL, decode_responses=True)
            keys = r.keys("*")
            print(f"Found {len(keys)} keys in Redis cache.")
            if keys:
                for k in keys:
                    print(f"  - Flushing key: {k}")
                r.flushdb()
                print("Redis cache flushed successfully!")
            else:
                print("Redis cache is already empty.")
    except Exception as e:
        print(f"Note on Redis flush: {e}")


if __name__ == "__main__":
    db_clean = clean_database()
    bucket_clean = clean_bucket()
    clean_local_storage()
    clean_redis()
    print("\n" + "=" * 60)
    print(f"SUMMARY: Database empty: {db_clean} | Bucket empty: {bucket_clean}")
    print("=" * 60)
