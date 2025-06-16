'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { getSpotifyManager, AudioTrack } from '../current-song-helper';

interface Artist {
  id: string;
  name: string;
  images?: { url: string }[];
  followers?: { total: number };
  popularity?: number;
  genres?: string[];
}

interface Album {
  id: string;
  name: string;
  images?: { url: string }[];
  release_date: string;
  album_type: string;
  total_tracks: number;
  artists: { name: string }[];
}

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: { name: string }[];
  popularity?: number;
  preview_url?: string;
  uri?: string;
}

interface ArtistAreaProps {
  artist: Artist;
  albums?: Album[];
  topTracks?: Track[];
  onPlayAlbum?: (album: Album) => void;
}

const ArtistArea: React.FC<ArtistAreaProps> = ({
  artist,
  albums = [],
  topTracks = [],
  onPlayAlbum,
}) => {
  // Spotify colors
  const spotifyBg = '#121212';
  const spotifyCard = '#181818';
  const spotifyText = '#FFFFFF';
  const spotifyTextSecondary = '#B3B3B3';
  const spotifyGreen = '#1DB954';

  const spotifyManager = getSpotifyManager();

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handlePlayTrack = async (track: Track, context?: string) => {
    // Convert track to AudioTrack format
    const audioTrack: AudioTrack = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: {
        name: 'Unknown',
        images: [],
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

  const handlePlayArtist = async () => {

    try {
      // If we have top tracks, play the first one
      if (topTracks.length > 0) {
        const topTrack = topTracks[0];

        // Use artist context for playback
        const artistContext = `spotify:artist:${artist.id}`;
        await handlePlayTrack(topTrack, artistContext);
      } else {
        // Fallback: fetch artist's top tracks first
        const response = await fetch(
          `/api/spotify?type=artist-top-tracks&artist_id=${artist.id}`
        );
        const data = await response.json();

        if (data.tracks && data.tracks.length > 0) {
          const topTrack = data.tracks[0];

          const artistContext = `spotify:artist:${artist.id}`;
          await handlePlayTrack(topTrack, artistContext);
        } else {
          alert(`No tracks available for ${artist.name}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to play artist:', error);
      alert(`Unable to play tracks for ${artist.name}`);
    }
  };

  const handlePlayAlbum = async (album: Album) => {

    try {
      // Fetch album tracks first
      const response = await fetch(
        `/api/spotify?type=album-tracks&album_id=${album.id}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const firstTrack = data.items[0];

        // Use album context for playback
        const albumContext = `spotify:album:${album.id}`;
        await handlePlayTrack(firstTrack, albumContext);
      } else {
        console.warn(
          '❌ No tracks found in album, using artist top track fallback'
        );
        // Fallback to artist's first top track
        if (topTracks.length > 0) {
          await handlePlayTrack(topTracks[0]);
        } else {
          alert(`No tracks available for ${album.name}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch album tracks:', error);

      // Fallback to artist's first top track
      if (topTracks.length > 0) {
        await handlePlayTrack(topTracks[0]);
      } else {
        alert(`Unable to play ${album.name}`);
      }
    }
  };

  // Get the main artist image
  const artistImage = artist.images?.[0]?.url;

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: spotifyBg }}
    >
      <div
        className="flex-1 overflow-y-auto spotify-scrollbar"
        style={{ maxHeight: 'calc(100% - 80px)' }}
      >
        {/* Artist Header */}
        <div
          className="relative p-8 pb-6 flex-shrink-0"
          style={{
            background: artistImage
              ? `linear-gradient(transparent 0%, rgba(0,0,0,.5) 100%), url(${artistImage})`
              : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-end gap-6">
            {artistImage && (
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src={artistImage}
                  alt={artist.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: spotifyGreen }}
                >
                  ✓
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: spotifyText }}
                >
                  Verified Artist
                </span>
              </div>
              <h1
                className="text-6xl font-bold mb-4"
                style={{ color: spotifyText }}
              >
                {artist.name}
              </h1>
              {artist.followers && (
                <p className="text-lg" style={{ color: spotifyTextSecondary }}>
                  {formatFollowers(artist.followers.total)} monthly listeners
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="w-14 h-14 cursor-pointer rounded-full flex items-center justify-center transition-transform hover:scale-105 hover:brightness-110"
              style={{ backgroundColor: spotifyGreen }}
              onClick={handlePlayArtist}
            >
              <Play size={24} fill="black" color="black" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: spotifyTextSecondary }}
            >
              <Heart size={32} />
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: spotifyTextSecondary }}
            >
              <MoreHorizontal size={32} />
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex-1 px-8 pb-24">
          {/* Popular Tracks */}
          {topTracks.length > 0 && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: spotifyText }}
              >
                Popular
              </h2>
              <div className="space-y-2">
                {topTracks.slice(0, 5).map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <span
                      className="w-4 text-right group-hover:hidden"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {index + 1}
                    </span>
                    <Play
                      size={16}
                      className="hidden group-hover:block cursor-pointer"
                      style={{ color: spotifyText }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-medium truncate"
                        style={{ color: spotifyText }}
                      >
                        {track.name}
                      </div>
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {track.popularity && `${track.popularity}M`}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {formatDuration(track.duration_ms)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discography Section */}
          {albums.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: spotifyText }}
                >
                  Discography
                </h2>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {albums.slice(0, 10).map((album) => (
                  <div
                    key={album.id}
                    className="p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group flex-shrink-0 w-40"
                    style={{ backgroundColor: spotifyCard }}
                    onClick={() => onPlayAlbum && onPlayAlbum(album)}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-square rounded overflow-hidden">
                        {album.images?.[0] ? (
                          <Image
                            src={album.images[0].url}
                            alt={album.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                            style={{ width: 'auto', height: 'auto' }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: spotifyBg }}
                          >
                            <span
                              className="text-4xl"
                              style={{ color: spotifyTextSecondary }}
                            >
                              ♪
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        className="absolute bottom-2 right-2 w-12 h-12 cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl hover:brightness-110"
                        style={{ backgroundColor: spotifyGreen }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAlbum(album);
                        }}
                      >
                        <Play size={20} fill="#000000" color="#000000" />
                      </button>
                    </div>
                    <h3
                      className="font-bold text-base truncate mb-1"
                      style={{ color: spotifyText }}
                    >
                      {album.name}
                    </h3>
                    <p
                      className="text-sm truncate"
                      style={{ color: spotifyTextSecondary }}
                    >
                      {new Date(album.release_date).getFullYear()} •{' '}
                      {album.album_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Artists Section - Restricted */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: spotifyText }}>
                Related Artists
              </h2>
            </div>
            <div
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: spotifyCard }}
            >
              <p className="text-sm" style={{ color: spotifyTextSecondary }}>
                Due to Spotify API restrictions, related artists cannot be
                fetched.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistArea;
