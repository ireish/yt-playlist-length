"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlaylistInput from '../components/PlaylistInput';
import PlaylistViewer from '../components/PlaylistViewer';
import { PlaylistInfo, VideoItem, ThemeContextType } from '../utils/types';
import { getPlaylistInfo, getPlaylistVideos } from '../utils/api';

const HomePage: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  
  // Playlist state
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Playback speed for duration calculation
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  
  // Theme context
  const themeContext: ThemeContextType = {
    darkMode,
    toggleDarkMode: () => setDarkMode(prev => !prev)
  };
  
  // Effect triggered when 'Load Playlist' button is clicked
  // because `PlaylistInput` component calls `onSubmit` prop
  // which sets the `playlistId` state
  useEffect(() => {
    const loadPlaylistData = async () => {
      if (!playlistId) return;
      
      setIsLoading(true);
      setError(null);
      setVideos([]);
      setNextPageToken(null);
      
      try {
        // Fetch playlist information
        const playlist = await getPlaylistInfo(playlistId);
        console.log('DEBUG: Playlist info response:', playlist); 
        setPlaylistInfo(playlist || playlist.playlist);
        
        // Fetch first page of videos
        const { videos: firstPageVideos, nextPageToken: token } = await getPlaylistVideos(playlistId);

        console.log('DEBUG: Videos response:', firstPageVideos, token);

        setVideos(firstPageVideos);
        setNextPageToken(token);
      } catch (err) {
        console.error('Error loading playlist:', err);
        setError('Failed to load playlist. Please check the URL and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlaylistData();
  }, [playlistId]);
  
  // Handle loading more videos
  const handleLoadMore = async () => {
    if (!playlistId || !nextPageToken || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const { videos: moreVideos, nextPageToken: token } = await getPlaylistVideos(
        playlistId, 
        nextPageToken
      );
      
      setVideos(prevVideos => [...prevVideos, ...moreVideos]);
      setNextPageToken(token);
    } catch (err) {
      console.error('Error loading more videos:', err);
      setError('Failed to load more videos. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Handle playlist submission
  const handlePlaylistSubmit = (id: string) => {
    setPlaylistId(id);
  };
  
  // Handle playback speed change
  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
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
        
        {playlistInfo && (
          <PlaylistViewer 
            playlistInfo={playlistInfo}
            videos={videos}
            darkMode={darkMode}
            isLoading={isLoading}
            playbackSpeed={playbackSpeed}
            onPlaybackSpeedChange={handlePlaybackSpeedChange}
            hasMoreVideos={!!nextPageToken}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage; 