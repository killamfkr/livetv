from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import uvicorn

from database import get_db, engine, Base
from models import User, Media, LiveTVChannel, Playlist
from routers import auth, media, live_tv, playlists
from config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LiveTV API",
    description="Plex alternative with live TV support",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(live_tv.router, prefix="/api/live-tv", tags=["live-tv"])
app.include_router(playlists.router, prefix="/api/playlists", tags=["playlists"])

@app.get("/")
async def root():
    return {"message": "LiveTV API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
