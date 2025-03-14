from pydantic import Field
from pydantic_settings import BaseSettings # type: ignore
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API key for YouTube Data API v3
    YOUTUBE_API_KEY: str = Field(default=os.getenv("YOUTUBE_API_KEY", ""))
    
    # Base URL for YouTube Data API v3
    YOUTUBE_API_BASE_URL: str = Field(default="https://www.googleapis.com/youtube/v3")
    
    # Maximum results per page for playlist items
    MAX_RESULTS_PER_PAGE: int = Field(default=50)
    
    # Cache TTL in seconds (1 hour)
    CACHE_TTL: int = Field(default=3600)
    
    class Config:
        env_file = ".env"

settings = Settings()