from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routers import matches, analytics, registry

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(matches.router, prefix="/match", tags=["matches"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(registry.router, prefix="/registry", tags=["registry"])

@app.get("/")
def read_root():
    return {"message": "Organ Matching AI Backend Running (V2 Modular)"}
