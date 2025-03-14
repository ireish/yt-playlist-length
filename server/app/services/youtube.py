from ..config import settings
import aiohttp
import asyncio
import isodate
import logging
from typing import List, Dict, Tuple, Optional, Any
from app.models.playlist import PlaylistInfo, VideoItem

logger = logging.getLogger(__name__)

class YouTubeService:
    """Service for interacting with the YouTube Data API v3"""
    
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.base_url = settings.YOUTUBE_API_BASE_URL
        
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict:
        """Make a request to the YouTube API"""
        
        # Add API key to all requests
        params["key"] = self.api_key
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/{endpoint}", params=params) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"YouTube API error: {error_text}")
                    response.raise_for_status()
                
                return await response.json()
    
    async def get_playlist_info(self, playlist_id: str) -> PlaylistInfo:
        """Get basic information about a playlist"""
        
        # First, get playlist details
        playlist_response = await self._make_request("playlists", {
            "part": "snippet,contentDetails",
            "id": playlist_id
        })
        
        if not playlist_response.get("items"):
            raise ValueError(f"Playlist not found with ID: {playlist_id}")
        
        playlist_data = playlist_response["items"][0]
        snippet = playlist_data["snippet"]
        content_details = playlist_data["contentDetails"]
        
        # Get thumbnail with the highest resolution available
        thumbnails = snippet.get("thumbnails", {})
        thumbnail_url = None
        for resolution in ["maxres", "standard", "high", "medium", "default"]:
            if thumbnails.get(resolution):
                thumbnail_url = thumbnails[resolution]["url"]
                break
        
        # Calculate estimated duration
        estimated_duration_seconds = None
        estimated_duration_text = None
        try:
            # Get an estimate based on first few videos
            estimated_duration_seconds = await self.calculate_playlist_duration(playlist_id, sample_size=10)
            estimated_duration_text = self.format_duration(estimated_duration_seconds)
        except Exception as e:
            logger.warning(f"Could not estimate duration: {str(e)}")
        
        return PlaylistInfo(
            id=playlist_id,
            title=snippet.get("title", ""),
            description=snippet.get("description", ""),
            channel_title=snippet.get("channelTitle", ""),
            thumbnail_url=thumbnail_url,
            published_at=snippet.get("publishedAt", ""),
            item_count=content_details.get("itemCount", 0),
            estimated_duration_seconds=estimated_duration_seconds,
            estimated_duration_text=estimated_duration_text
        )
    
    async def get_playlist_videos(
        self, 
        playlist_id: str, 
        page_token: Optional[str] = None,
        max_results: int = 20
    ) -> Tuple[List[VideoItem], Optional[str]]:
        """Get videos from a playlist with pagination"""
        
        # Fetch playlist items
        playlist_items_params = {
            "part": "snippet,contentDetails",
            "playlistId": playlist_id,
            "maxResults": max_results
        }
        
        if page_token:
            playlist_items_params["pageToken"] = page_token
            
        playlist_items_response = await self._make_request("playlistItems", playlist_items_params)
        
        if not playlist_items_response.get("items"):
            return [], None
        
        # Extract video IDs to fetch duration information
        video_ids = [
            item["contentDetails"]["videoId"] 
            for item in playlist_items_response["items"]
        ]
        
        # Fetch video details to get durations
        videos_response = await self._make_request("videos", {
            "part": "contentDetails,snippet",
            "id": ",".join(video_ids)
        })
        
        # Create a lookup for video durations
        video_durations = {}
        for item in videos_response.get("items", []):
            video_id = item["id"]
            duration_iso = item["contentDetails"]["duration"]
            duration_seconds = int(isodate.parse_duration(duration_iso).total_seconds())
            video_durations[video_id] = {
                "seconds": duration_seconds,
                "text": self.format_duration(duration_seconds)
            }
        
        # Create VideoItem objects
        videos: List[VideoItem] = []
        for item in playlist_items_response["items"]:
            video_id = item["contentDetails"]["videoId"]
            snippet = item["snippet"]
            
            # Get the best thumbnail
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = None
            for resolution in ["maxres", "standard", "high", "medium", "default"]:
                if thumbnails.get(resolution):
                    thumbnail_url = thumbnails[resolution]["url"]
                    break
            
            # Get duration information
            duration_info = video_durations.get(video_id, {"seconds": 0, "text": "0:00"})
            
            videos.append(VideoItem(
                id=video_id,
                title=snippet.get("title", ""),
                description=snippet.get("description", ""),
                thumbnail_url=thumbnail_url,
                channel_title=snippet.get("channelTitle", ""),
                published_at=snippet.get("publishedAt", ""),
                position=snippet.get("position", 0),
                duration_seconds=duration_info["seconds"],
                duration_text=duration_info["text"]
            ))
        
        # Get the next page token if available
        next_page_token = playlist_items_response.get("nextPageToken")
        
        return videos, next_page_token
    
    async def calculate_playlist_duration(self, playlist_id: str, sample_size: Optional[int] = None) -> int:
        """
        Calculate the total duration of a playlist in seconds.
        If sample_size is provided, it estimates based on a sample of videos.
        """
        total_duration = 0
        next_page_token = None
        video_count = 0
        
        try:
            # Get the total number of videos without calling get_playlist_info to avoid recursion
            # Make a direct API call instead
            playlist_response = await self._make_request("playlists", {
                "part": "contentDetails",
                "id": playlist_id
            })
            
            if not playlist_response.get("items"):
                return 0
                
            total_videos = playlist_response["items"][0]["contentDetails"]["itemCount"]
            
            # If sampling, determine how many videos to fetch
            if sample_size and sample_size < total_videos:
                # Calculate average duration based on a sample
                videos, _ = await self.get_playlist_videos(
                    playlist_id,
                    max_results=min(sample_size, 50)  # YouTube API maximum is 50
                )
                
                if not videos:
                    return 0
                    
                sample_duration = sum(video.duration_seconds for video in videos)
                avg_duration = sample_duration / len(videos)
                
                # Estimate total duration
                return int(avg_duration * total_videos)
            
            # Otherwise, calculate exact duration by fetching all videos
            while True:
                videos, next_page_token = await self.get_playlist_videos(
                    playlist_id,
                    page_token=next_page_token,
                    max_results=50  # Maximum allowed by YouTube API
                )
                
                if not videos:
                    break
                    
                for video in videos:
                    total_duration += video.duration_seconds
                    video_count += 1
                
                if not next_page_token:
                    break
            
            return total_duration
        except Exception as e:
            logger.error(f"Error calculating duration: {str(e)}")
            return 0
    
    @staticmethod
    def format_duration(seconds: int) -> str:
        """Format duration in seconds to a human-readable string"""
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes}:{seconds:02d}"