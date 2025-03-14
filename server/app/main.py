from .utils.helpers import extract_playlist_id
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .services.youtube import YouTubeService
from .models.playlist import PlaylistResponse, PlaylistVideosRequest, VideoItem
from typing import Optional, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="YouTube Playlist API", 
              description="API for fetching YouTube playlist information and calculating durations")

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the YouTube service
youtube_service = YouTubeService()

@app.get("/")
def read_root():
    return {"message": "YouTube Playlist Length Calculator API"}

@app.get("/api/playlist/{playlist_id}", response_model=PlaylistResponse)
async def get_playlist_info(playlist_id: str):
    """
    Get basic information about a YouTube playlist without the videos.
    """
    try:
        playlist_info = await youtube_service.get_playlist_info(playlist_id)
        return playlist_info
    except Exception as e:
        logger.error(f"Error getting playlist info: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Playlist not found: {str(e)}")

@app.get("/api/playlist/{playlist_id}/videos", response_model=List[VideoItem])
async def get_playlist_videos(
    playlist_id: str, 
    page_token: Optional[str] = Query(None),
    max_results: int = Query(20, ge=1, le=50)
):
    """
    Get videos from a YouTube playlist with pagination.
    Returns up to max_results videos and a next page token if there are more videos.
    """
    try:
        videos, next_page_token = await youtube_service.get_playlist_videos(
            playlist_id, 
            page_token=page_token,
            max_results=max_results
        )
        
        # Add next_page_token to the response headers
        return videos
    except Exception as e:
        logger.error(f"Error getting playlist videos: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Could not fetch playlist videos: {str(e)}")

@app.get("/api/playlist/{playlist_id}/duration")
async def get_playlist_duration(playlist_id: str):
    """
    Calculate the total duration of a YouTube playlist.
    """
    try:
        total_duration = await youtube_service.calculate_playlist_duration(playlist_id)
        return {
            "playlist_id": playlist_id,
            "total_seconds": total_duration,
            "formatted_duration": youtube_service.format_duration(total_duration)
        }
    except Exception as e:
        logger.error(f"Error calculating playlist duration: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Could not calculate duration: {str(e)}")
    

@app.get("/api/playlist-url")
async def get_playlist_by_url(url: str):
    """
    Get playlist information by URL instead of ID.
    This handles full YouTube playlist URLs.
    """
    try:
        playlist_id = extract_playlist_id(url)
        if not playlist_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube playlist URL")
        
        playlist_info = await youtube_service.get_playlist_info(playlist_id)
        return playlist_info
    except Exception as e:
        logger.error(f"Error getting playlist info: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Playlist not found: {str(e)}")