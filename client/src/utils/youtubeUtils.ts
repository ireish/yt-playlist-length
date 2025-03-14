export const extractPlaylistId = (playlistUrl: string): string | null => {
    try {
      const url = new URL(playlistUrl);
      const params = new URLSearchParams(url.search);
      return params.get('list');
    } catch (error) {
      console.error('Invalid YouTube playlist URL', error);
      return null;
    }
  };
  
  export const calculateAdjustedDuration = (durationSeconds: number, playbackSpeed: number): number => {
    return Math.round(durationSeconds / playbackSpeed);
  };
  
  export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };