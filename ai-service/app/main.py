from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.ai import router as ai_router

app = FastAPI(
    title="3D ULPIN AI & Spatial Processing Service",
    description="Microservice for building extraction, floor segmentation, and point cloud analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-spatial-processor", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
