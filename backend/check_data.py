from app.db.session import SessionLocal
from app.models.organization import Organization
from app.models.user import User
from app.models.sales_order import SalesOrder
from app.models.product import Product
from app.models.customer import Customer
from app.models.inventory import InventoryTransaction
from app.models.recommendation import AIRecommendation

def main():
    db = SessionLocal()
    try:
        org_count = db.query(Organization).count()
        user_count = db.query(User).count()
        sales_count = db.query(SalesOrder).count()
        prod_count = db.query(Product).count()
        cust_count = db.query(Customer).count()
        inv_count = db.query(InventoryTransaction).count()
        rec_count = db.query(AIRecommendation).count()

        print(f"Neon DB Current State:")
        print(f"  Organizations: {org_count}")
        print(f"  Users: {user_count}")
        print(f"  Sales Orders: {sales_count}")
        print(f"  Products: {prod_count}")
        print(f"  Customers: {cust_count}")
        print(f"  Inventory Transactions: {inv_count}")
        print(f"  AI Recommendations: {rec_count}")

        # If any seeded AI recommendations exist, clean them out
        if rec_count > 0:
            print(f"Purging {rec_count} seeded AI recommendations...")
            db.query(AIRecommendation).delete()
            db.commit()
            print("AI Recommendations purged cleanly!")
    finally:
        db.close()

if __name__ == "__main__":
    main()
