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