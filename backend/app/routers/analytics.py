from fastapi import APIRouter, Depends
from typing import Dict, Any
from ..core.security import get_current_user
from ..services.profile_service import profile_service

router = APIRouter()

@router.get("/dashboard", dependencies=[Depends(get_current_user)])
def get_dashboard_stats() -> Dict[str, Any]:
    donors = profile_service.get_donors()
    recipients = profile_service.get_recipients()
    
    # Calculate simple stats
    active_donors = len(donors)
    # Mock success rate calculation (in real app, based on completed transplants)
    success_rate = 84.7 
    
    # Calculate average wait time (mock)
    avg_wait = 14 

    matches_privacy_count = 1292 # Mock
    
    return {
        "active_donors": {
            "value": f"{active_donors/1000:.1f}K" if active_donors > 1000 else str(active_donors),
            "trend": "-12.4%",
            "trend_dir": "down"
        },
        "success_rate": {
            "value": f"{success_rate}%",
            "trend": "+4.2%",
            "trend_dir": "up"
        },
        "matches_count": {
            "value": f"{matches_privacy_count}",
            "budget_left": "92%"
        },
        "wait_time": {
            "value": f"{avg_wait} Days",
            "change": "Reduced by 3 days"
        }
    }
