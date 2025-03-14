export interface PlaylistItem {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    description: string;
  }
  
  export interface Playlist {
    id: string;
    title: string;
    items: PlaylistItem[];
    channelTitle: string;
    description: string;
    itemCount: number;
  }
  
  export interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
  }  