from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.customer import Customer
from app.models.product import Product, ProductCategory
from app.models.supplier import Supplier
from app.models.warehouse import Warehouse
from app.models.sales_order import SalesOrder, SalesOrderItem
from app.models.inventory import InventoryTransaction
from app.models.data_import import DataImportJob, ImportStatus
from app.models.audit import AuditLog

def commit_import_job(
    db: Session,
    import_job: DataImportJob,
    valid_records: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Idempotently imports validated records into the canonical database tables
    scoped strictly to the organization_id of the import job.
    """
    org_id = import_job.organization_id
    target = import_job.target_entity.lower()
    imported_count = 0

    try:
        import_job.status = ImportStatus.IMPORTING.value
        db.flush()

        if target == "products":
            for rec in valid_records:
                sku = rec["sku"]
                existing = db.execute(
                    select(Product).where(Product.organization_id == org_id, Product.sku == sku)
                ).scalar_one_or_none()

                cost = float(rec.get("cost_price") or 0.0)
                price = float(rec.get("selling_price") or 0.0)
                reorder = int(rec.get("reorder_point") or 10)
                safety = int(rec.get("safety_stock") or 5)
                lead_time = int(rec.get("lead_time_days") or 7)

                if existing:
                    existing.name = rec["name"]
                    existing.cost_price = cost
                    existing.selling_price = price
                    existing.reorder_point = reorder
                    existing.safety_stock = safety
                    existing.lead_time_days = lead_time
                else:
                    new_prod = Product(
                        organization_id=org_id,
                        sku=sku,
                        name=rec["name"],
                        cost_price=cost,
                        selling_price=price,
                        reorder_point=reorder,
                        safety_stock=safety,
                        lead_time_days=lead_time,
                        is_active=True
                    )
                    db.add(new_prod)
                imported_count += 1

        elif target == "customers":
            for rec in valid_records:
                code = rec["customer_code"]
                existing = db.execute(
                    select(Customer).where(Customer.organization_id == org_id, Customer.customer_code == code)
                ).scalar_one_or_none()

                segment = rec.get("segment") or "REGULAR"
                email = rec.get("email")
                phone = rec.get("phone")

                if existing:
                    existing.name = rec["name"]
                    if email:
                        existing.email = email
                    if phone:
                        existing.phone = phone
                    existing.segment = segment
                else:
                    new_cust = Customer(
                        organization_id=org_id,
                        customer_code=code,
                        name=rec["name"],
                        email=email,
                        phone=phone,
                        segment=segment
                    )
                    db.add(new_cust)
                imported_count += 1

        elif target == "sales":
            # Group items by order_number
            orders_map: Dict[str, List[Dict[str, Any]]] = {}
            for rec in valid_records:
                order_no = rec["order_number"]
                orders_map.setdefault(order_no, []).append(rec)

            for order_no, items in orders_map.items():
                first_item = items[0]
                cust_code = first_item.get("customer_code")
                customer_id = None

                # Resolve or automatically create customer if customer_code exists
                if cust_code:
                    cust = db.execute(
                        select(Customer).where(Customer.organization_id == org_id, Customer.customer_code == cust_code)
                    ).scalar_one_or_none()
                    if not cust:
                        cust = Customer(
                            organization_id=org_id,
                            customer_code=cust_code,
                            name=f"Customer {cust_code}",
                            segment="NEW"
                        )
                        db.add(cust)
                        db.flush()
                    customer_id = cust.id

                # Calculate order totals and COGS
                subtotal = 0.0
                total_cogs = 0.0
                order_date = datetime.now(timezone.utc)
                if first_item.get("transaction_date"):
                    try:
                        order_date = datetime.fromisoformat(first_item["transaction_date"])
                    except Exception:
                        pass

                order = db.execute(
                    select(SalesOrder).where(SalesOrder.organization_id == org_id, SalesOrder.order_number == order_no)
                ).scalar_one_or_none()

                if not order:
                    order = SalesOrder(
                        organization_id=org_id,
                        customer_id=customer_id,
                        order_number=order_no,
                        order_date=order_date,
                        status=first_item.get("status") or "DELIVERED"
                    )
                    db.add(order)
                    db.flush()

                for item in items:
                    sku = item.get("sku")
                    qty = float(item.get("quantity") or 1.0)
                    price = float(item.get("unit_price") or 0.0)
                    cost = float(item.get("unit_cost") or 0.0)
                    disc = float(item.get("discount") or 0.0)
                    line_total = (qty * price) - disc
                    line_cogs = qty * cost

                    # Resolve product if exists
                    prod_id = None
                    if sku:
                        prod = db.execute(
                            select(Product).where(Product.organization_id == org_id, Product.sku == sku)
                        ).scalar_one_or_none()
                        if not prod:
                            prod = Product(
                                organization_id=org_id,
                                sku=sku,
                                name=item.get("product_name") or f"Product {sku}",
                                cost_price=cost,
                                selling_price=price,
                                is_active=True
                            )
                            db.add(prod)
                            db.flush()
                        prod_id = prod.id

                    order_item = SalesOrderItem(
                        organization_id=org_id,
                        sales_order_id=order.id,
                        product_id=prod_id,
                        quantity=qty,
                        unit_cost=cost,
                        unit_price=price,
                        discount=disc,
                        line_total=line_total
                    )
                    db.add(order_item)
                    subtotal += line_total
                    total_cogs += line_cogs

                order.subtotal = subtotal
                order.total_amount = subtotal
                order.cogs_amount = total_cogs
                order.gross_profit = subtotal - total_cogs
                imported_count += 1

        elif target == "inventory":
            for rec in valid_records:
                sku = rec["sku"]
                prod = db.execute(
                    select(Product).where(Product.organization_id == org_id, Product.sku == sku)
                ).scalar_one_or_none()
                if not prod:
                    prod = Product(
                        organization_id=org_id,
                        sku=sku,
                        name=f"Product {sku}",
                        cost_price=float(rec.get("unit_cost") or 0.0),
                        is_active=True
                    )
                    db.add(prod)
                    db.flush()

                txn_date = datetime.now(timezone.utc)
                if rec.get("transaction_date"):
                    try:
                        txn_date = datetime.fromisoformat(rec["transaction_date"])
                    except Exception:
                        pass

                inv_txn = InventoryTransaction(
                    organization_id=org_id,
                    product_id=prod.id,
                    transaction_type=rec.get("transaction_type") or "ADJUSTMENT",
                    quantity=float(rec.get("quantity") or 0.0),
                    unit_cost=float(rec.get("unit_cost") or 0.0),
                    reference_id=rec.get("reference_id"),
                    transaction_date=txn_date
                )
                db.add(inv_txn)
                imported_count += 1

        # Update Job Status
        import_job.status = ImportStatus.COMPLETED.value
        import_job.valid_rows = imported_count

        # Create audit entry
        audit = AuditLog(
            organization_id=org_id,
            user_id=import_job.user_id,
            action="DATA_IMPORT_COMPLETED",
            entity_type=target,
            details=f"Imported {imported_count} records from file '{import_job.filename}'"
        )
        db.add(audit)
        db.commit()

        return {
            "status": "COMPLETED",
            "imported_count": imported_count,
            "target_entity": target
        }

    except Exception as e:
        db.rollback()
        import_job.status = ImportStatus.FAILED.value
        import_job.error_message = str(e)
        db.commit()
        raise e
