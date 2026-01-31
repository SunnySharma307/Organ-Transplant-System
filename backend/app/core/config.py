import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            def __init__(self, **kwargs):
                for k, v in kwargs.items():
                    setattr(self, k, v)
            class Config:
                pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "Organ Transplant Matching System"
    API_V1_STR: str = ""
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    # Paths
    # backend/app/core/config.py -> backend/app/core -> backend/app -> backend -> organ-mvp
    _p = os.path.abspath(__file__)
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(_p))))
    
    # Files are in root
    DATA_FILE: str = os.path.join(BASE_DIR, "mock_profiles.json")
    GOOGLE_APPLICATION_CREDENTIALS: str = os.path.join(BASE_DIR, "serviceAccountKey.json")

    class Config:
        case_sensitive = True

settings = Settings()
