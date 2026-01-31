from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from diffprivlib.mechanisms import Gaussian
from geopy.distance import geodesic
import os
from typing import List, Dict, Optional
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Loading ---
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "mock_profiles.json")

try:
    with open(DATA_PATH, "r") as f:
        profiles_data = json.load(f)
    print(f"Loaded {len(profiles_data)} profiles.")
except FileNotFoundError:
    print("Warning: mock_profiles.json not found. Starting with empty data.")
    profiles_data = []

# Convert to DataFrame for easier handling
df_profiles = pd.DataFrame(profiles_data)

# --- Helper Functions ---

def parse_hla(hla_str: str) -> int:
    """Extracts the first number from 'X/Y HLA match potential'"""
    try:
        return int(hla_str.split("/")[0])
    except (ValueError, IndexError, AttributeError):
        return 0

def get_blood_compatibility(donor_type: str, recipient_type: str) -> int:
    """Returns 1 if compatible, 0 otherwise."""
    # Simplified compatibility chart
    compatible = {
        "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        "O+": ["O+", "A+", "B+", "AB+"],
        "A-": ["A-", "A+", "AB-", "AB+"],
        "A+": ["A+", "AB+"],
        "B-": ["B-", "B+", "AB-", "AB+"],
        "B+": ["B+", "AB+"],
        "AB-": ["AB-", "AB+"],
        "AB+": ["AB+"]
    }
    return 1 if recipient_type in compatible.get(donor_type, []) else 0

def haversine_distance(loc1: str, loc2: str) -> float:
    # Parse locations (e.g., "USA-California" → mock coords; use real lat/lon in prod)
    # For MVP, use geopy with approximate coords (add dict of location → (lat, lon))
    location_coords = {
        "USA-California": (37.8, -122.4),
        "USA-New York": (40.7, -74.0),
        "Europe-UK": (51.5, -0.1),
        "Asia-India": (28.6, 77.2),
        "Africa-South Africa": (-33.9, 18.4),
    }
    coord1 = location_coords.get(loc1, (0,0))
    coord2 = location_coords.get(loc2, (0,0))
    return geodesic(coord1, coord2).km  # Returns km

def basic_compatibility_score(recipient: Dict, donor: Dict) -> tuple[float, dict, float]:
    # Blood type match (1.0 perfect, 0.5 compatible, 0 incompatible)
    blood_score = 1.0 if donor["blood_type"] == recipient["blood_type"] else \
                  0.5 if donor["blood_type"] in ["O-", "O+"] or recipient["blood_type"] in ["AB+", "AB-"] else 0.0

    # HLA similarity (parse "X/6" → 0-1)
    hla_str = donor.get("hla_markers", "0/6")
    hla_score = int(hla_str.split("/")[0]) / 6.0

    # Urgency weighting (higher urgency boosts score for recipient)
    urgency_weight = recipient.get("urgency_score", 5) / 10.0  # Normalize 1-10 to 0.1-1.0

    # Proximity (lower distance = higher score; max 10000km → score 0-1)
    dist = haversine_distance(recipient["location"], donor.get("location", "USA-New York"))
    proximity_score = max(0, 1 - (dist / 10000))

    # Combined score (weighted)
    score = (blood_score * 0.4) + (hla_score * 0.3) + (proximity_score * 0.2) + (urgency_weight * 0.1)
    
    breakdown = {
        "blood": round(blood_score, 2),
        "hla": round(hla_score, 2),
        "proximity": round(proximity_score, 2),
        "urgency": round(urgency_weight, 2)
    }
    
    
    return round(score, 3), breakdown, round(dist, 1)

def noisy_score(original_score: float, epsilon: float = 0.5) -> float:
    # Sensitivity is 1.0 because score is bound 0-1
    mech = Gaussian(epsilon=epsilon, delta=1e-5, sensitivity=1.0)
    noisy = mech.randomise(original_score)
    # Clamp between 0 and 1
    return max(0.0, min(1.0, noisy))

# --- ML Model Training (Success Prediction) ---
success_model = RandomForestClassifier(n_estimators=50, random_state=42)

def train_success_model():
    print("Training Success Prediction Model using Mock Data...")
    if df_profiles.empty:
        print("No profiles to train on.")
        return

    # Create synthetic 'success' label for training purposes
    # Rule: Success if donor is O type OR same blood type, AND no severe comorbidities
    def mock_outcome(row):
        # Simplified success logic for training
        if row['role'] != 'donor': return 0
        if row['blood_type'] in ['O-', 'O+']: return 1
        if row.get('comorbidities') == 'None': return 1
        return 0

    df_train = df_profiles.copy()
    df_train['success'] = df_train.apply(mock_outcome, axis=1)
    
    # Features: Age and Urgency Score
    features = ['age', 'urgency_score'] 
    
    X = df_train[features].fillna(0)
    y = df_train['success']
    
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        success_model.fit(X_train, y_train)
        acc = accuracy_score(y_test, success_model.predict(X_test))
        print(f"Success Model Trained. Accuracy: {acc:.2f}")
    except Exception as e:
        print(f"Model training failed: {e}")

# Train on startup
train_success_model()


# --- ID Management ---
# Helper to get next ID if adding users (naive approach)
def get_next_id():
    if not profiles_data:
        return 1
    ids = [p.get("id", 0) for p in profiles_data]
    return max(ids) + 1

# --- Pydantic Models ---
class ProfileCreate(BaseModel):
    role: str
    blood_type: str
    age: int
    location: str
    comorbidities: Optional[str] = "None"
    hla_markers: str
    urgency_score: Optional[int] = 0

# --- Privacy Mechanism ---
dp_mech = Gaussian(epsilon=1.0, delta=1e-5, sensitivity=10) # For Age

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Organ Matching AI Backend Running"}

@app.post("/register")
def register_profile(profile: ProfileCreate):
    new_id = get_next_id()
    new_profile = profile.dict()
    new_profile["id"] = new_id
    new_profile["created_at"] = pd.Timestamp.now().isoformat()
    
    profiles_data.append(new_profile)
    # real app would append to json file or db here
    
    return {"status": "success", "profile_id": new_id}

@app.get("/match/{recipient_id}")
def find_matches(recipient_id: int):
    # 1. Find Recipient
    recipient = next((p for p in profiles_data if p["id"] == recipient_id), None)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    if recipient["role"] != "recipient":
        raise HTTPException(status_code=400, detail="ID belongs to a donor, not recipient")

    # 2. Get Donors
    donors = [p for p in profiles_data if p["role"] == "donor"]
    
    matches = []
    
    for donor in donors:
        # Pre-filter: Exact hard constraints can be done here or let model decice.
        # usually Blood Type is a hard constraint for basic transplants.
        
        # Features: [BloodChoiceCompatible(0/1), AgeDiff, HLAScore]
        is_compat = get_blood_compatibility(donor["blood_type"], recipient["blood_type"])
        
        # Optimization: Don't even predict if blood not compatible (unless we want to show them as "low chance")
        if not is_compat:
            continue
            
        r_age = recipient["age"]
        d_age = donor["age"]
        d_hla_val = parse_hla(donor.get("hla_markers", "0/0"))
        
        age_diff = abs(d_age - r_age)
        
        features = [[is_compat, age_diff, d_hla_val]]
        
        # Calculate 0-1 Score
        compat_score, breakdown, distance_km = basic_compatibility_score(recipient, donor)

        # Apply Logic: Only return if prob > threshold or top K
        if compat_score > 0.2: # Loose threshold

            # Differential Privacy for Display
            # Age Noise (existing)
            noisy_age_diff = int(dp_mech.randomise(float(age_diff)))
            noisy_compat_score = noisy_score(compat_score)
            
            # Predict "Success Probability" using the new ML model
            # Input features must match training: ['age', 'urgency_score']
            try:
                # We need to reshape for single prediction
                pred_input = pd.DataFrame([{
                    'age': donor['age'],
                    'urgency_score': recipient.get('urgency_score', 0)
                }])
                success_prob = success_model.predict_proba(pred_input)[0][1]
            except Exception as e:
                print(f"Prediction error: {e}")
                success_prob = 0.5 # Fallback

            matches.append({
                "donor_id": donor["id"],
                "score": round(noisy_compat_score * 100, 1), # 0-100%
                "blood_type": donor["blood_type"],
                "location": donor["location"],
                "match_reason": f"Combined Score {compat_score:.2f} (Blood/HLA/Loc)",
                "privacy_note": f"DP Applied: Age ±{abs(noisy_age_diff-age_diff)}, Score ±{abs(round(noisy_compat_score-compat_score, 2))}",
                "raw_score": float(compat_score),
                "distance_km": distance_km,
                "score_breakdown": breakdown,
                "success_probability": round(success_prob * 100, 1)
            })
            
    # Sort by score
    matches.sort(key=lambda x: x["raw_score"], reverse=True)
    
    return {
        "recipient": {
            "id": recipient["id"],
            "blood_type": recipient["blood_type"],
            "urgency": recipient.get("urgency_score")
        },
        "matches": matches[:10] # Top 10
    }

# --- Global Registry Sim Endpoint ---

def predict_match_prob(recipient, donor):
    try:
        pred_input = pd.DataFrame([{
            'age': donor['age'],
            'urgency_score': recipient.get('urgency_score', 0)
        }])
        return success_model.predict_proba(pred_input)[0][1]
    except Exception:
        return 0.5

def private_compatibility_score(recipient, donor):
    compat_score, _, _ = basic_compatibility_score(recipient, donor)
    noisy = noisy_score(compat_score)
    return {"exact": compat_score, "noisy": noisy}

class GlobalMatchRequest(BaseModel):
    recipient_id: int

@app.post("/match")
async def find_matches_global(request: GlobalMatchRequest):
    recipient_id = request.recipient_id
    recipient = next((p for p in profiles_data if p["id"] == recipient_id and p["role"] == "recipient"), None)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    matches = []
    donors = [p for p in profiles_data if p["role"] == "donor"]
    
    for donor in donors:
        # Basic check to avoid complete mismatch waste
        if not get_blood_compatibility(donor["blood_type"], recipient["blood_type"]):
            continue

        score_data = private_compatibility_score(recipient, donor)
        prob = predict_match_prob(recipient, donor)
        
        matches.append({
            "donor_id": donor["id"],
            "exact_score": round(score_data["exact"], 3),
            "noisy_score": round(score_data["noisy"], 3),
            "prob_success": round(prob, 3),
            "location": donor["location"] # Anonymized by region
        })

    # Sort by noisy_score descending
    top_matches = sorted(matches, key=lambda x: x["noisy_score"], reverse=True)[:5]
    return {"matches": top_matches}
