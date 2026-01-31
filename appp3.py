import random
import uuid
from datetime import datetime, timedelta
import json

NUM_RECORDS = 100

blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
genders = ["Male", "Female"]
organs = ["Lungs", "Kidney", "Liver", "Heart"]
urgency_levels = [
    "Stable",
    "Moderate",
    "Urgent (Hospitalized)",
    "Critical (ICU)"
]

def random_past_date():
    days_ago = random.randint(1, 30)
    return (datetime.utcnow() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

def random_dob():
    start = datetime(1960, 1, 1)
    end = datetime(2010, 1, 1)
    return (start + timedelta(days=random.randint(0, (end - start).days))).strftime("%Y-%m-%d")

def generate_dummy():
    organ = random.choice(organs)
    organ_key = organ.lower()

    return {
        "abhaId": str(random.randint(10000000000000, 99999999999999)),
        "bloodGroup": random.choice(blood_groups),
        "diagnosis": f"Diagnosis_{uuid.uuid4().hex[:8]}",
        "dob": random_dob(),
        "fullName": f"Recipient_{uuid.uuid4().hex[:6]}",
        "gender": random.choice(genders),
        "hospitalId": f"H-{random.randint(100,999)}",
        "organRequired": organ,
        "registeredAt": datetime.utcnow().isoformat(),
        "status": "active",
        "submissionType": "backend-api",
        f"test_{organ_key}_ct": str(random.randint(1, 10)),
        f"test_{organ_key}_ct_date": random_past_date(),
        f"test_{organ_key}_echo": str(random.randint(1, 10)),
        f"test_{organ_key}_echo_date": random_past_date(),
        f"test_{organ_key}_pftsTest": str(random.randint(1, 10)),
        f"test_{organ_key}_pftsTest_date": random_past_date(),
        f"test_{organ_key}_xray": str(random.randint(1, 10)),
        f"test_{organ_key}_xray_date": random_past_date(),
        "urgencyStatus": random.choice(urgency_levels)
    }

data = [generate_dummy() for _ in range(NUM_RECORDS)]

with open("dummy_recipients.json", "w") as f:
    json.dump(data, f, indent=2)

print("Dummy recipient data generated successfully!")
