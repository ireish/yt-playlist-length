import { extractPlaylistId } from './youtubeUtils';

// API functions
export const getPlaylistData = async (playlistInput: string, pageToken?: string) => {
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

    const response = await fetch(`/api/playlist/${playlistId}?${params.toString()}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch playlist data');
    }

    return await response.json();

  } catch (error) {
    console.error('Error fetching playlist data:', error);
    throw error;
  }
};