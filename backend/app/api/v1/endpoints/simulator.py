from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_tenant_context
from app.core.tenant import TenantContext
from app.schemas.recommendation import SimulationRequest, SimulationResponse
from app.services.simulation_service import simulate_business_scenario

router = APIRouter()

@router.post("/run", response_model=SimulationResponse)
def run_simulation(
    request: SimulationRequest,
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """
    Executes a counterfactual business simulation scenario (Pricing, Demand, Inventory, Costs)
    grounded in verified organization database records.
    """
    result = simulate_business_scenario(
        db=db,
        org_id=tenant.organization_id,
        scenario_type=request.scenario_type,
        change_pct=request.parameter_change_percentage,
        elasticity=request.elasticity_coefficient or 1.6
    )
    return result
