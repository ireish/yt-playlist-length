import React from 'react';
import { PlaylistInfo, VideoItem } from '../utils/types';
import { calculateAdjustedDuration, formatDuration } from '../utils/youtubeUtils';
import SpeedSlider from './SpeedSlider';

interface PlaylistViewerProps {
  playlistInfo: PlaylistInfo;
  videos: VideoItem[];
  darkMode: boolean;
  isLoading: boolean;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  hasMoreVideos: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const PlaylistViewer: React.FC<PlaylistViewerProps> = ({ 
  playlistInfo, 
  videos, 
  darkMode, 
  isLoading,
  playbackSpeed,
  onPlaybackSpeedChange,
  hasMoreVideos,
  onLoadMore,
  isLoadingMore
}) => {
  if (isLoading) {
    return (
      <div style={{
        maxWidth: '1200px',
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
  
  // Calculate the total duration
  const totalDurationSeconds = videos.reduce((total, video) => total + video.duration_seconds, 0);
  const adjustedDurationSeconds = calculateAdjustedDuration(totalDurationSeconds, playbackSpeed);
  
  // Format durations for display
  const totalDurationFormatted = formatDuration(totalDurationSeconds);
  const adjustedDurationFormatted = formatDuration(adjustedDurationSeconds);
  
  return (
    <div style={{
      maxWidth: '1200px',
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
          {playlistInfo.title}
        </h2>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '8px'
        }}>
          Channel: {playlistInfo.channel_title}
        </p>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '16px'
        }}>
          {playlistInfo.item_count} videos • Total Duration: {totalDurationFormatted}
        </p>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#CCCCCC' : '#555555',
          marginBottom: '24px'
        }}>
          {playlistInfo.description}
        </p>
        
        {/* Duration information with speed slider */}
        <div style={{
          backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            fontSize: '18px',
            color: darkMode ? '#FFFFFF' : '#333333',
            marginBottom: '16px'
          }}>
            Playlist Duration
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>
              <p style={{ 
                fontSize: '14px',
                color: darkMode ? '#BBBBBB' : '#666666',
                marginBottom: '4px'
              }}>
                Normal Speed (1.00x):
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: 'bold',
                color: darkMode ? '#FFFFFF' : '#333333'
              }}>
                {totalDurationFormatted}
              </p>
            </div>
            
            <SpeedSlider 
              speed={playbackSpeed} 
              onChange={onPlaybackSpeedChange} 
              darkMode={darkMode} 
            />
            
            <div>
              <p style={{ 
                fontSize: '14px',
                color: darkMode ? '#BBBBBB' : '#666666',
                marginBottom: '4px'
              }}>
                Adjusted Duration ({playbackSpeed.toFixed(2)}x):
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: 'bold',
                color: darkMode ? '#BB86FC' : '#6200EA'
              }}>
                {adjustedDurationFormatted}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <h3 style={{ 
        fontSize: '18px',
        color: darkMode ? '#FFFFFF' : '#333333',
        marginBottom: '16px'
      }}>
        Videos in Playlist
      </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {videos.map((video) => (
          <div 
            key={video.id}
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
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src={video.thumbnail_url} 
                alt={video.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#FFFFFF',
                padding: '2px 4px',
                borderRadius: '2px',
                fontSize: '12px'
              }}>
                {video.duration_text}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: darkMode ? '#FFFFFF' : '#333333'
              }}>
                {video.position + 1}. {video.title}
              </h3>
              <p style={{ 
                fontSize: '14px',
                color: darkMode ? '#BBBBBB' : '#666666',
                marginBottom: '8px'
              }}>
                {video.channel_title}
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
                {video.description}
              </p>
            </div>
          </div>
        ))}
        
        {hasMoreVideos && (
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            style={{
              padding: '12px 24px',
              backgroundColor: darkMode ? '#2D2D2D' : '#EEEEEE',
              color: darkMode ? '#FFFFFF' : '#333333',
              border: darkMode ? '1px solid #444444' : '1px solid #DDDDDD',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoadingMore ? 'not-allowed' : 'pointer',
              alignSelf: 'center',
              marginTop: '16px',
              opacity: isLoadingMore ? 0.7 : 1
            }}
          >
            {isLoadingMore ? 'Loading...' : 'Load More Videos'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistViewer;