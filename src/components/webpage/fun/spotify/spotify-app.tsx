'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  WindowSizeProvider,
  useWindowSize,
} from '@/components/webpage/breakpoints';
import { ChevronLeft, ChevronRight, User, BarChart3 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  NavigationProvider,
  useNavigation,
} from '@/components/webpage/chevron-button';
import MainArea from './components/main-area';
import PlayingSong from './components/playing-song';
import ArtistArea from './components/artist-area';
import PlaylistArea from './components/playlist-area';
import LibraryPanel from './components/library-pannel';
import FriendPanel from './components/friend-pannel';
import { IoHome } from 'react-icons/io5';
import { Artist, PlaylistTrack, Playlist, Album } from './spotify-play-service';
import { getSpotifyManager, AudioTrack } from './current-song-helper';

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

const SpotifyContent: React.FC = () => {
  const { isXs, isSm, isMd } = useWindowSize();
  const {
    navigate,
    getCurrentState,
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
  } = useNavigation();

  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFriendPanelOpen, setIsFriendPanelOpen] = useState(false);
  const [isLibraryPanelExpanded, setIsLibraryPanelExpanded] = useState(false);

  // Mobile view state - similar to Slack
  const [mobileView, setMobileView] = useState<'library' | 'main' | 'friend'>(
    'main'
  );

  // Navigation state - using any because these objects get extended with additional properties at runtime
  const [currentView, setCurrentView] = useState<
    'main' | 'artist' | 'playlist'
  >('main');
  const [selectedArtist, setSelectedArtist] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Handle navigation state changes
  useEffect(() => {
    const currentState = getCurrentState();

    if (!currentState) {
      navigate('spotify-main');
    } else if (
      currentState.id === 'spotify-artist' &&
      currentState.data?.artist
    ) {
      setCurrentView('artist');
      setSelectedArtist(currentState.data.artist); // eslint-disable-line @typescript-eslint/no-explicit-any
    } else if (
      currentState.id === 'spotify-playlist' &&
      currentState.data?.playlist
    ) {
      setCurrentView('playlist');
      setSelectedPlaylist(currentState.data.playlist); // eslint-disable-line @typescript-eslint/no-explicit-any
    } else {
      setCurrentView('main');
    }
  }, [history, currentIndex, navigate, getCurrentState]);

  // Navigation functions
  const navigateToArtist = async (artist: Artist) => {
    try {
      // Fetch artist's albums and top tracks
      const [albumsResponse, tracksResponse] = await Promise.all([
        fetch(`/api/spotify?type=artist-albums&artist_id=${artist.id}`),
        fetch(`/api/spotify?type=artist-top-tracks&artist_id=${artist.id}`),
      ]);

      const albumsData = await albumsResponse.json();
      const tracksData = await tracksResponse.json();
      const artistWithData = {
        ...artist,
        albums: albumsData.items || [],
        topTracks: tracksData.tracks || [],
      };

      setSelectedArtist(artistWithData);
      setCurrentView('artist');
      navigate('spotify-artist', { artist: artistWithData });
    } catch (error) {
      console.error('❌ Error fetching artist data:', error);
      // Fallback to basic artist data
      setSelectedArtist(artist);
      setCurrentView('artist');
      navigate('spotify-artist', { artist });
    }
  };

  const navigateToPlaylist = async (playlist: Playlist) => {
    try {
      // Fetch playlist tracks
      const response = await fetch(
        `/api/spotify?type=playlist-tracks&playlist_id=${playlist.id}`
      );
      const data = await response.json();

      const playlistWithTracks = {
        ...playlist,
        tracks:
          data.items?.map((item: { track: PlaylistTrack }) => item.track) || [],
      };

      setSelectedPlaylist(playlistWithTracks);
      setCurrentView('playlist');
      navigate('spotify-playlist', { playlist: playlistWithTracks });
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      // Fallback to basic playlist data
      setSelectedPlaylist(playlist);
      setCurrentView('playlist');
      navigate('spotify-playlist', { playlist });
    }
  };

  const navigateToAlbum = async (album: Album) => {
    try {
      // Fetch album tracks
      const response = await fetch(
        `/api/spotify?type=album-tracks&album_id=${album.id}`
      );
      const data = await response.json();

      // Convert album to playlist-like structure for PlaylistArea
      const albumAsPlaylist = {
        id: album.id,
        name: album.name,
        description: `Album by ${
          album.artists?.map((a: { name: string }) => a.name).join(', ') ||
          'Unknown Artist'
        }`,
        images: album.images,
        owner: { display_name: album.artists?.[0]?.name || 'Unknown Artist' },
        tracks: { total: data.items?.length || 0 },
        followers: { total: 0 },
        public: true,
        type: 'album', // Add type to distinguish from regular playlists
        release_date: album.release_date,
        album_type: album.album_type,
      };

      // Transform album tracks to match playlist track structure
      const transformedTracks = (data.items || []).map(
        (track: PlaylistTrack) => ({
          ...track,
          album: {
            name: album.name,
            images: album.images || [],
          },
        })
      );

      const albumWithTracks = {
        ...albumAsPlaylist,
        tracks: transformedTracks,
      };

      setSelectedPlaylist(albumWithTracks);
      setCurrentView('playlist');
      navigate('spotify-playlist', { playlist: albumWithTracks });
    } catch (error) {
      console.error('❌ Error fetching album tracks:', error);
      // Fallback to basic album data
      const albumAsPlaylist = {
        id: album.id,
        name: album.name,
        description: `Album by ${
          album.artists?.map((a: { name: string }) => a.name).join(', ') ||
          'Unknown Artist'
        }`,
        images: album.images,
        owner: { display_name: album.artists?.[0]?.name || 'Unknown Artist' },
        tracks: [], // Empty array of tracks for fallback
        followers: { total: 0 },
        public: true,
        type: 'album',
        release_date: album.release_date,
        album_type: album.album_type,
      };

      setSelectedPlaylist(albumAsPlaylist);
      setCurrentView('playlist');
      navigate('spotify-playlist', { playlist: albumAsPlaylist });
    }
  };

  useEffect(() => {
    fetchSpotifyData();

    // Set up listeners for current track updates from Spotify SDK
    const spotifyManager = getSpotifyManager();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTrackUpdate = (track: any) => {
      setCurrentTrack(track);
    };

    const handleStatusUpdate = (playing: boolean) => {
      setIsPlaying(playing);
    };

    // Subscribe to track and status updates
    spotifyManager.onTrackUpdate(handleTrackUpdate);
    spotifyManager.onStatusUpdate(handleStatusUpdate);

    // Get initial state
    setCurrentTrack(spotifyManager.getCurrentTrack());
    setIsPlaying(spotifyManager.isCurrentlyPlaying());

    return () => {
      // Clean up would go here if needed
    };
  }, []);

  const fetchSpotifyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/spotify?type=all');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Spotify data');
      }

      setSpotifyData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load Spotify data'
      );
    } finally {
      setLoading(false);
    }
  };

  const spotifyGreen = '#1DB954';
  const spotifyBg = '#121212';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';

  if (loading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: spotifyBg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 mb-4 mx-auto"
            style={{ borderColor: spotifyGreen }}
          ></div>
          <p style={{ color: spotifyText }}>Loading Spotify...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: spotifyBg }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: spotifyText }}>
            {error}
          </p>
          <button
            onClick={fetchSpotifyData}
            className="px-4 py-2 rounded-full font-semibold transition-colors hover:scale-105"
            style={{ backgroundColor: spotifyGreen, color: 'black' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: spotifyBg }}
    >
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .spotify-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .spotify-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .spotify-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background 0.2s ease;
        }

        .spotify-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.35);
          background-clip: content-box;
        }

        .spotify-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(255, 255, 255, 0.5);
          background-clip: content-box;
        }

        .spotify-scrollbar::-webkit-scrollbar-corner {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Firefox scrollbar */
        .spotify-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Library Panel - Always present, responsive width */}
        <div
          className={`border-r transition-all duration-300 ease-in-out flex-shrink-0 ${
            isXs || isSm || isMd
              ? 'w-0 overflow-hidden'
              : isLibraryPanelExpanded
              ? 'w-80'
              : 'w-20'
          }`}
          style={{
            backgroundColor: spotifyBg,
            borderColor: '#282828',
          }}
        >
          {spotifyData && (
            <LibraryPanel
              spotifyData={spotifyData}
              isExpanded={isLibraryPanelExpanded}
              onExpandToggle={() =>
                setIsLibraryPanelExpanded(!isLibraryPanelExpanded)
              }
              onPlaylistClick={navigateToPlaylist}
            />
          )}
        </div>

        {(isXs || isSm || isMd) && (
          <AnimatePresence mode="wait">
            {mobileView === 'library' && (
              <motion.div
                key="library"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 z-10"
                style={{ backgroundColor: spotifyBg }}
              >
                {spotifyData && (
                  <LibraryPanel
                    spotifyData={spotifyData}
                    isExpanded={true}
                    onExpandToggle={() => setMobileView('main')}
                    showBackButton={true}
                    onBackClick={() => setMobileView('main')}
                    onPlaylistClick={navigateToPlaylist}
                  />
                )}
              </motion.div>
            )}
            {mobileView === 'friend' && (
              <motion.div
                key="friend"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 z-10"
                style={{ backgroundColor: spotifyBg }}
              >
                {spotifyData && (
                  <FriendPanel
                    spotifyData={spotifyData}
                    currentTrack={currentTrack || undefined}
                    isPlaying={isPlaying}
                    isOpen={true}
                    onClose={() => setMobileView('main')}
                    showBackButton={true}
                    onBack={() => setMobileView('main')}
                  />
                )}
              </motion.div>
            )}
            {mobileView === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 border-b flex-shrink-0"
                  style={{ borderColor: '#282828' }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={goBack}
                        disabled={!canGoBack}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          !canGoBack
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-white/10 cursor-pointer'
                        }`}
                        style={{ backgroundColor: '#000000' }}
                      >
                        <ChevronLeft size={20} color={spotifyTextSecondary} />
                      </button>
                      <button
                        onClick={goForward}
                        disabled={!canGoForward}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          !canGoForward
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-white/10 cursor-pointer'
                        }`}
                        style={{ backgroundColor: '#000000' }}
                      >
                        <ChevronRight size={20} color={spotifyTextSecondary} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('main');
                        navigate('spotify-main');
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
                      style={{ color: spotifyText }}
                    >
                      <IoHome size={20} color={spotifyTextSecondary} />
                    </button>
                    <button
                      onClick={() => setMobileView('library')}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
                      style={{ color: spotifyTextSecondary }}
                    >
                      <BarChart3 size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setMobileView('friend')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    style={{ color: spotifyTextSecondary }}
                    title="Friend Activity"
                  >
                    <User size={20} />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  {currentView === 'main' && spotifyData && (
                    <MainArea
                      spotifyData={spotifyData}
                      onArtistClick={navigateToArtist}
                      onPlaylistClick={navigateToPlaylist}
                    />
                  )}
                  {currentView === 'artist' && selectedArtist && (
                    <ArtistArea
                      artist={selectedArtist}
                      albums={selectedArtist.albums}
                      topTracks={selectedArtist.topTracks}
                      onPlayAlbum={navigateToAlbum}
                    />
                  )}
                  {currentView === 'playlist' && selectedPlaylist && (
                    <PlaylistArea
                      playlist={selectedPlaylist}
                      tracks={selectedPlaylist.tracks}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Main content area for large+ screens */}
        {!isXs && !isSm && !isMd && (
          <>
            {/* lg/xl: Desktop layout - both panels can be open */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 border-b flex-shrink-0"
                style={{ borderColor: '#282828' }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={goBack}
                      disabled={!canGoBack}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        !canGoBack
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-white/10 cursor-pointer'
                      }`}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <ChevronLeft size={20} color={spotifyTextSecondary} />
                    </button>
                    <button
                      onClick={goForward}
                      disabled={!canGoForward}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        !canGoForward
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-white/10 cursor-pointer'
                      }`}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <ChevronRight size={20} color={spotifyTextSecondary} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('main');
                      navigate('spotify-main');
                    }}
                    className="px-3 py-1.5 text-sm font-medium rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
                    style={{ color: spotifyText }}
                  >
                    <IoHome size={20} color={spotifyTextSecondary} />
                  </button>
                </div>

                <button
                  onClick={() => setIsFriendPanelOpen(!isFriendPanelOpen)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
                  style={{
                    color: isFriendPanelOpen
                      ? spotifyGreen
                      : spotifyTextSecondary,
                  }}
                  title="Friend Activity"
                >
                  <User size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {currentView === 'main' && spotifyData && (
                  <MainArea
                    spotifyData={spotifyData}
                    onArtistClick={navigateToArtist}
                    onPlaylistClick={navigateToPlaylist}
                  />
                )}
                {currentView === 'artist' && selectedArtist && (
                  <ArtistArea
                    artist={selectedArtist}
                    albums={selectedArtist.albums}
                    topTracks={selectedArtist.topTracks}
                    onPlayAlbum={navigateToAlbum}
                  />
                )}
                {currentView === 'playlist' && selectedPlaylist && (
                  <PlaylistArea
                    playlist={selectedPlaylist}
                    tracks={selectedPlaylist.tracks}
                  />
                )}
              </div>
            </div>

            <div
              className="border-l flex-shrink-0"
              style={{
                backgroundColor: spotifyBg,
                borderColor: '#282828',
              }}
            >
              {spotifyData && (
                <FriendPanel
                  spotifyData={spotifyData}
                  currentTrack={currentTrack || undefined}
                  isPlaying={isPlaying}
                  isOpen={isFriendPanelOpen}
                  onClose={() => setIsFriendPanelOpen(false)}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Player - Fixed at bottom */}
      <PlayingSong />
    </div>
  );
};

const SpotifyAppContent: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="h-full">
      <WindowSizeProvider containerRef={contentRef}>
        <SpotifyContent />
      </WindowSizeProvider>
    </div>
  );
};

const SpotifyApp: React.FC = () => {
  return (
    <NavigationProvider>
      <SpotifyAppContent />
    </NavigationProvider>
  );
};

export default SpotifyApp;
