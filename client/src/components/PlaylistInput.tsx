// Main container when no playlist is loaded

import React, { useState } from 'react';

interface PlaylistInputProps {
    onSubmit: (playlistUrl: string) => void;
    darkMode: boolean;
  }

const PlaylistInput: React.FC<PlaylistInputProps> = ({ onSubmit, darkMode }) => {
const [playlistUrl, setPlaylistUrl] = useState<string>('');
const [error, setError] = useState<string | null>(null);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Playlist:", playlistUrl); // DEBUGGING
    // Reset any previous errors
    setError(null);
    
    if (!playlistUrl.trim()) {
    setError('Please enter a YouTube playlist URL');
    return;
    }
    
    // Pass the full URL to onSubmit - the API client will handle extraction
    onSubmit(playlistUrl);
};
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
      borderRadius: '8px',
      boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        marginBottom: '16px',
        color: darkMode ? '#FFFFFF' : '#333333',
        fontSize: '20px'
      }}>
        Enter YouTube Playlist URL
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="playlist-url"
            style={{ 
              fontSize: '14px',
              color: darkMode ? '#CCCCCC' : '#666666'
            }}
          >
            Playlist URL
          </label>
          <input
            id="playlist-url"
            type="url"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            style={{
              padding: '12px 16px',
              borderRadius: '4px',
              border: darkMode ? '1px solid #444444' : '1px solid #DDDDDD',
              backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
              color: darkMode ? '#FFFFFF' : '#333333',
              fontSize: '16px',
              width: '100%'
            }}
          />
          {error && (
            <p style={{ 
              color: darkMode ? '#CF6679' : '#B00020',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              {error}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: darkMode ? '#BB86FC' : '#6200EA',
            color: darkMode ? '#000000' : '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            transition: 'background-color 0.2s ease'
          }}
        >
          Load Playlist
        </button>
      </form>
    </div>
  );
};

export default PlaylistInput;