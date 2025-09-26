from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import mimetypes
from pathlib import Path

from database import get_db
from models import Media, User
from routers.auth import get_current_user
from config import settings

router = APIRouter()

class MediaResponse:
    def __init__(self, media: Media):
        self.id = media.id
        self.title = media.title
        self.media_type = media.media_type
        self.genre = media.genre
        self.year = media.year
        self.rating = media.rating
        self.description = media.description
        self.thumbnail_path = media.thumbnail_path
        self.duration = media.duration
        self.file_size = media.file_size
        self.created_at = media.created_at

@router.get("/", response_model=List[dict])
async def get_media(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    media_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Media)
    
    if media_type:
        query = query.filter(Media.media_type == media_type)
    
    if search:
        query = query.filter(Media.title.ilike(f"%{search}%"))
    
    media_items = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": item.id,
            "title": item.title,
            "media_type": item.media_type,
            "genre": item.genre,
            "year": item.year,
            "rating": item.rating,
            "description": item.description,
            "thumbnail_path": item.thumbnail_path,
            "duration": item.duration,
            "file_size": item.file_size,
            "created_at": item.created_at
        }
        for item in media_items
    ]

@router.get("/{media_id}")
async def get_media_item(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    return {
        "id": media.id,
        "title": media.title,
        "media_type": media.media_type,
        "genre": media.genre,
        "year": media.year,
        "rating": media.rating,
        "description": media.description,
        "thumbnail_path": media.thumbnail_path,
        "duration": media.duration,
        "file_size": media.file_size,
        "created_at": media.created_at
    }

@router.get("/{media_id}/stream")
async def stream_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    file_path = os.path.join(settings.media_path, media.file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Media file not found")
    
    # Get file info
    file_size = os.path.getsize(file_path)
    mime_type, _ = mimetypes.guess_type(file_path)
    
    def iterfile():
        with open(file_path, mode="rb") as file_like:
            yield from file_like
    
    return StreamingResponse(
        iterfile(),
        media_type=mime_type or "application/octet-stream",
        headers={"Content-Length": str(file_size)}
    )

@router.get("/{media_id}/thumbnail")
async def get_thumbnail(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    if not media.thumbnail_path:
        raise HTTPException(status_code=404, detail="Thumbnail not available")
    
    thumbnail_path = os.path.join(settings.media_path, media.thumbnail_path)
    if not os.path.exists(thumbnail_path):
        raise HTTPException(status_code=404, detail="Thumbnail file not found")
    
    return FileResponse(thumbnail_path)

@router.post("/scan")
async def scan_media_library(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # This would typically be implemented as a background task
    # For now, we'll just return a success message
    return {"message": "Media library scan started"}
