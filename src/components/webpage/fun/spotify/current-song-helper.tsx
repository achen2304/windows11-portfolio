'use client';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

interface SpotifyPlayer {
  addListener: (event: string, callback: (...args: any[]) => void) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

interface SpotifyPlayerState {
  context: {
    uri: string;
    metadata: any;
  };
  disallows: {
    pausing: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    previous_tracks: SpotifyTrack[];
    next_tracks: SpotifyTrack[];
  };
}

interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  artists: { name: string; uri: string }[];
  album: {
    name: string;
    uri: string;
    images: { url: string }[];
  };
}

export interface AudioTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images?: { url: string }[];
  };
  preview_url?: string | null;
  duration_ms: number;
  uri?: string;
}

export class SpotifySDKManager {
  private player: SpotifyPlayer | null = null;
  private deviceId: string | null = null;
  private volume: number = 0.7;
  private isPlaying: boolean = false;
  private currentTrack: AudioTrack | null = null;
  private currentContext: string | null = null; // Store playlist/album URI for next/prev
  private isPremium: boolean = false;
  private isInitialized: boolean = false;
  private accessToken: string | null = null;
  private progressTimer: NodeJS.Timeout | null = null;

  private progressCallbacks: ((progress: number) => void)[] = [];
  private statusCallbacks: ((isPlaying: boolean) => void)[] = [];
  private trackCallbacks: ((track: AudioTrack | null) => void)[] = [];
  private premiumCallbacks: ((isPremium: boolean) => void)[] = [];
  private readyCallbacks: ((isReady: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('spotify-volume');
      if (savedVolume) {
        this.volume = parseFloat(savedVolume);
      }
      this.initializeSDK();
    }
  }

  private async initializeSDK() {
    try {
      // Check if user has premium account
      await this.checkPremiumStatus();

      if (!this.isPremium) {
        this.notifyPremiumCallbacks(false);
        // Set ready to true so the component shows the premium warning instead of loading
        this.notifyReadyCallbacks(true);
        return;
      }

      // Get access token
      await this.getAccessToken();

      if (!this.accessToken) {
        console.error('Failed to get access token');
        return;
      }

      // Load Spotify SDK
      if (!window.Spotify) {
        await this.loadSpotifySDK();
      }

      // Initialize player
      this.initializePlayer();
    } catch (error) {
      console.error('Failed to initialize Spotify SDK:', error);
    }
  }

  private async checkPremiumStatus() {
    try {
      const response = await fetch('/api/spotify?type=profile');
      const profile = await response.json();
      this.isPremium = profile.product === 'premium';
      this.notifyPremiumCallbacks(this.isPremium);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      this.isPremium = false;
      this.notifyPremiumCallbacks(false);
    }
  }

  private async getAccessToken() {
    try {
      const response = await fetch('/api/spotify/token');
      const data = await response.json();
      this.accessToken = data.access_token;
    } catch (error) {
      console.error('Failed to get access token:', error);
    }
  }

  async refreshAccessToken() {
    await this.getAccessToken();
  }

  async debugPlayerState() {
    if (!this.accessToken) {
      return;
    }

    try {
      // Check available devices
      const devicesResponse = await fetch(
        'https://api.spotify.com/v1/me/player/devices',
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();

        const webPlayerDevice = devicesData.devices.find(
          (d: any) => d.id === this.deviceId
        );
        if (webPlayerDevice) {
        } else {
          console.warn('Web player device not found in available devices list');
        }
      } else {
        console.error('Failed to get devices:', devicesResponse.status);
      }

      // Check current playback state
      const playerResponse = await fetch(
        'https://api.spotify.com/v1/me/player',
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (playerResponse.ok) {
        const playerData = await playerResponse.json();
      } else if (playerResponse.status === 204) {
      } else {
        console.error('Failed to get playback state:', playerResponse.status);
      }
    } catch (error) {
      console.error('Error debugging player state:', error);
    }
  }

  private loadSpotifySDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Spotify) {
        resolve();
        return;
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve();
      };

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    });
  }

  private initializePlayer() {
    if (!window.Spotify || !this.accessToken) return;

    this.player = new window.Spotify.Player({
      name: 'Windows 11 Portfolio Player',
      getOAuthToken: (cb) => {
        if (this.accessToken) {
          cb(this.accessToken);
        }
      },
      volume: this.volume,
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }) => {
      console.error('Spotify initialization error:', message);
    });

    this.player.addListener('authentication_error', ({ message }) => {
      console.error('Spotify authentication error:', message);
      // Try to refresh the access token
      this.refreshAccessToken().then(() => {
        this.reconnectPlayer();
      });
    });

    this.player.addListener('account_error', ({ message }) => {
      console.error('Spotify account error:', message);
    });

    this.player.addListener('playback_error', ({ message }) => {
      console.error('Spotify playback error:', message);
    });

    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      this.isInitialized = true;
      this.notifyReadyCallbacks(true);

      // Automatically transfer playback to this device when ready
      setTimeout(() => this.transferPlaybackToDevice(), 1000);
    });

    // Not ready
    this.player.addListener('not_ready', ({ device_id }) => {
      this.isInitialized = false;
      this.notifyReadyCallbacks(false);
    });

    // Player state changed
    this.player.addListener('player_state_changed', (state) => {
      if (!state) return;

      this.isPlaying = !state.paused;
      this.notifyStatusCallbacks(this.isPlaying);

      if (state.track_window.current_track) {
        const track: AudioTrack = {
          id: state.track_window.current_track.id,
          name: state.track_window.current_track.name,
          artists: state.track_window.current_track.artists,
          album: state.track_window.current_track.album,
          preview_url: null,
          duration_ms: state.track_window.current_track.duration_ms,
          uri: state.track_window.current_track.uri,
        };

        this.currentTrack = track;
        this.notifyTrackCallbacks(track);
      }

      // Update progress
      if (state.track_window.current_track) {
        const progress =
          state.position / state.track_window.current_track.duration_ms;
        this.notifyProgressCallbacks(progress);
      }

      // Start or stop continuous progress tracking
      if (this.isPlaying) {
        this.startProgressTimer();
      } else {
        this.stopProgressTimer();
      }
    });

    // Connect to the player
    this.player.connect();
  }

  async playTrack(track: AudioTrack, context?: string) {
    if (!this.isPremium) {
      console.warn('Spotify Premium required for playback');
      return;
    }

    if (!this.isInitialized || !this.deviceId || !this.accessToken) {
      console.warn('Spotify player not ready');
      return;
    }

    try {
      // First, transfer playback to this device
      await this.transferPlaybackToDevice();

      // Store context for next/previous functionality
      this.currentContext = context || null;

      // Build the play request body
      const playBody: any = {};

      if (context) {
        // If we have context (playlist/album), use it
        playBody.context_uri = context;
        playBody.offset = {
          uri: track.uri || `spotify:track:${track.id}`,
        };
      } else {
        // If no context, just play the track
        playBody.uris = [track.uri || `spotify:track:${track.id}`];
      }

      // Then play the track
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Play track error response:', errorText);

        if (response.status === 404) {
          console.warn('Device not found, attempting to re-register...');
          // Try to reconnect the player
          await this.reconnectPlayer();
          return;
        }

        throw new Error(
          `Failed to play track: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }

  private async transferPlaybackToDevice() {
    if (!this.deviceId || !this.accessToken) return;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [this.deviceId],
          play: false, // Don't start playing immediately
        }),
      });

      if (!response.ok && response.status !== 204) {
        console.warn('Failed to transfer playback to device:', response.status);
      }
    } catch (error) {
      console.warn('Error transferring playback:', error);
    }
  }

  private async reconnectPlayer() {
    if (!this.player) return;

    try {
      this.player.disconnect();
      const connected = await this.player.connect();
      if (connected) {
      } else {
        console.error('Failed to reconnect Spotify player');
      }
    } catch (error) {
      console.error('Error reconnecting player:', error);
    }
  }

  private startProgressTimer() {
    this.stopProgressTimer(); // Clear any existing timer

    this.progressTimer = setInterval(async () => {
      if (this.isPlaying && this.player && this.currentTrack) {
        try {
          const state = await this.player.getCurrentState();
          if (state && state.track_window.current_track) {
            const progress =
              state.position / state.track_window.current_track.duration_ms;
            this.notifyProgressCallbacks(progress);
          }
        } catch (error) {
          console.error('Error getting progress:', error);
        }
      }
    }, 1000); // Update every second
  }

  private stopProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  async togglePlayPause() {
    if (!this.isPremium || !this.player) return;

    try {
      await this.player.togglePlay();
    } catch (error) {
      console.error('Failed to toggle play/pause:', error);
    }
  }

  async nextTrack() {
    if (!this.isPremium || !this.player) return;

    try {
      await this.player.nextTrack();
    } catch (error) {
      console.error('Failed to skip to next track:', error);
    }
  }

  async previousTrack() {
    if (!this.isPremium || !this.player) return;

    try {
      await this.player.previousTrack();
    } catch (error) {
      console.error('Failed to skip to previous track:', error);
    }
  }

  async toggleShuffle() {
    if (!this.isPremium || !this.accessToken || !this.deviceId || !this.player)
      return;

    try {
      // Get current state to toggle shuffle
      const state = await this.player?.getCurrentState();
      const newShuffleState = state ? !state.shuffle : false;

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}&device_id=${this.deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to toggle shuffle: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to toggle shuffle:', error);
    }
  }

  async toggleRepeat() {
    if (!this.isPremium || !this.accessToken || !this.deviceId || !this.player)
      return;

    try {
      // Get current state to cycle through repeat modes
      const state = await this.player?.getCurrentState();
      let newRepeatState = 'off';

      if (state) {
        if (state.repeat_mode === 0) {
          // off
          newRepeatState = 'context'; // repeat all
        } else if (state.repeat_mode === 1) {
          // context
          newRepeatState = 'track'; // repeat one
        } else {
          // track
          newRepeatState = 'off'; // off
        }
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatState}&device_id=${this.deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to toggle repeat: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to toggle repeat:', error);
    }
  }

  async setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));

    if (this.player) {
      try {
        await this.player.setVolume(this.volume);
      } catch (error) {
        console.error('Failed to set volume:', error);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('spotify-volume', this.volume.toString());
    }
  }

  getVolume(): number {
    return this.volume;
  }

  async getCurrentPosition(): Promise<number> {
    if (!this.player) return 0;

    try {
      const state = await this.player.getCurrentState();
      return state ? state.position : 0;
    } catch (error) {
      console.error('Failed to get current position:', error);
      return 0;
    }
  }

  getDuration(): number {
    return this.currentTrack ? this.currentTrack.duration_ms : 0;
  }

  async seekTo(position: number) {
    if (!this.player) return;

    try {
      await this.player.seek(position * 1000); // Convert to milliseconds
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }

  onProgressUpdate(callback: (progress: number) => void) {
    this.progressCallbacks.push(callback);
    return () => {
      this.progressCallbacks = this.progressCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  onStatusUpdate(callback: (isPlaying: boolean) => void) {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  onTrackUpdate(callback: (track: AudioTrack | null) => void) {
    this.trackCallbacks.push(callback);
    return () => {
      this.trackCallbacks = this.trackCallbacks.filter((cb) => cb !== callback);
    };
  }

  onPremiumUpdate(callback: (isPremium: boolean) => void) {
    this.premiumCallbacks.push(callback);
    return () => {
      this.premiumCallbacks = this.premiumCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  onReadyUpdate(callback: (isReady: boolean) => void) {
    this.readyCallbacks.push(callback);
    return () => {
      this.readyCallbacks = this.readyCallbacks.filter((cb) => cb !== callback);
    };
  }

  private notifyProgressCallbacks(progress: number) {
    this.progressCallbacks.forEach((callback) => callback(progress));
  }

  private notifyStatusCallbacks(isPlaying: boolean) {
    this.statusCallbacks.forEach((callback) => callback(isPlaying));
  }

  private notifyTrackCallbacks(track: AudioTrack | null) {
    this.trackCallbacks.forEach((callback) => callback(track));
  }

  private notifyPremiumCallbacks(isPremium: boolean) {
    this.premiumCallbacks.forEach((callback) => callback(isPremium));
  }

  private notifyReadyCallbacks(isReady: boolean) {
    this.readyCallbacks.forEach((callback) => callback(isReady));
  }

  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  isPremiumAccount(): boolean {
    return this.isPremium;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  destroy() {
    this.stopProgressTimer();
    if (this.player) {
      this.player.disconnect();
    }
    this.progressCallbacks = [];
    this.statusCallbacks = [];
    this.trackCallbacks = [];
    this.premiumCallbacks = [];
    this.readyCallbacks = [];
  }
}

// Singleton instance
let spotifyManagerInstance: SpotifySDKManager | null = null;

export const getSpotifyManager = (): SpotifySDKManager => {
  if (!spotifyManagerInstance) {
    spotifyManagerInstance = new SpotifySDKManager();
  }
  return spotifyManagerInstance;
};

// Keep for backwards compatibility
export const getAudioManager = getSpotifyManager;

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
