from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

class AIRecommendationResponse(BaseModel):
    id: str
    organization_id: str
    category: str
    title: str
    description: str
    impact_summary: str
    severity: str
    status: str
    action_payload: Optional[Dict[str, Any]] = None
    expected_roi: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UpdateRecommendationStatusRequest(BaseModel):
    status: str  # PENDING, ACCEPTED, DISMISSED, COMPLETED

class SimulationRequest(BaseModel):
    scenario_type: str = "PRICING"  # PRICING, DEMAND, INVENTORY, COSTS
    parameter_change_percentage: float = -10.0  # e.g. -10% price reduction
    elasticity_coefficient: Optional[float] = 1.6  # Default price elasticity of demand

class SimulationCurvePoint(BaseModel):
    step: str
    revenue: float
    profit: float
    margin: float

class SimulationResponse(BaseModel):
    scenario_type: str
    parameter_change_pct: float
    expected_revenue_change_pct: float
    expected_profit_change_pct: float
    expected_gross_margin_pct: float
    projected_stockout_risk_pct: float
    current_revenue: float
    simulated_revenue: float
    current_profit: float
    simulated_profit: float
    curve: List[SimulationCurvePoint]
    executive_summary: str
