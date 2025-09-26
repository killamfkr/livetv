from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import asyncio
from datetime import datetime

from database import get_db
from models import Playlist, LiveTVChannel, User
from routers.auth import get_current_user
from config import settings

router = APIRouter()

class PlaylistResponse:
    def __init__(self, playlist: Playlist):
        self.id = playlist.id
        self.name = playlist.name
        self.playlist_type = playlist.playlist_type
        self.is_active = playlist.is_active
        self.created_at = playlist.created_at
        self.updated_at = playlist.updated_at

@router.get("/", response_model=List[dict])
async def get_playlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlists = db.query(Playlist).all()
    
    return [
        {
            "id": playlist.id,
            "name": playlist.name,
            "playlist_type": playlist.playlist_type,
            "is_active": playlist.is_active,
            "created_at": playlist.created_at,
            "updated_at": playlist.updated_at,
            "channel_count": len(playlist.channels)
        }
        for playlist in playlists
    ]

@router.post("/upload")
async def upload_playlist(
    name: str,
    playlist_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if playlist_type not in ["m3u", "xtream"]:
        raise HTTPException(status_code=400, detail="Invalid playlist type")
    
    # Create playlists directory if it doesn't exist
    playlists_dir = os.path.join(settings.media_path, "playlists")
    os.makedirs(playlists_dir, exist_ok=True)
    
    # Save uploaded file
    file_path = os.path.join(playlists_dir, f"{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.m3u")
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create playlist record
    playlist = Playlist(
        name=name,
        file_path=file_path,
        playlist_type=playlist_type
    )
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    
    # Parse playlist and create channels
    await parse_playlist(playlist.id, file_path, db)
    
    return {
        "id": playlist.id,
        "name": playlist.name,
        "playlist_type": playlist.playlist_type,
        "file_path": playlist.file_path,
        "message": "Playlist uploaded and parsed successfully"
    }

@router.post("/xtream")
async def add_xtream_playlist(
    name: str,
    url: str,
    username: str,
    password: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Create playlist record for Xtream Codes
    playlist = Playlist(
        name=name,
        file_path=f"xtream://{url}/{username}/{password}",
        playlist_type="xtream"
    )
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    
    # Fetch channels from Xtream Codes API
    await fetch_xtream_channels(playlist.id, url, username, password, db)
    
    return {
        "id": playlist.id,
        "name": playlist.name,
        "playlist_type": playlist.playlist_type,
        "message": "Xtream Codes playlist added successfully"
    }

@router.delete("/{playlist_id}")
async def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    # Delete associated channels
    db.query(LiveTVChannel).filter(LiveTVChannel.playlist_id == playlist_id).delete()
    
    # Delete playlist file if it exists
    if os.path.exists(playlist.file_path):
        os.remove(playlist.file_path)
    
    # Delete playlist record
    db.delete(playlist)
    db.commit()
    
    return {"message": "Playlist deleted successfully"}

async def parse_playlist(playlist_id: int, file_path: str, db: Session):
    """Parse M3U playlist and create channel records"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        current_channel = None
        for line in lines:
            line = line.strip()
            if line.startswith('#EXTINF:'):
                # Parse channel info
                parts = line.split(',', 1)
                if len(parts) > 1:
                    info = parts[1]
                    # Extract channel name and other info
                    current_channel = {
                        'name': info,
                        'category': 'General',
                        'language': 'Unknown',
                        'country': 'Unknown'
                    }
            elif line and not line.startswith('#') and current_channel:
                # This is the stream URL
                channel = LiveTVChannel(
                    name=current_channel['name'],
                    url=line,
                    category=current_channel['category'],
                    language=current_channel['language'],
                    country=current_channel['country'],
                    playlist_id=playlist_id
                )
                db.add(channel)
                current_channel = None
        
        db.commit()
    except Exception as e:
        print(f"Error parsing playlist: {e}")

async def fetch_xtream_channels(playlist_id: int, url: str, username: str, password: str, db: Session):
    """Fetch channels from Xtream Codes API"""
    try:
        import httpx
        
        # Get live streams
        live_url = f"{url}/live/{username}/{password}"
        async with httpx.AsyncClient() as client:
            response = await client.get(live_url)
            if response.status_code == 200:
                data = response.json()
                for channel_data in data:
                    channel = LiveTVChannel(
                        name=channel_data.get('name', 'Unknown'),
                        url=channel_data.get('url', ''),
                        logo_url=channel_data.get('logo', ''),
                        category=channel_data.get('category_name', 'General'),
                        language=channel_data.get('language', 'Unknown'),
                        country=channel_data.get('country', 'Unknown'),
                        playlist_id=playlist_id
                    )
                    db.add(channel)
        
        db.commit()
    except Exception as e:
        print(f"Error fetching Xtream channels: {e}")

@router.post("/{playlist_id}/refresh")
async def refresh_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    # Delete existing channels
    db.query(LiveTVChannel).filter(LiveTVChannel.playlist_id == playlist_id).delete()
    
    if playlist.playlist_type == "m3u":
        await parse_playlist(playlist_id, playlist.file_path, db)
    elif playlist.playlist_type == "xtream":
        # Extract credentials from file_path
        if playlist.file_path.startswith("xtream://"):
            parts = playlist.file_path[9:].split("/")
            if len(parts) >= 3:
                url = f"{parts[0]}//{parts[1]}"
                username = parts[2]
                password = parts[3] if len(parts) > 3 else ""
                await fetch_xtream_channels(playlist_id, url, username, password, db)
    
    return {"message": "Playlist refreshed successfully"}
