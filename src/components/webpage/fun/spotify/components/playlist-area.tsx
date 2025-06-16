'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Clock } from 'lucide-react';
import { getSpotifyManager, AudioTrack } from '../current-song-helper';
import { Playlist } from '../spotify-play-service';

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: { name: string }[];
  album: {
    name: string;
    images?: { url: string }[];
  };
  added_at?: string;
  preview_url?: string;
  uri?: string;
  is_local?: boolean;
}

interface PlaylistAreaProps {
  playlist: Playlist;
  tracks?: Track[];
}

const PlaylistArea: React.FC<PlaylistAreaProps> = ({
  playlist,
  tracks = [],
}) => {
  // Spotify colors
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';
  const spotifyGreen = '#1DB954';

  const spotifyManager = getSpotifyManager();

  // Get playlist image
  const playlistImage = playlist.images?.[0]?.url;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getTotalDuration = () => {
    const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const handlePlayTrack = async (track: Track, context?: string) => {
    // Convert track to AudioTrack format
    const audioTrack: AudioTrack = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: {
        name: track.album.name,
        images: track.album.images || [],
      },
      preview_url: track.preview_url || null,
      duration_ms: track.duration_ms,
      uri: track.uri || `spotify:track:${track.id}`,
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

  const handlePlayPlaylist = async () => {
    try {
      if (tracks.length > 0) {
        // Play the first available track (no need to check for preview_url with SDK)
        const firstTrack = tracks.find((track) => track && track.id);

        if (firstTrack) {
          // Pass playlist context for next/previous functionality
          const playlistContext = `spotify:playlist:${playlist.id}`;
          await handlePlayTrack(firstTrack, playlistContext);
        } else {
          alert('No playable tracks available');
        }
      } else {
        // Fetch playlist tracks from Spotify API
        const response = await fetch(
          `/api/spotify?type=playlist-tracks&playlist_id=${playlist.id}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          // Play the first available track
          const firstTrack = data.items.find(
            (item: { track: Track; is_local?: boolean }) =>
              item.track && !item.track.is_local
          );

          if (firstTrack && firstTrack.track) {
            // Pass playlist context for next/previous functionality
            const playlistContext = `spotify:playlist:${playlist.id}`;
            await handlePlayTrack(firstTrack.track, playlistContext);
          } else {
            alert('No playable tracks available');
          }
        } else {
          alert('No playable tracks available');
        }
      }
    } catch (error) {
      console.error('💥 Error playing playlist:', error);
      alert('No playable tracks available');
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
        {/* Playlist Header */}
        <div
          className="relative p-8 pb-6 flex-shrink-0"
          style={{
            backgroundImage: playlistImage
              ? `linear-gradient(transparent 0%, rgba(0,0,0,.5) 100%), url(${playlistImage})`
              : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundSize: '100%',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-end gap-6">
            <div className="w-60 h-60 rounded-lg overflow-hidden shadow-2xl">
              {playlistImage ? (
                <Image
                  src={playlistImage}
                  alt={playlist.name}
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: spotifyCard }}
                >
                  <span
                    className="text-6xl"
                    style={{ color: spotifyTextSecondary }}
                  >
                    ♪
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: spotifyText }}
              >
                {playlist.public ? 'Public Playlist' : 'Playlist'}
              </p>
              <h1
                className="text-6xl font-bold mb-4"
                style={{ color: spotifyText }}
              >
                {playlist.name}
              </h1>
              {playlist.description && (
                <p
                  className="text-lg mb-4 opacity-70"
                  style={{ color: spotifyText }}
                >
                  {playlist.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold" style={{ color: spotifyText }}>
                  {playlist.owner?.display_name || 'Unknown'}
                </span>
                <span style={{ color: spotifyTextSecondary }}>•</span>
                <span style={{ color: spotifyTextSecondary }}>
                  {tracks.length} songs
                </span>
                {tracks.length > 0 && (
                  <>
                    <span style={{ color: spotifyTextSecondary }}>,</span>
                    <span style={{ color: spotifyTextSecondary }}>
                      {getTotalDuration()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Action Button */}
        <div className="p-8 pt-6 flex-shrink-0">
          <button
            className="w-14 h-14 cursor-pointer rounded-full flex items-center justify-center transition-transform hover:scale-105 hover:brightness-110"
            style={{ backgroundColor: spotifyGreen }}
            onClick={handlePlayPlaylist}
          >
            <Play size={24} fill="black" color="black" />
          </button>
        </div>

        {/* Track List */}
        <div className="px-8 pb-24">
          {tracks.length > 0 && (
            <>
              {/* Header Row */}
              <div
                className="grid grid-cols-12 gap-4 px-4 py-2 border-b text-sm font-medium"
                style={{
                  borderColor: '#282828',
                  color: spotifyTextSecondary,
                }}
              >
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Album</div>
                <div className="col-span-2">Date added</div>
                <div className="col-span-1 flex justify-center">
                  <Clock size={16} />
                </div>
              </div>

              {/* Track Rows */}
              <div className="mt-4 space-y-1">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="grid grid-cols-12 gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() =>
                      handlePlayTrack(track, `spotify:playlist:${playlist.id}`)
                    }
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <span
                        className="group-hover:hidden"
                        style={{ color: spotifyTextSecondary }}
                      >
                        {index + 1}
                      </span>
                      <Play
                        size={16}
                        className="hidden group-hover:block"
                        style={{ color: spotifyText }}
                      />
                    </div>

                    <div className="col-span-5 flex items-center gap-3">
                      {track.album.images?.[0] && (
                        <Image
                          src={track.album.images[0].url}
                          alt={track.album.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded"
                        />
                      )}
                      <div className="min-w-0">
                        <div
                          className="font-medium truncate"
                          style={{ color: spotifyText }}
                        >
                          {track.name}
                          {track.explicit && (
                            <span
                              className="ml-2 px-1 py-0.5 text-xs rounded"
                              style={{
                                backgroundColor: spotifyTextSecondary,
                                color: spotifyBg,
                              }}
                            >
                              E
                            </span>
                          )}
                        </div>
                        <div
                          className="text-sm truncate"
                          style={{ color: spotifyTextSecondary }}
                        >
                          {track.artists.map((a) => a.name).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-span-3 flex items-center text-sm truncate"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {track.album.name}
                    </div>

                    <div
                      className="col-span-2 flex items-center text-sm"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {track.added_at && formatDate(track.added_at)}
                    </div>

                    <div
                      className="col-span-1 flex items-center justify-center text-sm"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {formatDuration(track.duration_ms)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistArea;
