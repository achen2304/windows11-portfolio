'use client';

import React from 'react';
import Image from 'next/image';
import { BarChart3, ChevronLeft } from 'lucide-react';
import { Artist, PlaylistTrack, Playlist } from '../spotify-play-service';

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

interface LibraryPanelProps {
  spotifyData: SpotifyData;
  onPlaylistSelect?: (playlist: Playlist) => void;
  onPlaylistClick?: (playlist: Playlist) => void;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({
  spotifyData,
  onPlaylistSelect,
  onPlaylistClick,
  isExpanded = false,
  onExpandToggle,
  showBackButton = false,
  onBackClick,
}) => {
  // Spotify colors
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';

  // Get first 8 public playlists/albums for display
  const publicPlaylists =
    spotifyData.playlists?.items?.filter(
      (playlist: Playlist) => playlist.public !== false
    ) || [];
  const displayItems = publicPlaylists.slice(0, 8);

  const toggleExpanded = () => {
    if (onExpandToggle) {
      onExpandToggle();
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    if (onPlaylistSelect) {
      onPlaylistSelect(playlist);
    }
    if (onPlaylistClick) {
      onPlaylistClick(playlist);
    }
  };

  if (!isExpanded) {
    // Compact mode - just icons
    return (
      <div
        className="flex flex-col"
        style={{
          backgroundColor: spotifyBg,
          borderRight: '1px solid #282828',
          width: '80px',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header with expand button */}
        <div className="p-3 flex flex-col items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: spotifyTextSecondary }}
            title="Your Library"
          >
            <BarChart3 size={20} />
          </button>
        </div>

        {/* Compact playlist icons - scrollable */}
        <div
          className="flex-1 px-3 overflow-y-auto spotify-scrollbar"
          style={{
            minHeight: 0,
            maxHeight: 'calc(100% - 140px)', // Account for header height and playing song component
          }}
        >
          <div className="space-y-4">
            {displayItems.map((playlist: Playlist) => (
              <div
                key={playlist.id}
                className="w-12 h-12 rounded cursor-pointer hover:scale-105 transition-transform mx-auto flex-shrink-0"
                onClick={() => handlePlaylistClick(playlist)}
                title={playlist.name}
              >
                {playlist.images?.[0] ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center rounded"
                    style={{ backgroundColor: spotifyCard }}
                  >
                    <span style={{ color: spotifyTextSecondary }}>♪</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Expanded mode - with titles and details
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: spotifyBg,
        maxHeight: 'calc(100% - 80px)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {showBackButton && onBackClick ? (
            <button
              onClick={onBackClick}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: spotifyTextSecondary }}
              title="Back"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button
              onClick={toggleExpanded}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: spotifyTextSecondary }}
            >
              <BarChart3 size={20} />
            </button>
          )}
          <span
            className="text-lg font-semibold"
            style={{ color: spotifyText }}
          >
            Your Library
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: spotifyText,
              color: spotifyBg,
            }}
          >
            Playlists
          </button>
        </div>
      </div>

      {/* Expanded playlist list - scrollable */}
      <div
        className="flex-1 px-4 overflow-y-auto spotify-scrollbar"
        style={{
          minHeight: 0,
          maxHeight: 'calc(100% - 160px)', // Account for header, filter tabs, and playing song component
        }}
      >
        <div className="space-y-2 pb-4">
          {publicPlaylists.slice(0, 8).map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
              onClick={() => handlePlaylistClick(playlist)}
            >
              {/* Playlist image */}
              <div className="w-12 h-12 rounded flex-shrink-0">
                {playlist.images?.[0] ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center rounded"
                    style={{ backgroundColor: spotifyCard }}
                  >
                    <span style={{ color: spotifyTextSecondary }}>♪</span>
                  </div>
                )}
              </div>

              {/* Playlist info */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium truncate"
                  style={{ color: spotifyText }}
                >
                  {playlist.name}
                </div>
                <div
                  className="text-sm truncate"
                  style={{ color: spotifyTextSecondary }}
                >
                  Playlist • {playlist.owner?.display_name || 'Unknown'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;
