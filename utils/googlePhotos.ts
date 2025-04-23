import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Replace this with your actual Google Client ID from the Google Cloud Console
const CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/photoslibrary.sharing'
];

WebBrowser.maybeCompleteAuthSession();

// For web platform, we need to specify the correct redirect URI
const redirectUri = makeRedirectUri({
  scheme: 'media-vault',
  path: 'auth',
  preferLocalhost: true, // Enable localhost for web development
});

export const googleConfig = {
  clientId: CLIENT_ID,
  scopes: SCOPES,
  redirectUri,
};

export async function fetchGooglePhotos(accessToken: string) {
  try {
    const response = await fetch(
      'https://photoslibrary.googleapis.com/v1/mediaItems',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.mediaItems || [];
  } catch (error) {
    console.error('Error fetching Google Photos:', error);
    return [];
  }
}