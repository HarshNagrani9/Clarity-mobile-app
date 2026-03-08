// mobileapp/services/auth.ts
import { auth } from '../lib/firebase';
import { signInWithCustomToken, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const AuthService = {

    /**
     * Step 1: Send OTP for Signup or Password Reset
     */
    sendOTP: async (email: string, type: 'SIGNUP' | 'RESET_PASSWORD' = 'SIGNUP') => {
        const res = await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
        return data;
    },

    /**
     * Step 2: Verify OTP for Signup and get Custom Token
     */
    verifySignupOTP: async (
        email: string,
        otp: string,
        password?: string,
        name?: string,
        mobile?: string
    ) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/otp/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password, name, mobile }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');

        // Step 3: Use the returned token to sign in to Firebase
        await signInWithCustomToken(auth, data.token);
        return data;
    },

    /**
     * Step 2 (Reset): Verify OTP and set New Password
     */
    resetPassword: async (email: string, otp: string, newPassword: string) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/otp/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to reset password');
        return data;
    }
};
