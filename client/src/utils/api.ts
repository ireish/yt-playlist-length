import { extractPlaylistId } from './youtubeUtils';

// API functions
export const getPlaylistInfo = async (playlistInput: string) => {
  try {
    const playlistId = playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')
      ? extractPlaylistId(playlistInput)
      : playlistInput;

    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }

    const response = await fetch(`/api/playlist/${playlistId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch playlist info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    throw error;
  }
};

export const getPlaylistVideos = async (playlistInput: string, pageToken?: string, maxResults: number = 20) => {
  try {
    const playlistId = playlistInput.includes('youtube.com') || playlistInput.includes('youtu.be')
      ? extractPlaylistId(playlistInput)
      : playlistInput;
      
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }
    
    const params = new URLSearchParams();
    if (pageToken) {
      params.append('pageToken', pageToken);
    }
    params.append('maxResults', maxResults.toString());

    const response = await fetch(`/api/playlist/${playlistId}/videos?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch playlist videos');
    }
    
    const nextPageToken = response.headers.get('x-next-page-token') || null;
    const data = await response.json();
    
    return {
      videos: data.videos,
      nextPageToken: nextPageToken
    };
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
};