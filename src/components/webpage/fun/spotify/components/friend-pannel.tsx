'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, Play } from 'lucide-react';
import {
  Artist,
  PlaylistTrack,
  Playlist,
} from '../helpers/spotify-play-service';
import { AudioTrack, getSpotifyManager } from '../helpers/current-song-helper';

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

interface FriendPanelProps {
  spotifyData: SpotifyData;
  currentTrack?: PlaylistTrack | AudioTrack;
  isPlaying?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isActive?: boolean;
}

const FriendPanel: React.FC<FriendPanelProps> = ({
  spotifyData,
  currentTrack,
  isOpen = true,
  onClose,
  showBackButton = false,
  onBack,
  isActive = true,
}) => {
  // Spotify colors
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';
  const spotifyGreen = '#1DB954';

  // State for currently playing track
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<PlaylistTrack | null>(null);

  // Get current track (what YOU are playing) or fallback track
  const displayTrack =
    currentlyPlaying ||
    currentTrack ||
    spotifyData.currentTrack ||
    spotifyData.topTracks?.items?.[0];
  const displayName = spotifyData.profile?.display_name || 'You';

  const spotifyManager = getSpotifyManager();

  // Function to fetch currently playing track
  const fetchCurrentlyPlaying = async () => {
    try {
      const response = await fetch('/api/spotify?type=current-track');

      if (response.ok) {
        const data = await response.json();
        if (data && data.item && data.is_playing && !data.item.is_local) {
          // Convert the response to PlaylistTrack format
          const track: PlaylistTrack = {
            id: data.item.id,
            name: data.item.name,
            duration_ms: data.item.duration_ms,
            explicit: data.item.explicit,
            artists: data.item.artists,
            album: {
              name: data.item.album.name,
              images: data.item.album.images,
              uri: data.item.album.uri,
              id: data.item.album.id,
            },
            preview_url: data.item.preview_url,
            uri: data.item.uri,
            is_local: data.item.is_local,
          };
          setCurrentlyPlaying(track);
        } else {
          setCurrentlyPlaying(null);
        }
      } else {
        setCurrentlyPlaying(null);
      }
    } catch (error) {
      console.error('Failed to fetch currently playing track:', error);
      setCurrentlyPlaying(null);
    }
  };

  // Fetch currently playing track on mount and set up polling
  useEffect(() => {
    if (isOpen) {
      fetchCurrentlyPlaying();

      // Poll every 5 seconds for updates
      const interval = setInterval(fetchCurrentlyPlaying, 100000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handlePlayTrack = async (
    track: PlaylistTrack | AudioTrack,
    context?: string
  ) => {
    // Convert track to AudioTrack format if it's a PlaylistTrack
    let audioTrack: AudioTrack;

    if ('album' in track && track.album && 'name' in track.album) {
      // This is a PlaylistTrack
      audioTrack = {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: {
          name: track.album.name,
          images: track.album.images,
        },
        preview_url: track.preview_url,
        duration_ms: track.duration_ms,
        uri: track.uri || `spotify:track:${track.id}`,
      };
    } else {
      // This is already an AudioTrack
      audioTrack = track as AudioTrack;
    }

    try {
      await spotifyManager.playTrack(audioTrack, context);
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      alert(
        `Failed to play "${track.name}". Make sure you have Spotify Premium.`
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: spotifyBg,
        minWidth: '240px',
        maxWidth: '400px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b flex-shrink-0"
        style={{ borderColor: '#282828' }}
      >
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => onBack && onBack()}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: spotifyTextSecondary }}
              title="Back"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <h2
            className="text-base font-semibold"
            style={{ color: spotifyText }}
          >
            Currently Playing
          </h2>
        </div>
        {!showBackButton && (
          <button
            onClick={() => onClose && onClose()}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: spotifyTextSecondary }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Friend Activity Content - scrollable */}
      <div
        className="flex-1 overflow-y-auto spotify-scrollbar"
        style={{ maxHeight: 'calc(100% - 80px)' }}
      >
        <div className="p-3">
          {displayTrack ? (
            <div
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => {
                const album = displayTrack.album as {
                  name: string;
                  images?: { url: string }[];
                  uri?: string;
                  id?: string;
                };
                const albumContext =
                  album.uri ||
                  (album.id ? `spotify:album:${album.id}` : undefined);
                handlePlayTrack(displayTrack, albumContext);
              }}
            >
              {/* Profile Image with Play Button Overlay */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                {spotifyData.profile?.images?.[0] ? (
                  <>
                    <Image
                      src={spotifyData.profile.images[0].url}
                      alt={displayName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover transition-all group-hover:brightness-50"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        className="w-6 h-6 rounded-full cursor-pointer flex items-center justify-center hover:scale-105 hover:brightness-110 transition-transform"
                        style={{ backgroundColor: spotifyGreen }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const album = displayTrack.album as {
                            name: string;
                            images?: { url: string }[];
                            uri?: string;
                            id?: string;
                          };
                          const albumContext =
                            album.uri ||
                            (album.id
                              ? `spotify:album:${album.id}`
                              : undefined);
                          handlePlayTrack(displayTrack, albumContext);
                        }}
                      >
                        <Play size={12} fill="#000000" color="#000000" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center group-hover:brightness-50 transition-all relative"
                    style={{ backgroundColor: spotifyCard }}
                  >
                    <span style={{ color: spotifyTextSecondary }}>C</span>
                    {/* Play Button Overlay for fallback */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        style={{ backgroundColor: spotifyGreen }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const album = displayTrack.album as {
                            name: string;
                            images?: { url: string }[];
                            uri?: string;
                            id?: string;
                          };
                          const albumContext =
                            album.uri ||
                            (album.id
                              ? `spotify:album:${album.id}`
                              : undefined);
                          handlePlayTrack(displayTrack, albumContext);
                        }}
                      >
                        <Play size={12} fill="#000000" color="#000000" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                {/* Online Status */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-medium text-sm"
                    style={{ color: spotifyText }}
                  >
                    {displayName}
                  </span>
                  {isActive ? (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: spotifyGreen }}
                      />
                      <span
                        className="text-xs pb-0.5"
                        style={{ color: spotifyGreen }}
                      >
                        Active
                      </span>
                    </div>
                  ) : (
                    <span
                      className="text-xs pb-0.5"
                      style={{ color: spotifyTextSecondary }}
                    >
                      Not Active
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <div
                    className="text-sm truncate"
                    style={{ color: spotifyText }}
                    title={displayTrack.name}
                  >
                    {truncateText(displayTrack.name, 30)}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: spotifyTextSecondary }}
                    title={displayTrack.artists
                      ?.map((a: { name: string }) => a.name)
                      .join(', ')}
                  >
                    {displayTrack.artists
                      ?.map((a: { name: string }) => a.name)
                      .join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: spotifyTextSecondary }}>
                No recent activity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendPanel;
