'use client';

import React from 'react';
import Image from 'next/image';
import { X, ChevronLeft } from 'lucide-react';
import { Artist, PlaylistTrack, Playlist } from '../spotify-play-service';
import { AudioTrack } from '../current-song-helper';

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
}

const FriendPanel: React.FC<FriendPanelProps> = ({
  spotifyData,
  currentTrack,
  isOpen = true,
  onClose,
  showBackButton = false,
  onBack,
}) => {
  // Spotify colors
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';

  // Get current or fallback track
  const displayTrack = currentTrack || spotifyData.topTracks?.items?.[0];
  const displayName = 'Cai Chen';

  if (!isOpen) {
    return null;
  }

  const truncateText = (text: string, maxLength: number) => {
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
            Currently Listening
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
            <div className="flex items-start gap-3">
              {/* Profile Image */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                {spotifyData.profile?.images?.[0] ? (
                  <Image
                    src={spotifyData.profile.images[0].url}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: spotifyCard }}
                  >
                    <span style={{ color: spotifyTextSecondary }}>C</span>
                  </div>
                )}
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-medium text-sm"
                    style={{ color: spotifyText }}
                  >
                    {displayName}
                  </span>
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
