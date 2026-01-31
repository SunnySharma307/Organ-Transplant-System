from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from ..core.security import get_current_user
from ..core.firebase import db
from ..models.schemas import MatchResponse, MatchResult, GlobalMatchRequest, GlobalMatchResponse, GlobalMatchResult
from ..services.profile_service import profile_service
from ..services.matching import get_blood_compatibility, basic_compatibility_score, noisy_score, get_noisy_age_diff, parse_hla, private_compatibility_score
from ..services.ml_model import ml_service
from datetime import datetime

router = APIRouter()

@router.get("/allocations", response_model=List[dict])
def get_recent_allocations():
    """
    Finds matches for the top 5 most urgent/recent pending patients.
    Returns a list of allocation requests with patient details and best match found.
    Persists these matches to Firestore 'matches' collection.
    """
    # 1. Get Recipients (Top 5 by urgency or recency)
    all_patients = profile_service.get_recipients()
    # Sort by urgency_score desc
    pending_patients = sorted(all_patients, key=lambda p: p.get("urgency_score", 0), reverse=True)[:5]

    # Debug Logging
    with open("debug_log.txt", "a") as f:
        f.write(f"\n--- API Call {datetime.utcnow()} ---\n")
        f.write(f"Found {len(all_patients)} total recipients.\n")
        f.write(f"Processing {len(pending_patients)} pending patients.\n")

    allocations = []
    donors = profile_service.get_donors()
    
    for patient in pending_patients:
        best_match = None
        highest_score = 0
        status = "Pending"
        
        # Find best match from donors
        for donor in donors:
             # Basic hard constraint: Blood Type
             # Note: logic should be robust enough to handle strict checks
             if not get_blood_compatibility(donor["blood_type"], patient["blood_type"]):
                 continue
                 
             score, _, _ = basic_compatibility_score(patient, donor)
             if score > highest_score:
                 highest_score = score
                 best_match = donor
        
        # Determine status/color
        status_color = "bg-slate-100 text-slate-700"
        if highest_score > 0.8:
            status = "Match Found"
            status_color = "bg-green-100 text-green-800"
        elif highest_score > 0.5:
            status = "Potential Match"
            status_color = "bg-blue-100 text-blue-800"
        else:
            status = "Waiting"
            status_color = "bg-amber-100 text-amber-800"

        allocation_record = {
            "id": f"REQ-{patient['id'][:4].upper()}",
            "patient_id": patient['id'],
            "organ": patient.get("organ_required", "Unknown"),
            "patient_name": patient['name'],
            "patient_details": f"{patient['name']} ({patient['blood_type']}/{patient['age']}y)",
            "urgency_score": patient.get('urgency_score'),
            "score_display": f"Urgency: {patient.get('urgency_score')}/10",
            "status": status,
            "statusColor": status_color,
            "best_match_donor_id": best_match['id'] if best_match else None,
            "match_score": highest_score,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        allocations.append({
            "id": allocation_record["id"],
            "organ": allocation_record["organ"],
            "patient": allocation_record["patient_details"],
            "score": allocation_record["score_display"],
            "status": allocation_record["status"],
            "statusColor": allocation_record["statusColor"],
            "best_match_donor": allocation_record["best_match_donor_id"]
        })

        # Save to Firestore
        try:
            db.collection('matches').document(allocation_record["id"]).set(allocation_record)
            with open("debug_log.txt", "a") as f:
                f.write(f"SUCCESS: Saved match {allocation_record['id']}\n")
        except Exception as e:
            error_msg = f"ERROR saving match {allocation_record['id']}: {e}\n"
            print(error_msg)
            with open("debug_log.txt", "a") as f:
                f.write(error_msg)
        
    return allocations

@router.get("/{recipient_id}", response_model=MatchResponse) # Removed auth dependency for demo ease, or keep it strict? Keeping strict but might need loose for initial test if token is tricky.
# STRICT MODE: dependencies=[Depends(get_current_user)]
def find_matches(recipient_id: int): #, user=Depends(get_current_user)):
    # 1. Find Recipient
    recipient = profile_service.get_by_id(recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    if recipient["role"] != "recipient":
        raise HTTPException(status_code=400, detail="ID belongs to a donor, not recipient")

    # 2. Get Donors
    donors = profile_service.get_donors()
    
    matches = []
    
    for donor in donors:
        # Pre-filter
        is_compat = get_blood_compatibility(donor["blood_type"], recipient["blood_type"])
        if not is_compat:
            continue
            
        r_age = recipient["age"]
        d_age = donor["age"]
        
        age_diff = abs(d_age - r_age)
        
        # Calculate 0-1 Score
        compat_score, breakdown, distance_km = basic_compatibility_score(recipient, donor)

        if compat_score > 0.2: # Loose threshold
            # Privacy Noise
            noisy_age = get_noisy_age_diff(float(age_diff))
            noisy_compat_score = noisy_score(compat_score)
            
            # Predict Success
            success_prob = ml_service.predict_probability(donor['age'], recipient.get('urgency_score', 0))

            matches.append(MatchResult(
                donor_id=donor["id"],
                score=round(noisy_compat_score * 100, 1),
                blood_type=donor["blood_type"],
                donor_organs=donor.get("organs_available", []),
                location=donor["location"],
                match_reason=f"Combined Score {compat_score:.2f} (Blood/HLA/Loc)",
                privacy_note=f"DP Applied: Age ±{abs(noisy_age-age_diff)}, Score ±{abs(round(noisy_compat_score-compat_score, 2))}",
                raw_score=float(compat_score),
                distance_km=distance_km,
                score_breakdown=breakdown,
                success_probability=round(success_prob * 100, 1)
            ))
            
    # Sort by score
    matches.sort(key=lambda x: x.raw_score, reverse=True)
    
    return MatchResponse(
        recipient={
            "id": recipient["id"],
            "blood_type": recipient["blood_type"],
            "urgency": recipient.get("urgency_score")
        },
        matches=matches[:10]
    )

@router.post("", response_model=GlobalMatchResponse) # Global match map
def find_matches_global(request: GlobalMatchRequest):
    recipient_id = request.recipient_id
    recipient = profile_service.get_by_id(recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    matches = []
    donors = profile_service.get_donors()
    
    for donor in donors:
        if not get_blood_compatibility(donor["blood_type"], recipient["blood_type"]):
            continue

        # Re-using private score logic from old main.py (refactored)
        # Note: private_compatibility_score wasn't in matching.py, I'll inline it or use basic + noisy
        compat_score, _, _ = basic_compatibility_score(recipient, donor)
        noisy = noisy_score(compat_score)
        
        prob = ml_service.predict_probability(donor['age'], recipient.get('urgency_score', 0))
        
        matches.append(GlobalMatchResult(
            donor_id=donor["id"],
            exact_score=round(compat_score, 3),
            noisy_score=round(noisy, 3),
            prob_success=round(prob, 3),
            location=donor["location"],
            donor_organs=donor.get("organs_available", [])
        ))

    top_matches = sorted(matches, key=lambda x: x.noisy_score, reverse=True)[:5]
    
    # Persistence: Save the best match for this recipient to Firestore
    if top_matches:
        best = top_matches[0]
        # fetch full donor details if needed, but we have enough in 'best' for a summary
        # we need 'status', 'urgency' etc which are on 'recipient'
        
        # Determine status based on raw score (we only have noisy score in the object, 
        # but we iterate. Let's rely on noisy or re-calculate? 
        # Actually we have exact_score in GlobalMatchResult)
        
        status = "Pending"
        status_color = "bg-slate-100 text-slate-700"
        
        if best.exact_score > 0.8:
            status = "Match Found"
            status_color = "bg-green-100 text-green-800"
        elif best.exact_score > 0.5:
            status = "Potential Match"
            status_color = "bg-blue-100 text-blue-800"
        else:
            status = "Waiting"
            status_color = "bg-amber-100 text-amber-800"
            
        # safely handle ID
        r_id_str = str(recipient["id"])
        match_id = f"REQ-{r_id_str[:4].upper()}" if len(r_id_str) >= 4 else f"REQ-{r_id_str}"
        
        allocation_record = {
            "id": match_id,
            "patient_id": recipient['id'],
            "organ": recipient.get("organ_required", "Unknown"),
            "patient_name": recipient['name'],
            "patient_details": f"{recipient['name']} ({recipient['blood_type']}/{recipient['age']}y)",
            "urgency_score": recipient.get('urgency_score'),
            "score_display": f"Urgency: {recipient.get('urgency_score')}/10",
            "status": status,
            "statusColor": status_color,
            "best_match_donor_id": best.donor_id,
            "match_score": best.exact_score,
            "timestamp": datetime.utcnow().isoformat()
        }

        try:
             db.collection('matches').document(allocation_record["id"]).set(allocation_record)
        except Exception as e:
             print(f"Error saving global match {match_id}: {e}")

    return GlobalMatchResponse(matches=top_matches)

from ..models.schemas import MatchRequestCreate

@router.post("/request")
def create_match_request(request: MatchRequestCreate):
    """
    Submit a formal request for a donor match.
    """
    data = request.dict()
    data["requested_at"] = datetime.utcnow().isoformat()
    data["status"] = "pending"
    
    # Save to Firestore 'requests' collection (Admin SDK)
    try:
        # Note: db.collection().add returns (update_time, doc_ref)
        update_time, doc_ref = db.collection('requests').add(data)
        return {"success": True, "id": doc_ref.id, "message": "Request submitted successfully"}
    except Exception as e:
        print(f"Error saving request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from ..models.schemas import MatchAcceptCreate

@router.post("/accept")
def accept_match_request(acceptance: MatchAcceptCreate):
    """
    Accept a match request.
    Updates the request status and adds an entry to requests_accepted.
    """
    try:
        request_id = acceptance.request_id
        data = acceptance.request_data
        
        # Determine collection based on ID or try both
        # System allocations (matches) use custom IDs starting with "REQ-" usually, 
        # while user requests use auto-generated IDs.
        
        target_collection = 'requests'
        doc_ref = db.collection(target_collection).document(request_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            # Try 'matches' collection
            target_collection = 'matches'
            doc_ref = db.collection(target_collection).document(request_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                 raise HTTPException(status_code=404, detail=f"Request/Match {request_id} not found")

        # Update status
        doc_ref.update({
            "status": "accepted",
            "accepted_at": datetime.utcnow().isoformat()
        })
        
        # Create a copy in requests_accepted collection
        accepted_data = data.copy()
        accepted_data.update({
            "status": "accepted",
            "accepted_at": datetime.utcnow().isoformat(),
            "original_request_id": request_id,
            "original_collection": target_collection
        })
        
        # Remove docId/id to avoid conflicts
        accepted_data.pop("id", None) 
        accepted_data.pop("docId", None) 
        
        _, new_doc_ref = db.collection('requests_accepted').add(accepted_data)
        
        return {"success": True, "id": new_doc_ref.id, "message": "Accepted successfully"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error accepting request: {e}")
        raise HTTPException(status_code=500, detail=str(e))



