'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  AlertCircle,
} from 'lucide-react';
import {
  getSpotifyManager,
  AudioTrack,
  formatTime,
} from '../helpers/current-song-helper';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';

interface PlayingSongProps {
  currentTrack?: AudioTrack | null;
  className?: string;
}

const PlayingSong: React.FC<PlayingSongProps> = ({
  currentTrack: propCurrentTrack,
  className = '',
}) => {
  const { isXs, isSm } = useWindowSize();
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(
    propCurrentTrack || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isVolumeInteracting, setIsVolumeInteracting] = useState(false);

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const spotifyManager = getSpotifyManager();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumePanelRef = useRef<HTMLDivElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Spotify colors
  const spotifyGreen = '#1DB954';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';
  const spotifyRed = '#E22134';

  useEffect(() => {
    // Set initial volume
    setVolume(spotifyManager.getVolume());
    setIsPremium(spotifyManager.isPremiumAccount());
    setIsPlayerReady(spotifyManager.isReady());

    // Subscribe to Spotify manager updates
    const unsubscribeProgress = spotifyManager.onProgressUpdate((progress) => {
      if (!isDragging) {
        setProgress(progress);
        const duration = spotifyManager.getDuration();
        setCurrentTime((progress * duration) / 1000); // Convert to seconds
        setDuration(duration / 1000); // Convert to seconds
      }
    });

    const unsubscribeStatus = spotifyManager.onStatusUpdate((playing) => {
      setIsPlaying(playing);
    });

    const unsubscribeTrack = spotifyManager.onTrackUpdate((track) => {
      setCurrentTrack(track);
      if (track) {
        setCurrentTime(0);
        setProgress(0);
      }
    });

    const unsubscribePremium = spotifyManager.onPremiumUpdate((premium) => {
      setIsPremium(premium);
    });

    const unsubscribeReady = spotifyManager.onReadyUpdate((ready) => {
      setIsPlayerReady(ready);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeStatus();
      unsubscribeTrack();
      unsubscribePremium();
      unsubscribeReady();
      
      // Clear volume timeout on cleanup
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, [isDragging, spotifyManager]);

  const handlePlayPause = async () => {
    if (hasTrack && isPremium) {
      await spotifyManager.togglePlayPause();
    }
  };

  const handlePrevious = async () => {
    if (hasTrack && isPremium) {
      await spotifyManager.previousTrack();
    }
  };

  const handleNext = async () => {
    if (hasTrack && isPremium) {
      await spotifyManager.nextTrack();
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    await spotifyManager.setVolume(clampedVolume);
    
    // Show volume interaction state
    setIsVolumeInteracting(true);
    
    // Clear existing timeout
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    
    // Set new timeout to hide after 3 seconds
    volumeTimeoutRef.current = setTimeout(() => {
      setIsVolumeInteracting(false);
      setIsVolumeHovered(false);
    }, 3000);
  };

  const handleVolumeMouseEnter = () => {
    setIsVolumeHovered(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
      volumeTimeoutRef.current = null;
    }
  };

  const handleVolumeMouseLeave = () => {
    if (!isVolumeInteracting) {
      setIsVolumeHovered(false);
    }
  };

  const handleProgressClick = async (e: React.MouseEvent) => {
    if (!progressBarRef.current || !hasTrack || !isPremium) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    const clampedProgress = Math.max(0, Math.min(1, newProgress));

    const newTime = clampedProgress * duration;
    await spotifyManager.seekTo(newTime);
    setProgress(clampedProgress);
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    if (!isPremium) return;
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !progressBarRef.current || !isPremium) return;
    handleProgressClick(e);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMute = () => {
    if (!isPremium) return;
    if (volume > 0) {
      handleVolumeChange(0);
    } else {
      handleVolumeChange(0.7);
    }
  };

  const toggleVolumePanel = () => {
    setShowVolumePanel(!showVolumePanel);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = async (e: MouseEvent) => {
      if (isDragging && progressBarRef.current && isPremium) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = newProgress * duration;
        await spotifyManager.seekTo(newTime);
        setProgress(newProgress);
        setCurrentTime(newTime);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, duration, isPremium, spotifyManager]);

  // Close volume panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumePanelRef.current &&
        !volumePanelRef.current.contains(event.target as Node)
      ) {
        setShowVolumePanel(false);
      }
    };

    if (showVolumePanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumePanel]);

  // Premium warning component
  const PremiumWarning = () => (
    <div
      className={`fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-center ${className}`}
      style={{
        backgroundColor: spotifyCard,
        borderColor: '#282828',
        zIndex: 1000,
      }}
    >
      <div className="flex items-center gap-3">
        <AlertCircle size={20} style={{ color: spotifyRed }} />
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: spotifyText }}>
            Spotify Premium Required
          </p>
          <p className="text-xs" style={{ color: spotifyTextSecondary }}>
            Playback requires a Spotify Premium account
          </p>
        </div>
      </div>
    </div>
  );

  // Show premium warning if user doesn't have premium
  setTimeout(() => {
    if (!isPremium) {
      return <PremiumWarning />;
    }
  }, 1000);

  // Show loading state if player is not ready
  if (!isPlayerReady) {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-center ${className}`}
        style={{
          backgroundColor: spotifyCard,
          borderColor: '#282828',
          zIndex: 1000,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent"
            style={{
              borderColor: spotifyGreen,
              borderBottomColor: 'transparent',
            }}
          />
          <p className="text-sm" style={{ color: spotifyTextSecondary }}>
            Initializing Spotify Player...
          </p>
        </div>
      </div>
    );
  }

  // Always show the player bar, but with empty left section if no track
  const hasTrack = !!currentTrack;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-20 border-t flex items-center ${className}`}
      style={{
        backgroundColor: spotifyCard,
        borderColor: '#282828',
        zIndex: 1000,
      }}
    >
      {/* Left section - Track info */}
      <div className="flex items-center gap-4 px-4 w-80 min-w-0">
        {hasTrack ? (
          <>
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
              {currentTrack!.album?.images?.[0] ? (
                <Image
                  src={currentTrack!.album.images[0].url}
                  alt={currentTrack!.album.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: '#333' }}
                >
                  <ListMusic
                    size={24}
                    style={{ color: spotifyTextSecondary }}
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-sm font-medium truncate"
                style={{ color: spotifyText }}
              >
                {currentTrack!.name}
              </h3>
              <p
                className="text-xs truncate hover:underline cursor-pointer"
                style={{ color: spotifyTextSecondary }}
              >
                {currentTrack!.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </>
        ) : (
          // Empty space when no track is playing
          <div className="w-full h-14" />
        )}
      </div>

      {/* Center section - Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 px-4">
        {/* Control buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevious}
            className="text-gray-400 cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: spotifyTextSecondary }}
            disabled={!hasTrack}
            title="Previous track"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full hover:scale-105 hover:brightness-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 cursor-pointer"
            style={{
              backgroundColor: hasTrack ? spotifyGreen : '#535353',
              color: '#000',
            }}
            disabled={!hasTrack}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={handleNext}
            className="text-gray-400 cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: spotifyTextSecondary }}
            disabled={!hasTrack}
            title="Next track"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span
            className="text-xs tabular-nums"
            style={{ color: spotifyTextSecondary }}
          >
            {hasTrack ? formatTime(currentTime) : '0:00'}
          </span>
          <div
            ref={progressBarRef}
            className={`flex-1 h-1 rounded-full group ${
              hasTrack ? 'cursor-pointer' : 'cursor-default'
            }`}
            style={{ backgroundColor: '#4D4D4D' }}
            onMouseDown={hasTrack ? handleProgressMouseDown : undefined}
            onMouseMove={hasTrack ? handleProgressMouseMove : undefined}
            onMouseUp={hasTrack ? handleProgressMouseUp : undefined}
          >
            <div
              className="h-full rounded-full transition-all group-hover:bg-green-400"
              style={{
                backgroundColor: hasTrack ? spotifyGreen : '#535353',
                width: `${hasTrack ? progress * 100 : 0}%`,
              }}
            />
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ color: spotifyTextSecondary }}
          >
            {hasTrack ? formatTime(duration) : '0:00'}
          </span>
        </div>
      </div>

      {/* Right section - Volume control */}
      <div
        className="flex items-center gap-3 px-4 w-80 justify-end relative"
        ref={volumePanelRef}
      >
        {isXs || isSm ? (
          // Small screens - Volume panel button
          <>
            <button
              onClick={toggleVolumePanel}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ color: spotifyTextSecondary }}
              title="Volume"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Volume Panel - appears above */}
            {showVolumePanel && (
              <div
                className="absolute bottom-full right-0 mb-2 p-4 rounded-lg shadow-xl border"
                style={{
                  backgroundColor: spotifyCard,
                  borderColor: '#282828',
                  minWidth: '200px',
                  zIndex: 10,
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: spotifyText }}
                    >
                      Volume
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {volume === 0 ? (
                        <VolumeX size={14} />
                      ) : (
                        <Volume2 size={14} />
                      )}
                    </button>

                    <div
                      className="flex-1 relative"
                      onMouseEnter={handleVolumeMouseEnter}
                      onMouseLeave={handleVolumeMouseLeave}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) =>
                          handleVolumeChange(parseFloat(e.target.value))
                        }
                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer transition-all duration-300 spotify-volume-slider ${
                          isVolumeHovered || isVolumeInteracting ? 'active' : ''
                        }`}
                        style={{
                          background: `linear-gradient(to right, ${
                            isVolumeHovered || isVolumeInteracting ? spotifyGreen : currentTheme.soundKnob
                          } 0%, ${
                            isVolumeHovered || isVolumeInteracting ? spotifyGreen : currentTheme.soundKnob
                          } ${
                            volume * 100
                          }%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`,
                          // Hide knob initially, show on hover/interaction
                          WebkitAppearance: 'none',
                          appearance: 'none',
                        }}
                        onMouseDown={() => setIsVolumeInteracting(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Large screens - Inline volume control
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 mb-2 hover:text-white transition-colors cursor-pointer"
              style={{ color: spotifyTextSecondary }}
              title={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <div
              className="relative transform -translate-y-2"
              onMouseEnter={handleVolumeMouseEnter}
              onMouseLeave={handleVolumeMouseLeave}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className={`w-24 h-1 rounded-lg appearance-none cursor-pointer transition-all duration-300 spotify-volume-slider ${
                  isVolumeHovered || isVolumeInteracting ? 'active' : ''
                }`}
                style={{
                  background: `linear-gradient(to right, ${
                    isVolumeHovered || isVolumeInteracting ? spotifyGreen : currentTheme.soundKnob
                  } 0%, ${
                    isVolumeHovered || isVolumeInteracting ? spotifyGreen : currentTheme.soundKnob
                  } ${
                    volume * 100
                  }%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`,
                  // Hide knob initially, show on hover/interaction
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
                onMouseDown={() => setIsVolumeInteracting(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayingSong;
