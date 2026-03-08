// mobileapp/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
// Use react-native specific auth and persistence wrapper
// @ts-ignore - TS doesn't resolve this export correctly with standard moduleResolution but Metro bundler does
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In React Native, environment variables need to be accessed securely.
// Using inline process.env for Expo if they are prefixed with EXPO_PUBLIC_.
// Since we are using standard NEXT_PUBLIC_ in the Next.js app, we can use the same here if
// Babel or valid Metro configuration properly injects them.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// In React Native, it's best to explicitly set persistence using AsyncStorage
// so login sessions survive app restarts. Guard against double-init on hot reload.
let auth: ReturnType<typeof getAuth>;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (e: any) {
    // Auth already initialized (e.g. hot reload in dev)
    auth = getAuth(app);
}
export { auth };
