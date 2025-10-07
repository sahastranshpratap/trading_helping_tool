from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.suggestions import router as suggestions_router
from api.auth import router as auth_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(suggestions_router, prefix="/api/suggestions", tags=["suggestions"])

@app.get("/")
async def root():
    return {"message": "Trading Journal API is running"} 