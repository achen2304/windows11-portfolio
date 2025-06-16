import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// You'll need to set these environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function spotifyRequest(endpoint: string, accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 204) {
      return null; // No content (e.g., no currently playing track)
    }
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const accessToken = await getAccessToken();

    switch (type) {
      case 'profile':
        const profile = await spotifyRequest('/me', accessToken);
        return NextResponse.json(profile);

      case 'playlists':
        const playlists = await spotifyRequest(
          '/me/playlists?limit=20',
          accessToken
        );
        return NextResponse.json(playlists);

      case 'playlist-tracks':
        const playlistId = searchParams.get('playlist_id');
        if (!playlistId) {
          return NextResponse.json(
            { error: 'playlist_id is required' },
            { status: 400 }
          );
        }
        const playlistTracks = await spotifyRequest(
          `/playlists/${playlistId}/tracks?limit=50`,
          accessToken
        );
        return NextResponse.json(playlistTracks);

      case 'top-artists':
        const topArtists = await spotifyRequest(
          '/me/top/artists?limit=20&time_range=short_term',
          accessToken
        );
        return NextResponse.json(topArtists);

      case 'top-tracks':
        const topTracks = await spotifyRequest(
          '/me/top/tracks?limit=20&time_range=short_term',
          accessToken
        );
        return NextResponse.json(topTracks);

      case 'artist-top-tracks':
        const artistId = searchParams.get('artist_id');
        if (!artistId) {
          return NextResponse.json(
            { error: 'artist_id is required' },
            { status: 400 }
          );
        }
        const artistTopTracks = await spotifyRequest(
          `/artists/${artistId}/top-tracks?market=US`,
          accessToken
        );
        return NextResponse.json(artistTopTracks);

      case 'artist-albums':
        const albumsArtistId = searchParams.get('artist_id');
        if (!albumsArtistId) {
          return NextResponse.json(
            { error: 'artist_id is required' },
            { status: 400 }
          );
        }
        const artistAlbums = await spotifyRequest(
          `/artists/${albumsArtistId}/albums?market=US&limit=50&include_groups=album,single`,
          accessToken
        );
        return NextResponse.json(artistAlbums);

      case 'album-tracks':
        const albumId = searchParams.get('album_id');
        if (!albumId) {
          return NextResponse.json(
            { error: 'album_id is required' },
            { status: 400 }
          );
        }
        const albumTracks = await spotifyRequest(
          `/albums/${albumId}/tracks?market=US&limit=50`,
          accessToken
        );
        return NextResponse.json(albumTracks);

      case 'current-track':
        const currentTrack = await spotifyRequest(
          '/me/player/currently-playing',
          accessToken
        );
        return NextResponse.json(currentTrack || { is_playing: false });

      case 'all':
        const [
          profileData,
          playlistsData,
          topArtistsData,
          topTracksData,
          currentTrackData,
        ] = await Promise.all([
          spotifyRequest('/me', accessToken),
          spotifyRequest('/me/playlists?limit=20', accessToken),
          spotifyRequest(
            '/me/top/artists?limit=20&time_range=short_term',
            accessToken
          ),
          spotifyRequest(
            '/me/top/tracks?limit=20&time_range=short_term',
            accessToken
          ),
          spotifyRequest('/me/player/currently-playing', accessToken).catch(
            () => null
          ),
        ]);

        return NextResponse.json({
          profile: profileData,
          playlists: playlistsData,
          topArtists: topArtistsData,
          topTracks: topTracksData,
          currentTrack: currentTrackData || { is_playing: false },
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Spotify data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
