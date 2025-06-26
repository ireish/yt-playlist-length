import { NextRequest, NextResponse } from 'next/server';
import { youtube } from '@/utils/youtube';

const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  const { playlistId } = params;
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get('pageToken') || undefined;

  if (!playlistId) {
    return NextResponse.json(
      { error: 'Playlist ID is required' },
      { status: 400 }
    );
  }

  try {
    const playlistResponse = await youtube.playlists.list({
      part: ['snippet', 'contentDetails'],
      id: [playlistId],
    });

    if (
      !playlistResponse.data.items ||
      playlistResponse.data.items.length === 0
    ) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    const playlistData = playlistResponse.data.items[0];
    const playlist = {
      id: playlistData.id,
      title: playlistData.snippet?.title,
      description: playlistData.snippet?.description,
      channel_title: playlistData.snippet?.channelTitle,
      thumbnail_url: playlistData.snippet?.thumbnails?.medium?.url,
      published_at: playlistData.snippet?.publishedAt,
      item_count: playlistData.contentDetails?.itemCount,
    };

    const playlistItemsResponse = await youtube.playlistItems.list({
      part: ['contentDetails', 'snippet'],
      playlistId: playlistId,
      maxResults: 50,
      pageToken: pageToken,
    });

    const videoIds =
      playlistItemsResponse.data.items
        ?.map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => !!id) || [];

    let videos: any[] = [];
    if (videoIds.length > 0) {
        const videosResponse = await youtube.videos.list({
            part: ['contentDetails', 'snippet'],
            id: videoIds,
        });
        videos = videosResponse.data.items?.map((video, index) => ({
            id: video.id || '',
            title: video.snippet?.title || 'No title',
            thumbnail_url: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
            channel_title: video.snippet?.channelTitle || '',
            description: video.snippet?.description || '',
            position: playlistItemsResponse.data.items?.[index]?.snippet?.position || 0,
            duration_seconds: parseDuration(video.contentDetails?.duration || ''),
            duration_text: video.contentDetails?.duration || '', // This is ISO 8601, can be formatted on frontend
            published_at: video.snippet?.publishedAt || '',
        })) || [];
    }

    const nextPageToken = playlistItemsResponse.data.nextPageToken || null;

    return NextResponse.json({
      playlist,
      videos,
      nextPageToken,
    });
  } catch (error: any) {
    console.error('Error fetching playlist data from YouTube API:', error);
    const errorMessage =
      error?.response?.data?.error?.message || 'Failed to fetch playlist data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 