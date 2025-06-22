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

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const playlistResponse = await youtube.playlists.list({
      part: ['snippet', 'contentDetails'],
      id: [playlistId],
    });

    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    const playlist = playlistResponse.data.items[0];

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error fetching playlist data from YouTube API:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist data' }, { status: 500 });
  }
} 