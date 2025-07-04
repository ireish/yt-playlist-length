import React, { useState } from 'react';
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
      }}>
        <style>
          {`
            .loader {
              border: 8px solid ${darkMode ? '#444' : '#f3f3f3'};
              border-top: 8px solid ${darkMode ? '#BB86FC' : '#6200EA'};
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div className="loader"></div>
      </div>
    );
  }
  
  // Calculate the total duration
  const totalDurationSeconds = playlistInfo.estimated_duration_seconds || videos.reduce((total, video) => total + video.duration_seconds, 0);
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
          fontSize: '22px',
          color: darkMode ? '#FFFFFF' : '#333333',
          marginBottom: '12px'
        }}>
          {playlistInfo.title}
        </h2>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '12px'
        }}>
          <strong>Channel:</strong> {playlistInfo.channel_title}
        </p>
        <p style={{ 
          fontSize: '14px',
          color: darkMode ? '#BBBBBB' : '#666666',
          marginBottom: '16px'
        }}>
          {playlistInfo.item_count} videos • <strong>Total Duration:</strong> {totalDurationFormatted}
        </p>
        
        {playlistInfo.description && (
          <>
            <h4 style={{
                fontSize: '16px',
                color: darkMode ? '#FFFFFF' : '#333333',
                marginBottom: '8px'
            }}>
                Description
            </h4>
            <p style={{
              fontSize: '14px',
              color: darkMode ? '#CCCCCC' : '#555555',
              marginBottom: '24px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6'
            }}>
              {isDescriptionExpanded || playlistInfo.description.length <= 400
                ? playlistInfo.description
                : `${playlistInfo.description.substring(0, 400)}... `}

              {!isDescriptionExpanded && playlistInfo.description.length > 400 && (
                <button
                  onClick={() => setIsDescriptionExpanded(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#BB86FC' : '#6200EA',
                    cursor: 'pointer',
                    padding: '0',
                    fontWeight: 'bold',
                    display: 'inline',
                    marginLeft: '4px',
                  }}
                >
                  Show more
                </button>
              )}
            </p>

            {isDescriptionExpanded && playlistInfo.description.length > 400 && (
                <button
                    onClick={() => setIsDescriptionExpanded(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: darkMode ? '#BB86FC' : '#6200EA',
                        cursor: 'pointer',
                        padding: '0',
                        marginTop: '-16px',
                        marginBottom: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    Show less
                </button>
            )}
          </>
        )}
        
        {/* Duration information with speed slider */}
        <div style={{
          backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '18px',
              color: darkMode ? '#FFFFFF' : '#333333',
            }}>
              Playlist Duration
            </h3>
            <p style={{ 
              fontSize: '24px',
              fontWeight: 'bold',
              color: darkMode ? '#BB86FC' : '#6200EA'
            }}>
              {adjustedDurationFormatted}
            </p>
          </div>
          
          <SpeedSlider 
            speed={playbackSpeed} 
            onChange={onPlaybackSpeedChange} 
            darkMode={darkMode} 
          />
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