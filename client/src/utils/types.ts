export interface VideoItem {
  id: string;
  title: string;
  thumbnail_url: string;
  channel_title: string;
  description: string;
  position: number;
  duration_seconds: number;
  duration_text: string;
  published_at: string;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  channel_title: string;
  thumbnail_url: string;
  published_at: string;
  item_count: number;
  estimated_duration_seconds: number | null;
  estimated_duration_text: string | null;
}

export interface Playlist {
  playlist: PlaylistInfo;
  next_page_token: string | null;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}