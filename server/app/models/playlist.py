from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any

class VideoItem(BaseModel):
    """Model for a single video in a playlist"""
    id: str
    title: str
    description: str = ""
    thumbnail_url: Optional[HttpUrl] = None
    channel_title: str
    published_at: str
    position: int
    duration_seconds: int
    duration_text: str

class PlaylistInfo(BaseModel):
    """Basic information about a playlist"""
    id: str
    title: str
    description: str = ""
    channel_title: str
    thumbnail_url: Optional[HttpUrl] = None
    published_at: str
    item_count: int
    estimated_duration_seconds: Optional[int] = None
    estimated_duration_text: Optional[str] = None

class PlaylistResponse(BaseModel):
    """Response model for playlist information"""
    playlist: PlaylistInfo
    next_page_token: Optional[str] = None

class PlaylistVideosRequest(BaseModel):
    """Request model for fetching playlist videos"""
    playlist_id: str
    page_token: Optional[str] = None
    max_results: int = Field(20, ge=1, le=50)

class PlaylistDurationResponse(BaseModel):
    """Response model for playlist duration"""
    playlist_id: str
    total_seconds: int
    formatted_duration: str