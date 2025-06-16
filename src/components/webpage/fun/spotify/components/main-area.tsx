'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { getSpotifyManager, AudioTrack } from '../current-song-helper';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { Artist, Playlist, PlaylistTrack } from '../spotify-play-service';

interface SpotifyData {
  profile: {
    id: string;
    display_name: string;
    images?: { url: string }[];
  };
  playlists: {
    items: Playlist[];
  };
  topArtists: {
    items: Artist[];
  };
  topTracks: {
    items: PlaylistTrack[];
  };
  currentTrack: PlaylistTrack | null;
}

interface MainAreaProps {
  spotifyData: SpotifyData;
  isPlaying?: boolean;
  currentTrack?: PlaylistTrack;
  onArtistClick?: (artist: Artist) => void;
  onPlaylistClick?: (playlist: Playlist) => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  spotifyData,
  onArtistClick,
  onPlaylistClick,
}) => {
  const { isXs, isSm, isMd, isLg } = useWindowSize();
  const spotifyGreen = '#1DB954';
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';

  const spotifyManager = getSpotifyManager();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePlayTrack = async (track: PlaylistTrack, context?: string) => {

    // Convert Spotify track to AudioTrack format (preview_url not needed for SDK)
    const audioTrack: AudioTrack = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      preview_url: track.preview_url, // SDK doesn't use this but keep for compatibility
      duration_ms: track.duration_ms,
      uri: track.uri || `spotify:track:${track.id}`, // Add Spotify URI for SDK
    };

    try {
      await spotifyManager.playTrack(audioTrack, context);
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      alert(
        `Failed to play "${track.name}". Make sure you have Spotify Premium.`
      );
    }
  };

  const handlePlayPlaylist = async (playlist: Playlist) => {

    try {
      // Fetch playlist tracks from Spotify API
      const response = await fetch(
        `/api/spotify?type=playlist-tracks&playlist_id=${playlist.id}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // Play the first available track (no need to check for preview_url with SDK)
        const firstTrack = data.items.find(
          (item: { track: PlaylistTrack; is_local?: boolean }) =>
            item.track && !item.track.is_local
        );

        if (firstTrack && firstTrack.track) {
          // Pass playlist context for next/previous functionality
          const playlistContext =
            playlist.uri || `spotify:playlist:${playlist.id}`;
          await handlePlayTrack(firstTrack.track, playlistContext);
        } else {
          console.warn('❌ No valid tracks in playlist, using fallback');
          // Fallback: play a track from top tracks
          const fallbackTrack = spotifyData.topTracks?.items?.[0];
          if (fallbackTrack) {
            await handlePlayTrack(fallbackTrack);
          } else {
            alert('No playable tracks available');
          }
        }
      } else {
        console.warn('❌ No tracks in playlist response, using fallback');
        // Fallback: play a track from top tracks
        const fallbackTrack = spotifyData.topTracks?.items?.[0];
        if (fallbackTrack) {
          await handlePlayTrack(fallbackTrack);
        } else {
          alert('No playable tracks available');
        }
      }
    } catch (error) {
      console.error('💥 Error fetching playlist tracks:', error);
      // Fallback: play a track from top tracks
      const fallbackTrack = spotifyData.topTracks?.items?.[0];
      if (fallbackTrack) {
        await handlePlayTrack(fallbackTrack);
      } else {
        alert('No playable tracks available');
      }
    }
  };

  const handlePlayArtistTopTrack = async (artist: Artist) => {
    try {
      // Fetch the artist's top tracks from Spotify
      const response = await fetch(
        `/api/spotify?type=artist-top-tracks&artist_id=${artist.id}`
      );
      const data = await response.json();

      if (data.tracks && data.tracks.length > 0) {
        // Play the first top track with album context (artist URI doesn't work as context)
        const topTrack = data.tracks[0];

        // Use album context instead of artist context (artist URIs don't work for playback)
        const albumContext =
          topTrack.album?.uri || `spotify:album:${topTrack.album?.id}`;
        await handlePlayTrack(topTrack, albumContext);
      } else {
        console.warn('❌ No top tracks found for artist, using fallback');
        // Fallback: play a track from user's top tracks
        const fallbackTrack = spotifyData.topTracks?.items?.[0];
        if (fallbackTrack) {
          const albumContext =
            fallbackTrack.album?.uri ||
            `spotify:album:${fallbackTrack.album?.id}`;
          await handlePlayTrack(fallbackTrack, albumContext);
        } else {
          alert(`No tracks available for ${artist.name}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch artist top tracks:', error);

      // Fallback: play a track from user's top tracks
      const fallbackTrack = spotifyData.topTracks?.items?.[0];
      if (fallbackTrack) {
        const albumContext =
          fallbackTrack.album?.uri ||
          `spotify:album:${fallbackTrack.album?.id}`;
        await handlePlayTrack(fallbackTrack, albumContext);
      } else {
        alert(`Unable to play tracks for ${artist.name}`);
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: spotifyBg }}
    >
      <div
        className="flex-1 overflow-y-auto spotify-scrollbar"
        style={{ maxHeight: 'calc(100% - 80px)' }}
      >
        <div className="p-6 pb-6">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-6"
              style={{ color: spotifyText }}
            >
              {getTimeOfDay()}
            </h1>

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6">
              <button
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: spotifyText,
                  color: spotifyBg,
                }}
              >
                All
              </button>
            </div>

            {/* Recent Playlists Grid - 6 playlists */}
            <div
              className={`grid gap-4 mb-8 ${
                isXs
                  ? 'grid-cols-1'
                  : isSm
                  ? 'grid-cols-1'
                  : isMd
                  ? 'grid-cols-2'
                  : isLg
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {spotifyData.playlists?.items
                ?.slice(0, 6)
                .map((playlist: Playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                    style={{ backgroundColor: '#2A2A2A' }}
                    onClick={() =>
                      onPlaylistClick
                        ? onPlaylistClick(playlist)
                        : handlePlayPlaylist(playlist)
                    }
                  >
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      {playlist.images?.[0] ? (
                        <Image
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: spotifyCard }}
                        >
                          <span style={{ color: spotifyTextSecondary }}>♪</span>
                        </div>
                      )}
                    </div>
                    <span
                      className="font-medium text-sm truncate flex-1"
                      style={{ color: spotifyText }}
                    >
                      {playlist.name}
                    </span>
                    <button
                      className="w-12 h-12 cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:scale-105 hover:brightness-110"
                      style={{ backgroundColor: spotifyGreen }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPlaylist(playlist);
                      }}
                    >
                      <Play size={20} fill="#000000" color="#000000" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Artists Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: spotifyText }}>
                Your top artists
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {spotifyData.topArtists?.items
                ?.slice(0, 5)
                .map((artist: Artist) => (
                  <div
                    key={artist.id}
                    className="p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group flex-shrink-0 w-40"
                    style={{ backgroundColor: spotifyCard }}
                    onClick={() =>
                      onArtistClick
                        ? onArtistClick(artist)
                        : handlePlayArtistTopTrack(artist)
                    }
                  >
                    <div className="relative mb-4">
                      <div className="aspect-square rounded-full overflow-hidden">
                        {artist.images?.[0] ? (
                          <Image
                            src={artist.images[0].url}
                            alt={artist.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: spotifyBg }}
                          >
                            <span style={{ color: spotifyTextSecondary }}>
                              ♪
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        className="absolute bottom-2 right-2 w-12 h-12 cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl hover:scale-105 hover:brightness-110"
                        style={{ backgroundColor: spotifyGreen }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayArtistTopTrack(artist);
                        }}
                      >
                        <Play size={20} fill="#000000" color="#000000" />
                      </button>
                    </div>
                    <h3
                      className="font-bold text-base truncate mb-1"
                      style={{ color: spotifyText }}
                    >
                      {artist.name}
                    </h3>
                    <p
                      className="text-sm truncate"
                      style={{ color: spotifyTextSecondary }}
                    >
                      Artist
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Tracks Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: spotifyText }}>
                Your top tracks
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {spotifyData.topTracks?.items
                ?.slice(0, 5)
                .map((track: PlaylistTrack) => (
                  <div
                    key={track.id}
                    className="p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group flex-shrink-0 w-40"
                    style={{ backgroundColor: spotifyCard }}
                    onClick={() => {
                      // Use album context for better next/previous functionality
                      const albumContext =
                        track.album?.uri || `spotify:album:${track.album?.id}`;
                      handlePlayTrack(track, albumContext);
                    }}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-square rounded overflow-hidden">
                        {track.album?.images?.[0] ? (
                          <Image
                            src={track.album.images[0].url}
                            alt={track.album.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: spotifyBg }}
                          >
                            <span style={{ color: spotifyTextSecondary }}>
                              ♪
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        className="absolute bottom-2 right-2 w-12 h-12 cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl hover:scale-105 hover:brightness-110"
                        style={{ backgroundColor: spotifyGreen }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const albumContext =
                            track.album?.uri ||
                            `spotify:album:${track.album?.id}`;
                          handlePlayTrack(track, albumContext);
                        }}
                      >
                        <Play size={20} fill="#000000" color="#000000" />
                      </button>
                    </div>
                    <h3
                      className="font-bold text-base truncate mb-1"
                      style={{ color: spotifyText }}
                    >
                      {track.name}
                    </h3>
                    <p
                      className="text-sm truncate"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {track.artists
                        ?.map((artist: { name: string }) => artist.name)
                        .join(', ')}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArea;
