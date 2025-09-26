from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://livetv:livetv_password@localhost:5432/livetv"
    redis_url: str = "redis://localhost:6379"
    jwt_secret: str = "your_jwt_secret_key_here"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    media_path: str = "/media"
    max_file_size: int = 10 * 1024 * 1024 * 1024  # 10GB
    allowed_video_formats: list = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm"]
    allowed_audio_formats: list = [".mp3", ".flac", ".aac", ".ogg", ".wav"]
    thumbnail_size: tuple = (300, 200)
    
    class Config:
        env_file = ".env"

settings = Settings()
