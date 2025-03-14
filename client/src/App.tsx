import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PlaylistInput from './components/PlaylistInput';
import PlaylistViewer from './components/PlaylistViewer';
import { PlaylistInfo, VideoItem, ThemeContextType } from './utils/types';
import { getPlaylistInfo, getPlaylistVideos } from './utils/api';
import './styles/globalStyles.css';

const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
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
  
  // Debug function to log state changes
  const logState = (label: string, data: any) => {
    console.log(`[DEBUG] ${label}:`, data);
  };
  
  // Effect to load initial playlist data
  useEffect(() => {
    const loadPlaylistData = async () => {
      if (!playlistId) return;
      
      logState('Loading playlist', playlistId);
      setIsLoading(true);
      setError(null);
      setVideos([]);
      setNextPageToken(null);
      
      try {
        // Fetch playlist information
        const responseData = await getPlaylistInfo(playlistId);
        logState('API response data', responseData);
        
        // Extract the playlist info based on the API response structure
        // The backend might return either { playlist: {...} } or the playlist object directly
        const playlistData = responseData.playlist || responseData;
        logState('Extracted playlist data', playlistData);
        
        // Explicitly create a proper PlaylistInfo object to match our type definition
        const formattedPlaylistInfo: PlaylistInfo = {
          id: playlistData.id || '',
          title: playlistData.title || '',
          description: playlistData.description || '',
          channel_title: playlistData.channel_title || '',
          thumbnail_url: playlistData.thumbnail_url || '',
          published_at: playlistData.published_at || '',
          item_count: playlistData.item_count || 0,
          estimated_duration_seconds: playlistData.estimated_duration_seconds || null,
          estimated_duration_text: playlistData.estimated_duration_text || null
        };
        
        logState('Formatted playlist info', formattedPlaylistInfo);
        
        // Use the functional form of setState to ensure we're updating based on the latest state
        setPlaylistInfo(currentInfo => {
          logState('Current playlist info (before update)', currentInfo);
          logState('New playlist info (being set)', formattedPlaylistInfo);
          return formattedPlaylistInfo;
        });
        
        // Fetch first page of videos
        logState('Fetching videos for', playlistId);
        const { videos: firstPageVideos, nextPageToken: token } = await getPlaylistVideos(playlistId);
        logState('Fetched videos', firstPageVideos);
        
        // Format videos to match our VideoItem type
        const formattedVideos = firstPageVideos.map((video: any) => ({
          id: video.id || '',
          title: video.title || '',
          description: video.description || '',
          thumbnail_url: video.thumbnail_url || '',
          channel_title: video.channel_title || '',
          published_at: video.published_at || '',
          position: video.position || 0,
          duration_seconds: video.duration_seconds || 0,
          duration_text: video.duration_text || '0:00'
        }));
        
        setVideos(formattedVideos);
        setNextPageToken(token);
        
        // Check final state after all updates
        setTimeout(() => {
          logState('Final playlistInfo state', playlistInfo);
          logState('Final videos state', videos);
        }, 0);
        
      } catch (err) {
        console.error('Error loading playlist:', err);
        setError('Failed to load playlist. Please check the URL and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlaylistData();
  }, [playlistId]);
  
  // Log state changes after render to verify updates
  useEffect(() => {
    logState('Updated playlistInfo state', playlistInfo);
  }, [playlistInfo]);
  
  useEffect(() => {
    logState('Updated videos state', videos);
  }, [videos]);
  
  // Handle loading more videos
  const handleLoadMore = async () => {
    if (!playlistId || !nextPageToken || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const { videos: moreVideos, nextPageToken: token } = await getPlaylistVideos(
        playlistId, 
        nextPageToken
      );
      
      const formattedMoreVideos = moreVideos.map((video: any) => ({
        id: video.id || '',
        title: video.title || '',
        description: video.description || '',
        thumbnail_url: video.thumbnail_url || '',
        channel_title: video.channel_title || '',
        published_at: video.published_at || '',
        position: video.position || 0,
        duration_seconds: video.duration_seconds || 0,
        duration_text: video.duration_text || '0:00'
      }));
      
      setVideos(prevVideos => [...prevVideos, ...formattedMoreVideos]);
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
    logState('Playlist submitted', id);
    setPlaylistId(id);
  };
  
  // Handle playback speed change
  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };
  
  // First let's do a simpler render to make sure at least something shows up
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
        
        {/* Debug info - remove in production */}
        <div style={{
          maxWidth: '800px',
          margin: '24px auto',
          padding: '16px',
          backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
          borderRadius: '8px',
          border: '1px solid #444',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <p>Debug Info:</p>
          <p>Playlist ID: {playlistId || 'none'}</p>
          <p>Loading: {isLoading ? 'yes' : 'no'}</p>
          <p>Has playlist info: {playlistInfo ? 'yes' : 'no'}</p>
          <p>Video count: {videos.length}</p>
        </div>
        
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
        
        {isLoading && (
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
        )}
        
        {/* Render the playlist viewer only if we have both playlist info and videos */}
        {playlistInfo && videos.length > 0 && !isLoading && (
          <PlaylistViewer 
            playlistInfo={playlistInfo}
            videos={videos}
            darkMode={darkMode}
            isLoading={false}
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

export default App;


// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import PlaylistInput from './components/PlaylistInput';
// import PlaylistViewer from './components/PlaylistViewer';
// import { PlaylistInfo, VideoItem, ThemeContextType } from './utils/types';
// import { getPlaylistInfo, getPlaylistVideos } from './utils/api';
// import './styles/globalStyles.css';

// const App: React.FC = () => {
//   // Theme state
//   const [darkMode, setDarkMode] = useState<boolean>(() => {
//     return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });
  
//   // Playlist state
//   const [playlistId, setPlaylistId] = useState<string | null>(null);
//   const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
//   const [videos, setVideos] = useState<VideoItem[]>([]);
//   const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
  
//   // Playback speed for duration calculation
//   const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  
//   // Theme context
//   const themeContext: ThemeContextType = {
//     darkMode,
//     toggleDarkMode: () => setDarkMode(prev => !prev)
//   };
  
//   // Effect to load initial playlist data
//   useEffect(() => {
//     console.log("useEffect triggered, playlistId:", playlistId);  // DEBUGGING
//     const loadPlaylistData = async () => {
//       console.log("Fetching playlist data for:", playlistId); // // DEBUGGING
//       if (!playlistId) return;
      
//       setIsLoading(true);
//       setError(null);
//       setVideos([]);
//       setNextPageToken(null);
      
//       try {
//         // Fetch playlist information
//         const playlist = await getPlaylistInfo(playlistId);
//         console.log("Fetched Playlist Info:", playlist); // DEBUG
//         setPlaylistInfo(playlist.playlist);

//         setTimeout(() => {
//           console.log("Updated playlistInfo state:", playlistInfo); // DEBUG
//       }, 1000);
        
//         // Fetch first page of videos
//         const { videos: firstPageVideos, nextPageToken: token } = await getPlaylistVideos(playlistId);
//         console.log("Fetched Videos:", firstPageVideos); // DEBUG
//         setVideos(firstPageVideos);
//         setNextPageToken(token);
//       } catch (err) {
//         console.error('Error loading playlist:', err);
//         setError('Failed to load playlist. Please check the URL and try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     loadPlaylistData();
//   }, [playlistId]);
  
//   // Handle loading more videos
//   const handleLoadMore = async () => {
//     if (!playlistId || !nextPageToken || isLoadingMore) return;
    
//     setIsLoadingMore(true);
    
//     try {
//       const { videos: moreVideos, nextPageToken: token } = await getPlaylistVideos(
//         playlistId, 
//         nextPageToken
//       );
      
//       setVideos(prevVideos => [...prevVideos, ...moreVideos]);
//       setNextPageToken(token);
//     } catch (err) {
//       console.error('Error loading more videos:', err);
//       setError('Failed to load more videos. Please try again.');
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };
  
//   // Handle playlist submission
//   const handlePlaylistSubmit = (id: string) => {
//     console.log("Playlist ID received:", id); 
//     setPlaylistId(id);
//   };
  
//   // Handle playback speed change
//   const handlePlaybackSpeedChange = (speed: number) => {
//     setPlaybackSpeed(speed);
//   };
  
//   return (
//     <div style={{
//       backgroundColor: darkMode ? '#121212' : '#F8F8F8',
//       color: darkMode ? '#FFFFFF' : '#333333',
//       minHeight: '100vh',
//       transition: 'background-color 0.3s ease, color 0.3s ease'
//     }}>
//       <Header theme={themeContext} />
      
//       <main style={{ padding: '0 16px' }}>
//         <PlaylistInput 
//           onSubmit={handlePlaylistSubmit} 
//           darkMode={darkMode} 
//         />
        
//         {error && (
//           <div style={{
//             maxWidth: '800px',
//             margin: '24px auto',
//             padding: '16px',
//             backgroundColor: darkMode ? '#2D2D2D' : '#F8F8F8',
//             borderRadius: '8px',
//             boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
//           }}>
//             <p style={{ 
//               color: darkMode ? '#CF6679' : '#B00020',
//               fontSize: '16px'
//             }}>
//               {error}
//             </p>
//           </div>
//         )}
        
//         {playlistInfo && (
//           console.log("Rendering PlaylistViewer with:", playlistInfo, videos), // ✅ Debugging
//           <PlaylistViewer 
//             playlistInfo={playlistInfo}
//             videos={videos}
//             darkMode={darkMode}
//             isLoading={isLoading}
//             playbackSpeed={playbackSpeed}
//             onPlaybackSpeedChange={handlePlaybackSpeedChange}
//             hasMoreVideos={!!nextPageToken}
//             onLoadMore={handleLoadMore}
//             isLoadingMore={isLoadingMore}
//           />
//         )}
        
//       </main>
//     </div>
//   );
// };

// export default App;