# privacy.py
import numpy as np

def add_gaussian_noise(value, epsilon=1.0, sensitivity=10):
    """
    Add Gaussian noise for (ε, δ)-DP approximation.
    - epsilon: privacy budget (smaller = stronger privacy, more noise)
    - sensitivity: domain size (e.g., 10 for urgency 1-10, 80 for age)
    """
    scale = sensitivity / epsilon  # Calibrated for Gaussian
    noise = np.random.normal(0, scale)
    return value + noise

# Example usage
ages = [25, 45, 60]  # From mock data
noisy_ages = [add_gaussian_noise(age, epsilon=0.5) for age in ages]  # Strong privacy

urgency_scores = [8, 3, 10]
noisy_urgency = [add_gaussian_noise(score, epsilon=1.0, sensitivity=10) for score in urgency_scores]

print("Original ages:", ages)
print("Noisy ages:", noisy_ages)  # e.g., [20.11, 59.57, 50.19]

import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Load your dummy profiles (if stored in file)
# OR use your generated list directly
profiles = [
    {
        "id": 3248,
        "role": "recipient",
        "blood_type": "AB+",
        "age": 32,
        "location": "USA-New York",
        "comorbidities": "Diabetes",
        "hla_markers": "5/4 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797525",
        "urgency_score": 7
    }
    # Add your other profiles here
]

# Insert into Firestore
for profile in profiles:
    doc_id = str(profile["id"])
    db.collection("profiles").document(doc_id).set(profile)

print("Data inserted successfully!")



# mock_data_generator.py
import random
import json
from datetime import datetime

blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
locations = ["USA-California", "USA-New York", "Europe-UK", "Asia-India", "Africa-South Africa"]
comorbidities_options = ["None", "Diabetes", "Hypertension", "Heart Disease", "None"]

def generate_profile(role):
    profile = {
        "id": random.randint(1000, 9999),
        "role": role,
        "blood_type": random.choice(blood_types),
        "age": random.randint(18, 80),
        "location": random.choice(locations),
        "comorbidities": random.choice(comorbidities_options),
        "hla_markers": f"{random.randint(0,6)}/{random.randint(4,6)} HLA match potential",  # simplified string
        "created_at": datetime.now().isoformat()
    }
    if role == "recipient":
        profile["urgency_score"] = random.randint(1, 10)
    return profile

# Generate 100 profiles (adjust as needed)
profiles = []
for _ in range(100):
    role = random.choice(["donor", "recipient"])
    profiles.append(generate_profile(role))

# Save to JSON for import or print sample
with open("mock_profiles.json", "w") as f:
    json.dump(profiles, f, indent=2)

print(f"Generated {len(profiles)} profiles. Sample:")
print(json.dumps(profiles[:5], indent=2))


# basic_federated_matching.py (simple rule-based + aggregation)
from collections import defaultdict

# Assume profiles loaded from mock
# Group by "hospital" (location)
grouped = defaultdict(list)
for p in profiles:
    grouped[p["location"]].append(p)

def compute_local_matches(recipient, local_group):
    # Simple rule-based: score = blood match (1/0) + HLA similarity + noisy age diff + urgency
    matches = []
    for donor in [p for p in local_group if p["role"] == "donor"]:
        blood_match = 1 if donor["blood_type"] in ["O-", recipient["blood_type"]] else 0.5  # Simplified
        hla_score = int(donor["hla_markers"].split("/")[0]) / 6
        noisy_age_diff = abs(add_gaussian_noise(recipient["age"]) - add_gaussian_noise(donor["age"]))
        score = blood_match + hla_score - (noisy_age_diff / 100)  # Penalize age diff
        matches.append({"donor_id": donor["id"], "score": score})
    return sorted(matches, key=lambda x: x["score"], reverse=True)[:5]  # Top local

def aggregate_federated(recipient):
    # Simulate federation: Get top from each "hospital", aggregate
    all_matches = []
    for location, group in grouped.items():
        local_top = compute_local_matches(recipient, group)
        all_matches.extend(local_top)
    # Aggregate: Sort global top without raw data sharing
    return sorted(all_matches, key=lambda x: x["score"], reverse=True)[:3]

# Demo
sample_recipient = profiles[2]  # A recipient from mock
global_matches = aggregate_federated(sample_recipient)
print("Privacy-safe top matches:", global_matches)