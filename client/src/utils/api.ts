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
    let response;
    
    // Check if this is a full URL or just a playlist ID
    if (playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')) {
      // Use the playlist-url endpoint for full URLs
      const params = new URLSearchParams();
      params.append('url', playlistInput);
      response = await apiClient.get(`/playlist-url?${params.toString()}`);
    } else {
      // Use the direct playlist ID endpoint
      response = await apiClient.get(`/playlist/${playlistInput}`);
    }
    
    // Return the response data directly - we'll handle structure in the component
    return response.data;
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
    
    // Check headers for the next page token
    const nextPageToken = response.headers['x-next-page-token'] || null;
    
    // Log the response to help diagnose any issues
    console.log('API videos response:', {
      data: response.data,
      headers: response.headers,
      nextPageToken
    });
    
    return {
      videos: response.data,
      nextPageToken: nextPageToken
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