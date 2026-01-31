from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from ..services.profile_service import profile_service
from ..core.security import get_current_user

router = APIRouter()

@router.get("/waitlist")
def get_waitlist():
    """
    Get all active recipients on the waitlist.
    """
    # In a real app, strict auth would be required
    # dependencies=[Depends(get_current_user)]
    return profile_service.get_recipients()

@router.get("/inventory")
def get_inventory():
    """
    Get all active donors/organs in inventory.
    """
    return profile_service.get_donors()

@router.post("/recipient")
def create_recipient(recipient_data: Dict[str, Any]):
    """
    Register a new recipient.
    """
    # Simply forward the data to the service
    result = profile_service.add_recipient(recipient_data)
    return result
