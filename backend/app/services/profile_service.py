from ..core.firebase import db
import pandas as pd
from datetime import datetime

class ProfileService:
    def __init__(self):
        pass

    def _calculate_age(self, dob_str):
        if not dob_str: return 30 # Default
        try:
            birth_date = pd.to_datetime(dob_str)
            today = pd.Timestamp.now()
            return (today - birth_date).days // 365
        except:
            return 30

    def _normalize_patient(self, doc):
        data = doc.to_dict()
        
        # Map urgency status text to numeric score
        urgency_map = {
            "Critical (ICU)": 10,
            "Urgent (Hospitalized)": 8,
            "Moderate": 5,
            "Stable": 3
        }
        urgency_text = data.get("urgencyStatus", "Moderate")
        urgency_score = urgency_map.get(urgency_text, 5)

        return {
            "id": doc.id,
            "role": "recipient",
            "name": data.get("fullName", "Unknown"),
            "blood_type": data.get("bloodGroup", "O+"),
            "age": self._calculate_age(data.get("dob")),
            "location": data.get("hospitalLocation", "Unknown"),
            "urgency_score": urgency_score,
            "hla_markers": data.get("hlaResults", "0/6"),
            "organ_required": data.get("organRequired", "Kidney")
        }

    def _normalize_donor(self, doc):
        data = doc.to_dict()
        return {
            "id": doc.id,
            "role": "donor",
            "blood_type": data.get("bloodGroup", "O+"),
            "age": self._calculate_age(data.get("dob")),
            "location": data.get("hospitalLocation", "Unknown"),
            "hla_markers": data.get("hlaTissueTyping", "0/6"),
            "organs_available": data.get("organsWillingToDonate", [])
        }

    def get_by_id(self, profile_id):
        # ID might be a string now (Firestore ID) or numeric. Try both or assume string
        # Our seeded IDs are auto-generated strings
        # Check recipients (was patients)
        doc = db.collection('recipients').document(str(profile_id)).get()
        if doc.exists:
            return self._normalize_patient(doc)
        
        # Check donors
        doc = db.collection('donors').document(str(profile_id)).get()
        if doc.exists:
            return self._normalize_donor(doc)
            
        return None

    def get_recipients(self):
        docs = db.collection('recipients').stream()
        return [self._normalize_patient(doc) for doc in docs]

    def get_donors(self):
        docs = db.collection('donors').stream()
        return [self._normalize_donor(doc) for doc in docs]

    def add_recipient(self, data: dict):
        # Generate a new document ref to get an ID or allow ID in data
        # For simplicity, if ID is not provided, Firestore auto-generates it.
        # However, we might want to link it to the user's auth ID if available.
        
        # If 'id' is in data, use it as document ID, otherwise let Firestore generate one
        doc_id = data.get('id')
        if doc_id:
            db.collection('recipients').document(str(doc_id)).set(data)
            return {"id": doc_id, **data}
        else:
            update_time, doc_ref = db.collection('recipients').add(data)
            return {"id": doc_ref.id, **data}

profile_service = ProfileService()
