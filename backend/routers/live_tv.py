from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import httpx
import asyncio

from database import get_db
from models import LiveTVChannel, EPGData, User
from routers.auth import get_current_user

router = APIRouter()

class ChannelResponse:
    def __init__(self, channel: LiveTVChannel):
        self.id = channel.id
        self.name = channel.name
        self.logo_url = channel.logo_url
        self.category = channel.category
        self.language = channel.language
        self.country = channel.country
        self.is_active = channel.is_active

class EPGResponse:
    def __init__(self, epg: EPGData):
        self.id = epg.id
        self.title = epg.title
        self.description = epg.description
        self.start_time = epg.start_time
        self.end_time = epg.end_time

@router.get("/channels", response_model=List[dict])
async def get_channels(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(LiveTVChannel).filter(LiveTVChannel.is_active == True)
    
    if category:
        query = query.filter(LiveTVChannel.category == category)
    if language:
        query = query.filter(LiveTVChannel.language == language)
    if country:
        query = query.filter(LiveTVChannel.country == country)
    
    channels = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": channel.id,
            "name": channel.name,
            "logo_url": channel.logo_url,
            "category": channel.category,
            "language": channel.language,
            "country": channel.country,
            "is_active": channel.is_active
        }
        for channel in channels
    ]

@router.get("/channels/{channel_id}")
async def get_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    channel = db.query(LiveTVChannel).filter(LiveTVChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    return {
        "id": channel.id,
        "name": channel.name,
        "logo_url": channel.logo_url,
        "category": channel.category,
        "language": channel.language,
        "country": channel.country,
        "is_active": channel.is_active
    }

@router.get("/channels/{channel_id}/stream")
async def stream_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    channel = db.query(LiveTVChannel).filter(LiveTVChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    if not channel.is_active:
        raise HTTPException(status_code=400, detail="Channel is not active")
    
    # For live streaming, we would typically proxy the stream
    # This is a simplified version that redirects to the stream URL
    async def stream_generator():
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", channel.url) as response:
                async for chunk in response.aiter_bytes():
                    yield chunk
    
    return StreamingResponse(
        stream_generator(),
        media_type="application/vnd.apple.mpegurl" if channel.url.endswith('.m3u8') else "video/mp2t"
    )

@router.get("/epg")
async def get_epg(
    channel_id: Optional[int] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(EPGData)
    
    if channel_id:
        query = query.filter(EPGData.channel_id == channel_id)
    
    if date:
        try:
            target_date = datetime.fromisoformat(date)
            start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            query = query.filter(
                EPGData.start_time >= start_of_day,
                EPGData.start_time < end_of_day
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")
    
    epg_data = query.all()
    
    return [
        {
            "id": epg.id,
            "channel_id": epg.channel_id,
            "title": epg.title,
            "description": epg.description,
            "start_time": epg.start_time,
            "end_time": epg.end_time
        }
        for epg in epg_data
    ]

@router.get("/categories")
async def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(LiveTVChannel.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/languages")
async def get_languages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    languages = db.query(LiveTVChannel.language).distinct().all()
    return [lang[0] for lang in languages if lang[0]]

@router.get("/countries")
async def get_countries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    countries = db.query(LiveTVChannel.country).distinct().all()
    return [country[0] for country in countries if country[0]]
