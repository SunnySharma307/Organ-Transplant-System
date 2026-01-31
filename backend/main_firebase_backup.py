import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
# We use the service account key from the parent directory
cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "serviceAccountKey.json")
if not os.path.exists(cred_path):
    # Fallback/Debug: check if it's in the current directory if run from root
    cred_path = "serviceAccountKey.json"

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase: {e}")

# DP Logic
def add_gaussian_noise(value, epsilon=1.0, sensitivity=10):
    """
    Add Gaussian noise for (ε, δ)-DP approximation.
    - epsilon: privacy budget (smaller = stronger privacy)
    - sensitivity: domain size (e.g., 10 for urgency, 80 for age)
    """
    scale = sensitivity / epsilon
    noise = np.random.normal(0, scale)
    return value + noise

@app.get("/")
def read_root():
    return {"message": "Organ Matching Privacy Backend is running."}

@app.get("/match/{recipient_id}")
def find_matches(recipient_id: str):
    try:
        # 1. Fetch Recipient
        recipient_ref = db.collection("profiles").document(recipient_id)
        recipient_doc = recipient_ref.get()
        
        if not recipient_doc.exists:
            raise HTTPException(status_code=404, detail="Recipient not found")
        
        recipient = recipient_doc.to_dict()
        if recipient.get("role") != "recipient":
            raise HTTPException(status_code=400, detail="Profile is not a recipient")

        # 2. Fetch Potential Donors
        # In a real app, query efficiently. Here we fetch all donors for demo.
        donors_ref = db.collection("profiles").where("role", "==", "donor")
        donors_docs = donors_ref.stream()
        
        matches = []
        
        for doc in donors_docs:
            donor = doc.to_dict()
            
            # 3. Apply Matching Logic with Privacy
            
            # Simple score: Blood Match (Binary) + HLA (Normalized) - Age Diff (Noised)
            
            # Blood Type Check (Simplified)
            blood_compatible = False
            rec_blood = recipient.get("blood_type")
            don_blood = donor.get("blood_type")
            
            if don_blood == "O-": # Universal donor
                blood_compatible = True
            elif rec_blood == "AB+": # Universal recipient
                blood_compatible = True
            elif rec_blood == don_blood:
                blood_compatible = True
                
            if not blood_compatible:
                continue # Skip incompatible
            
            # MATCH SCORING
            score = 0
            
            # HLA Score (Extract 'X/Y HLA' -> int(X))
            try:
                hla_str = donor.get("hla_markers", "0/0")
                hla_val = int(hla_str.split("/")[0])
                score += hla_val * 2 # Weight HLA
            except:
                pass
            
            # Age Difference (With GAUSSIAN NOISE for Privacy)
            # We don't want the frontend to know the exact age difference
            rec_age = recipient.get("age", 30)
            don_age = donor.get("age", 30)
            
            # Noisy Age used for calculation
            noisy_rec_age = add_gaussian_noise(rec_age, epsilon=1.0, sensitivity=80)
            noisy_don_age = add_gaussian_noise(don_age, epsilon=1.0, sensitivity=80)
            
            age_diff = abs(noisy_rec_age - noisy_don_age)
            
            # Penalize large age gaps
            score -= (age_diff / 5) 
            
            # Urgency Boost (Using real or noisy urgency? Let's use real for internal scoring, noisy for display if needed)
            urgency = recipient.get("urgency_score", 5)
            score += urgency
            
            matches.append({
                "donor_id": donor.get("id"), # In strict privacy, even ID might be masked or session-based
                "score": round(score, 2),
                "blood_type": don_blood, # Public info usually
                "location": donor.get("location"),
                "match_reason": f"HLA {hla_str}, Blood {don_blood}",
                "privacy_note": "Age used in calculation was perturbed by Gaussian noise (ε=1.0)"
            })
            
        # Sort by score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "recipient_id": recipient_id,
            "matches": matches[:5], # Return top 5
            "privacy_mode": "Differential Privacy (Gaussian Mechanism) Enabled"
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
