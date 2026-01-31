import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from .config import settings

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin Initialized")
    except Exception as e:
        print(f"Warning: Could not initialize Firebase Admin: {e}")
        # We might want to allow running without it for dev/test if key is missing, 
        # but for production it's critical.

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
