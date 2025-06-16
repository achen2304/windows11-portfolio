# Spotify Integration Setup

## Overview

This portfolio includes a Spotify app that displays your profile, playlists, top artists, and currently playing song. The app uses the Spotify Web API with automatic token refresh.

## Prerequisites

1. A Spotify account
2. A registered Spotify app on the Spotify Developer Dashboard

## Setup Instructions

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Click "Create an App"
3. Fill in the app name and description
4. Accept the terms and create the app

### Step 2: Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Show Client Secret" and copy this value

### Step 3: Set Up Redirect URI

You have a few options for redirect URIs:

**Option A: Using example.com (Recommended)**

1. Click "Edit Settings" in your app dashboard
2. Add this redirect URI: `https://example.com/callback`
3. Save the settings

**Option B: Using httpbin.org (Alternative)**

1. Click "Edit Settings" in your app dashboard
2. Add this redirect URI: `https://httpbin.org/anything`
3. Save the settings

**Option C: Using localhost (For development)**

1. Click "Edit Settings" in your app dashboard
2. Add this redirect URI: `http://localhost:3000/callback`
3. Save the settings

**Important**: Make sure the redirect URI in your Spotify app settings **exactly matches** the one you use in the authorization URL.

### Step 4: Get Your Refresh Token

Here's the easiest way to get your refresh token:

1. Replace `YOUR_CLIENT_ID` in the URL that matches your redirect URI choice:

**For example.com:**

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20streaming%20user-modify-playback-state
```

**For httpbin.org:**

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fhttpbin.org%2Fanything&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20streaming%20user-modify-playback-state
```

**For localhost:**

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20streaming%20user-modify-playback-state
```

2. Visit the URL in your browser and authorize the app

3. **Copy the authorization code from the redirect:**

   - **example.com**: Page will fail to load, copy code from URL bar: `https://example.com/callback?code=SOME_CODE&state=...`
   - **httpbin.org**: Will show JSON response, copy the code from the `args.code` field
   - **localhost**: Page will fail to load, copy code from URL bar: `http://localhost:3000/callback?code=SOME_CODE&state=...`

4. Exchange the code for a refresh token using curl or Postman:

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=https://example.com/callback"
```

5. From the response, copy the `refresh_token` value.

### Step 5: Set Environment Variables

Create a `.env.local` file in your project root with:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### Step 6: Restart Your Development Server

```bash
npm run dev
```

## Features

- **Profile Display**: Shows your Spotify profile information
- **Currently Playing**: Shows the song you're currently playing (if any)
- **Top Artists**: Displays your top artists based on listening history
- **Top Tracks**: Shows your most played tracks
- **Playlists**: Shows your created and followed playlists
- **Artist Pages**: Browse artist discography and top tracks
- **Album Navigation**: Navigate through artist albums and play tracks

## API Endpoints

The app uses the following Spotify Web API endpoints:

- `/me` - User profile
- `/me/playlists` - User playlists
- `/me/top/artists` - Top artists
- `/me/top/tracks` - Top tracks
- `/me/player/currently-playing` - Currently playing track
- `/artists/{id}/albums` - Artist albums
- `/artists/{id}/top-tracks` - Artist top tracks
- `/albums/{id}/tracks` - Album tracks
- `/playlists/{id}/tracks` - Playlist tracks

**Note**: Some endpoints like Related Artists, Recommendations, and Audio Features are restricted for Development Mode apps as of November 2024.

## Troubleshooting

- **No data showing**: Check that your environment variables are set correctly
- **Authorization errors**: Ensure your refresh token is valid and has the correct scopes
- **API rate limits**: The app handles rate limiting gracefully

### Web Playback SDK Errors

If you're getting errors like:

- `403 Forbidden` on Spotify API endpoints
- `Invalid token scopes`
- `This functionality is restricted to premium users only`

**Solution**: You need to re-authorize with the updated scopes:

1. **Use the updated authorization URL** (with `streaming` and `user-modify-playback-state` scopes):

   Make sure your redirect URI in the URL matches what's in your Spotify app settings!

   **For example.com:**

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20streaming%20user-modify-playback-state
   ```

   **For httpbin.org:**

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fhttpbin.org%2Fanything&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20streaming%20user-modify-playback-state
   ```

2. **Get a new authorization code** by following the authorization flow again
3. **Exchange for a new refresh token** using the curl command above
4. **Update your `.env.local`** file with the new refresh token
5. **Restart your development server**

**Note**: Spotify Web Playback SDK requires a Premium account. Free accounts will get restricted functionality errors.

## Required Scopes

The app requires these Spotify scopes:

- `user-read-private` - Access to user profile
- `user-read-email` - Access to user email
- `user-read-playback-state` - Read current playback state
- `user-read-currently-playing` - Read currently playing track
- `user-top-read` - Read top artists and tracks
- `playlist-read-private` - Read private playlists
- `playlist-read-collaborative` - Read collaborative playlists
- `streaming` - **Required for Web Playback SDK** - Control playback
- `user-modify-playback-state` - **Required for Web Playback SDK** - Modify playback state

**Important**: If you're getting authentication errors, you need to re-authorize with the updated scopes that include `streaming` and `user-modify-playback-state`.
