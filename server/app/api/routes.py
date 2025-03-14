# from fastapi import APIRouter, HTTPException, Query
# from typing import List, Optional
# from app.services.youtube import YouTubeService
# from app.models.playlist import PlaylistResponse, VideoItem

# router = APIRouter()
# youtube_service = YouTubeService()

# @router.get("/api/playlist/{playlist_id}", response_model=PlaylistResponse)
# async def get_playlist_info(playlist_id: str):
#     try:
#         return await youtube_service.get_playlist_info(playlist_id)
#     except Exception as e:
#         raise HTTPException(status_code=404, detail=f"Playlist not found: {str(e)}")

# @router.get("/api/playlist/{playlist_id}/videos", response_model=List[VideoItem])
# async def get_playlist_videos(
#     playlist_id: str, 
#     page_token: Optional[str] = Query(None),
#     max_results: int = Query(20, ge=1, le=50)
# ):
#     try:
#         return await youtube_service.get_playlist_videos(playlist_id, page_token, max_results)
#     except Exception as e:
#         raise HTTPException(status_code=404, detail=f"Could not fetch playlist videos: {str(e)}")

# @router.get("/api/playlist/{playlist_id}/duration")
# async def get_playlist_duration(playlist_id: str):
#     try:
#         total_duration = await youtube_service.calculate_playlist_duration(playlist_id)
#         return {
#             "playlist_id": playlist_id,
#             "total_seconds": total_duration,
#             "formatted_duration": youtube_service.format_duration(total_duration)
#         }
#     except Exception as e:
#         raise HTTPException(status_code=404, detail=f"Could not calculate duration: {str(e)}")
