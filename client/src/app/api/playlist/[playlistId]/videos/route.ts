import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  const { playlistId } = params;
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get('pageToken') || undefined;
  const maxResults = parseInt(searchParams.get('maxResults') || '20', 10);

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const playlistItemsResponse = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: playlistId,
      maxResults: maxResults,
      pageToken: pageToken,
    });

    const videoIds = playlistItemsResponse.data.items
      ?.map((item) => item.contentDetails?.videoId)
      .filter((id): id is string => !!id);

    if (!videoIds || videoIds.length === 0) {
      return NextResponse.json({ videos: [], nextPageToken: null });
    }

    const videosResponse = await youtube.videos.list({
        part: ['contentDetails', 'snippet'],
        id: videoIds,
    });

    const videos = videosResponse.data.items;
    const nextPageToken = playlistItemsResponse.data.nextPageToken || null;
    
    const response = NextResponse.json({ videos, nextPageToken });
    if (nextPageToken) {
        response.headers.set('x-next-page-token', nextPageToken);
    }
    return response;

  } catch (error) {
    console.error('Error fetching playlist videos from YouTube API:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist videos' }, { status: 500 });
  }
} 