import random
import uuid
from datetime import datetime, timedelta
import json

NUM_RECORDS = 100

blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
genders = ["Male", "Female"]
donor_types = ["living", "deceased"]
organs_list = ["lungs", "kidney", "liver", "heart"]

def random_past_date():
    days_ago = random.randint(1, 30)
    return (datetime.utcnow() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

def random_dob():
    start = datetime(1960, 1, 1)
    end = datetime(2005, 1, 1)
    return (start + timedelta(days=random.randint(0, (end - start).days))).strftime("%Y-%m-%d")

def generate_dummy():
    organ = random.choice(organs_list)

    return {
        "abhaId": str(random.randint(10000000000000, 99999999999999)),
        "bloodGroup": random.choice(blood_groups),
        "dob": random_dob(),
        "donorType": random.choice(donor_types),
        "email": f"user{random.randint(1000,9999)}@example.com",
        "fullName": f"Donor_{uuid.uuid4().hex[:6]}",
        "gender": random.choice(genders),
        "hospitalId": f"H-{random.randint(100,999)}",
        "nextOfKin": random.choice(["Mother", "Father", "Brother", "Sister", "Spouse", "Aunty"]),
        "organsWillingToDonate": [organ],
        "phone": str(random.randint(6000000000, 9999999999)),
        "registeredAt": datetime.utcnow().isoformat(),
        "status": "active",
        "submissionType": "backend-api",
        f"test_{organ}_ct": str(random.randint(1, 10)),
        f"test_{organ}_ct_date": random_past_date(),
        f"test_{organ}_echo": str(random.randint(1, 10)),
        f"test_{organ}_echo_date": random_past_date(),
        f"test_{organ}_pftsTest": str(random.randint(1, 10)),
        f"test_{organ}_pftsTest_date": random_past_date(),
        f"test_{organ}_xray": str(random.randint(1, 10)),
        f"test_{organ}_xray_date": random_past_date(),
    }

data = [generate_dummy() for _ in range(NUM_RECORDS)]

with open("dummy_donors.json", "w") as f:
    json.dump(data, f, indent=2)

print("Dummy donor data generated successfully!")

