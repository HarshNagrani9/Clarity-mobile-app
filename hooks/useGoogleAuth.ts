import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Google Auth hook — fully server-side OAuth flow.
 *
 * Flow:
 * 1. Opens browser → /api/auth/google/start (server redirects to Google)
 * 2. User signs in with Google
 * 3. Google redirects to /api/auth/google/callback with auth code
 * 4. Server exchanges code for tokens, creates Firebase user, generates custom token
 * 5. Server redirects to clarity://auth?token=CUSTOM_TOKEN
 * 6. App catches the URL → signs in with signInWithCustomToken
 */
export const useGoogleAuth = (onSuccess?: () => void, onError?: (error: string) => void) => {
    const [isLoading, setIsLoading] = useState(false);

    const signIn = useCallback(async () => {
        setIsLoading(true);

        try {
            const authUrl = `${API_BASE_URL}/api/auth/google/start?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}`;

            const redirectUri = AuthSession.makeRedirectUri({ scheme: 'clarity' });
            console.log('[GoogleAuth] Opening server-side auth flow with redirect:', redirectUri);

            const result = await WebBrowser.openAuthSessionAsync(
                authUrl,
                redirectUri
            );

            console.log('[GoogleAuth] Result:', result.type);

            if (result.type === 'success' && result.url) {
                console.log('[GoogleAuth] Redirect URL:', result.url);

                // Robust parsing — new URL() handles custom schemes correctly
                let token: string | null = null;
                let errorParam: string | null = null;
                try {
                    const parsed = new URL(result.url);
                    token = parsed.searchParams.get('token');
                    errorParam = parsed.searchParams.get('error');
                } catch {
                    // Fallback for environments where new URL() rejects custom schemes
                    const queryStart = result.url.indexOf('?');
                    if (queryStart !== -1) {
                        const params = new URLSearchParams(result.url.substring(queryStart + 1));
                        token = params.get('token');
                        errorParam = params.get('error');
                    }
                }

                console.log('[GoogleAuth] Error param:', errorParam);
                console.log('[GoogleAuth] Token present:', !!token, 'length:', token?.length);

                if (errorParam) throw new Error(decodeURIComponent(errorParam));

                if (token) {
                    // Decode in case the token was double-encoded somewhere in the redirect chain
                    const cleanToken = token.includes('%') ? decodeURIComponent(token) : token;
                    console.log('[GoogleAuth] Token prefix:', cleanToken.substring(0, 20));
                    await signInWithCustomToken(auth, cleanToken);
                    console.log('[GoogleAuth] Sign-in successful!');
                    if (onSuccess) onSuccess();
                    return;
                }
                throw new Error('No token received from server');
            } else if (result.type === 'cancel' || result.type === 'dismiss') {
                console.log('[GoogleAuth] User cancelled');
            }
        } catch (err: any) {
            console.error('[GoogleAuth] Error:', err);
            if (onError) onError(err.message || 'Google Sign-In failed');
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess, onError]);

    return { signIn, isLoading };
};
