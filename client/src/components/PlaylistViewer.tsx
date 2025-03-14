import React from 'react';
import { Playlist } from '../utils/types';

interface PlaylistViewerProps {
  playlist: Playlist;
  darkMode: boolean;
  isLoading: boolean;
}

const PlaylistViewer: React.FC<PlaylistViewerProps> = ({ playlist, darkMode, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '24px auto',
        padding: '24px',
        backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
        borderRadius: '8px',
        boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: darkMode ? '#FFFFFF' : '#333333' }}>
          Loading playlist data...
        </p>
      </div>
    );
  }
  
  return (
    <div style={{
      maxWidth: '800px',
      margin: '24px auto',
      padding: '24px',
      backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
      borderRadius: '8px',
      boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '24px',
          color: darkMode ? '#FFFFFF' : '#333333',
          marginBottom: '8px'
        }}>
          {playlist.title}
        </h2>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '8px'
        }}>
          Channel: {playlist.channelTitle}
        </p>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '16px'
        }}>
          {playlist.itemCount} videos
        </p>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#CCCCCC' : '#555555'
        }}>
          {playlist.description}
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {playlist.items.map((item) => (
          <div 
            key={item.id}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
              borderRadius: '8px',
              boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{
              flexShrink: 0,
              width: '120px',
              height: '90px',
              backgroundColor: darkMode ? '#333333' : '#EEEEEE',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <img 
                src={item.thumbnail} 
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: darkMode ? '#FFFFFF' : '#333333'
              }}>
                {item.title}
              </h3>
              <p style={{ 
                fontSize: '14px',
                color: darkMode ? '#BBBBBB' : '#666666',
                marginBottom: '8px'
              }}>
                {item.channelTitle}
              </p>
              <p style={{ 
                fontSize: '14px',
                color: darkMode ? '#AAAAAA' : '#777777',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistViewer;
