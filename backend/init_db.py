import sys
from app.db.session import engine
from app.db.base import Base
import app.models

def init_tables():
    print("Connecting to database and creating tables...")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully in database!")

if __name__ == "__main__":
    init_tables()
