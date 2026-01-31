from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProfileCreate(BaseModel):
    role: str
    blood_type: str
    age: int
    location: str
    comorbidities: Optional[str] = "None"
    hla_markers: str
    urgency_score: Optional[int] = 0

class ProfileResponse(ProfileCreate):
    id: int
    created_at: Optional[str] = None

class GlobalMatchRequest(BaseModel):
    recipient_id: Any

class MatchScoreBreakdown(BaseModel):
    blood: float
    hla: float
    proximity: float
    urgency: float

class MatchResult(BaseModel):
    donor_id: Any
    score: float
    blood_type: str
    donor_organs: List[str] = []
    location: str
# ... (rest of MatchResult fields are fine)
    match_reason: str
    privacy_note: str
    raw_score: float
    distance_km: float
    score_breakdown: MatchScoreBreakdown
    success_probability: float

class MatchResponse(BaseModel):
    recipient: Dict[str, Any]
    matches: List[MatchResult]

class GlobalMatchResult(BaseModel):
    donor_id: Any
    exact_score: float
    noisy_score: float
    prob_success: float
    location: str
    donor_organs: List[str] = []

class GlobalMatchResponse(BaseModel):
    matches: List[GlobalMatchResult]

class MatchRequestCreate(BaseModel):
    donor_id: str
    donor_organs: List[str] = []
    noisy_score: float
    exact_score: float
    prob_success: float
    location: str
    requested_by_uid: str
    requested_by_email: str
    requested_by_name: str

class MatchAcceptCreate(BaseModel):
    request_id: str
    request_data: Dict[str, Any]
