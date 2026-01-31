from typing import Dict, Tuple
from geopy.distance import geodesic
from diffprivlib.mechanisms import Gaussian
import numpy as np

# Privacy Mechanism
# Sensitivity is 1.0 because score is bound 0-1
dp_mech_score = Gaussian(epsilon=0.5, delta=1e-5, sensitivity=1.0)
dp_mech_age = Gaussian(epsilon=1.0, delta=1e-5, sensitivity=10)

def parse_hla(hla_str: str) -> int:
    """Extracts the first number from 'X/Y HLA match potential'"""
    try:
        return int(hla_str.split("/")[0])
    except (ValueError, IndexError, AttributeError):
        return 0

def get_blood_compatibility(donor_type: str, recipient_type: str) -> int:
    """Returns 1 if compatible, 0 otherwise."""
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
    location_coords = {
        "USA-California": (37.8, -122.4),
        "USA-New York": (40.7, -74.0),
        "Europe-UK": (51.5, -0.1),
        "Asia-India": (28.6, 77.2),
        "Africa-South Africa": (-33.9, 18.4),
    }
    coord1 = location_coords.get(loc1, (0,0))
    coord2 = location_coords.get(loc2, (0,0))
    return geodesic(coord1, coord2).km

def basic_compatibility_score(recipient: Dict, donor: Dict) -> Tuple[float, dict, float]:
    # Blood type match
    blood_score = 1.0 if donor["blood_type"] == recipient["blood_type"] else \
                  0.5 if donor["blood_type"] in ["O-", "O+"] or recipient["blood_type"] in ["AB+", "AB-"] else 0.0

    # HLA similarity
    hla_str = donor.get("hla_markers", "0/6")
    hla_score = int(hla_str.split("/")[0]) / 6.0

    # Urgency weighting
    urgency_weight = recipient.get("urgency_score", 5) / 10.0

    # Proximity
    dist = haversine_distance(recipient["location"], donor.get("location", "USA-New York"))
    proximity_score = max(0, 1 - (dist / 10000))

    # Combined score
    score = (blood_score * 0.4) + (hla_score * 0.3) + (proximity_score * 0.2) + (urgency_weight * 0.1)
    
    breakdown = {
        "blood": round(blood_score, 2),
        "hla": round(hla_score, 2),
        "proximity": round(proximity_score, 2),
        "urgency": round(urgency_weight, 2)
    }
    
    return round(score, 3), breakdown, round(dist, 1)

def noisy_score(original_score: float) -> float:
    noisy = dp_mech_score.randomise(original_score)
    return max(0.0, min(1.0, noisy))

def get_noisy_age_diff(real_diff: float) -> int:
    return int(dp_mech_age.randomise(float(real_diff)))

def private_compatibility_score(recipient, donor):
    compat_score, _, _ = basic_compatibility_score(recipient, donor)
    noisy = noisy_score(compat_score)
    return {"exact": compat_score, "noisy": noisy}
