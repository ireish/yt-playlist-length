import { Playlist } from './types';

export const extractPlaylistId = (playlistUrl: string): string | null => {
    // Extract playlist ID from URL formats like:
    // https://www.youtube.com/playlist?list=PLAYLIST_ID
    // https://youtube.com/playlist?list=PLAYLIST_ID
    try {
      const url = new URL(playlistUrl);
      const params = new URLSearchParams(url.search);
      return params.get('list');
    } catch (error) {
      // If the URL is malformed or doesn't contain a playlist ID
      console.error('Invalid YouTube playlist URL', error);
      return null;
    }
  };
  
  // Simulated function to fetch playlist data
  // In a real app, you would call the YouTube API here
  export const fetchPlaylistData = async (playlistId: string): Promise<Playlist | null> => {
    try {
      // This is a simulation - in a real app, you would make an API call
      console.log(`Fetching playlist data for ID: ${playlistId}`);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration purposes
      const mockPlaylist: Playlist = {
        id: playlistId,
        title: "Sample YouTube Playlist",
        channelTitle: "Demo Channel",
        description: "This is a sample playlist description for demonstration purposes.",
        itemCount: 5,
        items: [
          {
            id: "video1",
            title: "Introduction to React",
            thumbnail: "https://via.placeholder.com/120x90.png?text=React+Intro",
            channelTitle: "React Tutorials",
            description: "Learn the basics of React.js in this tutorial video."
          },
          {
            id: "video2",
            title: "TypeScript Fundamentals",
            thumbnail: "https://via.placeholder.com/120x90.png?text=TypeScript",
            channelTitle: "TypeScript Tutorials",
            description: "Understand the core concepts of TypeScript."
          },
          {
            id: "video3",
            title: "Dark Mode Implementation",
            thumbnail: "https://via.placeholder.com/120x90.png?text=Dark+Mode",
            channelTitle: "UI/UX Design",
            description: "Learn how to implement dark mode in your web applications."
          },
          {
            id: "video4",
            title: "React Hooks Deep Dive",
            thumbnail: "https://via.placeholder.com/120x90.png?text=React+Hooks",
            channelTitle: "Advanced React",
            description: "Advanced tutorial on React Hooks and their applications."
          },
          {
            id: "video5",
            title: "Building Modern UIs",
            thumbnail: "https://via.placeholder.com/120x90.png?text=Modern+UI",
            channelTitle: "Web Design",
            description: "Design principles for creating modern user interfaces."
          }
        ]
      };
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error fetching playlist data:', error);
      return null;
    }
  };
  