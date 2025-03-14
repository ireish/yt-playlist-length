import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PlaylistInput from './components/PlaylistInput';
import PlaylistViewer from './components/PlaylistViewer';
import { fetchPlaylistData } from './utils/youtubeUtils';
import { Playlist, ThemeContextType } from './utils/types';
import './styles/globalStyles.css';

const App: React.FC = () => {
  // State management
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize dark mode based on user's system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [playlistData, setPlaylistData] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Theme context for providing theme throughout the app
  const themeContext: ThemeContextType = {
    darkMode,
    toggleDarkMode: () => setDarkMode(prev => !prev)
  };
  
  // Effect to handle playlist data fetching
  useEffect(() => {
    const loadPlaylistData = async () => {
      if (!playlistId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchPlaylistData(playlistId);
        
        if (data) {
          setPlaylistData(data);
        } else {
          setError('Failed to load playlist data. Please try again.');
        }
      } catch (err) {
        console.error('Error loading playlist:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlaylistData();
  }, [playlistId]);
  
  // Handle playlist submission
  const handlePlaylistSubmit = (id: string) => {
    setPlaylistId(id);
  };
  
  return (
    <div style={{
      backgroundColor: darkMode ? '#121212' : '#F8F8F8',
      color: darkMode ? '#FFFFFF' : '#333333',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <Header theme={themeContext} />
      
      <main style={{ padding: '0 16px' }}>
        <PlaylistInput 
          onSubmit={handlePlaylistSubmit} 
          darkMode={darkMode} 
        />
        
        {error && (
          <div style={{
            maxWidth: '800px',
            margin: '24px auto',
            padding: '16px',
            backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
            borderRadius: '8px',
            boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ 
              color: darkMode ? '#CF6679' : '#B00020',
              fontSize: '16px'
            }}>
              {error}
            </p>
          </div>
        )}
        
        {playlistData && (
          <PlaylistViewer 
            playlist={playlistData} 
            darkMode={darkMode}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default App;