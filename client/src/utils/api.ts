import axios from 'axios';
import { extractPlaylistId } from './youtubeUtils';

const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const getPlaylistInfo = async (playlistInput: string) => {
  try {
    // Check if this is a full URL or just a playlist ID
    if (playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')) {
      // Use the playlist-url endpoint for full URLs
      const params = new URLSearchParams();
      params.append('url', playlistInput);
      const response = await apiClient.get(`/playlist-url?${params.toString()}`);
      console.log("API Response - getPlaylistInfo:", response); // 🔥 Debugging
      return response.data;
    } else {
      // Use the direct playlist ID endpoint
      const response = await apiClient.get(`/playlist/${playlistInput}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    throw error;
  }
};

export const getPlaylistVideos = async (playlistInput: string, pageToken?: string, maxResults: number = 20) => {
  try {
    // Extract just the playlist ID if it's a full URL
    const playlistId = playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')
      ? extractPlaylistId(playlistInput)
      : playlistInput;
      
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }
    
    const params = new URLSearchParams();
    if (pageToken) {
      params.append('page_token', pageToken);
    }
    params.append('max_results', maxResults.toString());

    const response = await apiClient.get(`/playlist/${playlistId}/videos?${params.toString()}`);
    return {
      videos: response.data,
      nextPageToken: response.headers['x-next-page-token'] || null
    };
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
};

export const getPlaylistDuration = async (playlistInput: string) => {
  try {
    // Extract just the playlist ID if it's a full URL
    const playlistId = playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')
      ? extractPlaylistId(playlistInput)
      : playlistInput;
      
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }
    
    const response = await apiClient.get(`/playlist/${playlistId}/duration`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist duration:', error);
    throw error;
  }
};