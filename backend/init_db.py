import sys
from sqlalchemy import text
from app.db.session import engine
from app.db.base import Base
import app.models

def init_tables():
    print("Connecting to database and creating tables...")
    Base.metadata.create_all(bind=engine)
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMPTZ;"))
            conn.execute(text("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;"))
            conn.execute(text("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(32) DEFAULT 'trialing';"))
        print("Schema columns migrated successfully!")
    except Exception as e:
        print(f"Notice during migration check: {e}")
    print("All tables created successfully in database!")

if __name__ == "__main__":
    init_tables()
