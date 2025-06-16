interface AudioTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images?: { url: string }[];
  };
  preview_url?: string;
  duration_ms: number;
  uri: string;
}

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
}

interface PlaylistTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: { name: string }[];
  album: {
    name: string;
    images?: { url: string }[];
    uri?: string;
    id?: string;
  };
  added_at?: string;
  preview_url?: string;
  uri?: string;
  is_local?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  images?: { url: string }[];
  owner?: { display_name: string };
  tracks?: { total: number };
  followers?: { total: number };
  public?: boolean;
  uri?: string;
}

class SpotifyPlayService {
  private getSpotifyManager() {
    try {
      // Use dynamic import to avoid circular dependencies
      const { getSpotifyManager } = eval('require("./current-song-helper")');
      return getSpotifyManager();
    } catch (error) {
      console.error('Failed to get Spotify manager:', error);
      throw new Error('Spotify manager not available');
    }
  }

  private createAudioTrack(
    track: Track | PlaylistTrack,
    includeAlbum = false
  ): AudioTrack {
    const audioTrack: AudioTrack = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album:
        includeAlbum && 'album' in track
          ? track.album
          : { name: 'Unknown', images: [] },
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      uri: `spotify:track:${track.id}`,
    };
    return audioTrack;
  }

  async playArtistTrack(track: Track): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      const audioTrack = this.createAudioTrack(track);
      await spotifyManager.playTrack(audioTrack);
    } catch (error) {
      console.error('Failed to play artist track:', error);
      alert(
        `Failed to play "${track.name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }

  async playAlbum(album: Album): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      const albumContext = `spotify:album:${album.id}`;
      await spotifyManager.playContext(albumContext);
    } catch (error) {
      console.error('Failed to play album:', error);
      alert(
        `Failed to play "${album.name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }

  async playPlaylistTrack(
    track: PlaylistTrack,
    playlist: Playlist
  ): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      const audioTrack = this.createAudioTrack(track, true);
      const playlistContext = `spotify:playlist:${playlist.id}`;
      await spotifyManager.playTrack(audioTrack, playlistContext);
    } catch (error) {
      console.error('Failed to play playlist track:', error);
      alert(
        `Failed to play "${track.name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }

  async playPlaylist(playlist: Playlist): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      const playlistContext = `spotify:playlist:${playlist.id}`;
      await spotifyManager.playContext(playlistContext);
    } catch (error) {
      console.error('Failed to play playlist:', error);
      alert(
        `Failed to play "${playlist.name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }

  async playArtist(artist: Artist): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      const artistContext = `spotify:artist:${artist.id}`;
      await spotifyManager.playContext(artistContext);
    } catch (error) {
      console.error('Failed to play artist:', error);
      alert(
        `Failed to play "${artist.name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }

  async playContext(contextUri: string, contextName?: string): Promise<void> {
    try {
      const spotifyManager = this.getSpotifyManager();
      await spotifyManager.playContext(contextUri);
    } catch (error) {
      console.error('Failed to play context:', error);
      const name = contextName || 'content';
      alert(
        `Failed to play "${name}". Make sure you have Spotify Premium and the app is active.`
      );
      throw error;
    }
  }
}

// Export singleton instance
export const spotifyPlayService = new SpotifyPlayService();

// Export types for use in components
export type { AudioTrack, Artist, Album, Track, PlaylistTrack, Playlist };
