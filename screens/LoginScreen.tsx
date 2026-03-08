import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrutalistInput } from '../components/ui/BrutalistInput';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { RootStackParamList } from '../App';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from '../services/auth';
import { Zap, X } from 'lucide-react-native';
import { GoogleAuthButton } from '../components/ui/GoogleAuthButton';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: { navigation: LoginScreenProp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { signIn: googleSignIn, isLoading: isGoogleLoading } = useGoogleAuth(
        () => navigation.navigate('LoginSuccess'),
        (err) => setErrorMsg(err)
    );

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetStep, setResetStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [resetEmail, setResetEmail] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [isResetLoading, setIsResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('LoginSuccess');
            // In a real app we'd redirect to a protected Tab/Drawer navigator
            alert('Logged in successfully!');
        } catch (e: any) {
            setErrorMsg(e.message || 'Failed to login.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendResetOTP = async () => {
        if (!resetEmail) {
            setResetError('Email is required.');
            return;
        }

        setIsResetLoading(true);
        setResetError('');
        try {
            await AuthService.sendOTP(resetEmail, 'RESET_PASSWORD');
            setResetStep('OTP');
        } catch (e: any) {
            setResetError(e.message || 'Failed to send reset code.');
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleVerifyResetOTP = async () => {
        if (!resetOtp || !resetNewPassword) {
            setResetError('All fields are required.');
            return;
        }

        setIsResetLoading(true);
        setResetError('');
        try {
            await AuthService.resetPassword(resetEmail, resetOtp, resetNewPassword);
            alert('Password reset successfully! You can now login.');
            closeForgotModal();
        } catch (e: any) {
            setResetError(e.message || 'Invalid OTP.');
        } finally {
            setIsResetLoading(false);
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setResetStep('EMAIL');
        setResetEmail('');
        setResetOtp('');
        setResetNewPassword('');
        setResetError('');
    };

    return (
        <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.scroll}>

                {/* Header / Logo */}
                <View style={s.header}>
                    <View style={s.iconBox}>
                        <Zap size={20} color="#000" />
                    </View>
                    <Text style={s.headerTitle}>CLARITY</Text>
                </View>

                <Text style={s.h1}>Welcome{'\n'}Back</Text>
                <Text style={s.subtitle}>Enter your credentials to continue.</Text>

                {errorMsg ? (
                    <View style={s.errorBox}>
                        <Text style={s.errorText}>{errorMsg}</Text>
                    </View>
                ) : null}

                <View style={s.form}>
                    <BrutalistInput
                        label="Email"
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <BrutalistInput
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={{ alignItems: 'flex-end', marginBottom: 24, marginTop: -4 }}>
                        <Text style={s.forgotText} onPress={() => setShowForgotModal(true)}>
                            Forgot Password?
                        </Text>
                    </View>

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        shadowColor="#fff"
                        style={s.btn}
                        onPress={handleLogin}
                    >
                        {isLoading ? <ActivityIndicator color="#000" /> : "Sign In"}
                    </BrutalistButton>

                    <View style={s.orContainer}>
                        <View style={s.line} />
                        <Text style={s.orText}>OR</Text>
                        <View style={s.line} />
                    </View>

                    <GoogleAuthButton
                        isLoading={isGoogleLoading}
                        onPress={googleSignIn}
                    />
                </View>

                {/* Footer links */}
                <View style={s.footerLinks}>
                    <Text style={s.linkText}>Don't have an account? </Text>
                    <Text style={s.linkHighlight} onPress={() => navigation.navigate('Signup')}>
                        Sign Up
                    </Text>
                </View>

            </ScrollView>

            {/* ─── FORGOT PASSWORD MODAL ─── */}
            <Modal visible={showForgotModal} animationType="slide" transparent={true}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalContainer}>
                    <View style={s.modalContent}>

                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>{resetStep === 'EMAIL' ? 'Reset Password' : 'Set New Password'}</Text>
                            <Text onPress={closeForgotModal}><X size={24} color="#fff" /></Text>
                        </View>

                        {resetError ? (
                            <View style={s.errorBox}>
                                <Text style={s.errorText}>{resetError}</Text>
                            </View>
                        ) : null}

                        {resetStep === 'EMAIL' ? (
                            <>
                                <Text style={s.modalSubtitle}>Enter your email to receive a reset code.</Text>
                                <BrutalistInput
                                    label="Email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    value={resetEmail}
                                    onChangeText={setResetEmail}
                                />
                                <BrutalistButton bgColor="#22d3ee" textColor="#000" style={s.btn} onPress={handleSendResetOTP}>
                                    {isResetLoading ? <ActivityIndicator color="#000" /> : "Send Code"}
                                </BrutalistButton>
                            </>
                        ) : (
                            <>
                                <Text style={s.modalSubtitle}>Enter the 6-digit code and your new password.</Text>
                                <BrutalistInput
                                    label="Verification Code"
                                    placeholder="123456"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    inputStyle={{ textAlign: 'center', letterSpacing: 16, fontSize: 32, fontWeight: '900', color: '#a3e635' }}
                                    value={resetOtp}
                                    onChangeText={setResetOtp}
                                />
                                <BrutalistInput
                                    label="New Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={resetNewPassword}
                                    onChangeText={setResetNewPassword}
                                />
                                <BrutalistButton bgColor="#ec4899" textColor="#000" style={s.btn} onPress={handleVerifyResetOTP}>
                                    {isResetLoading ? <ActivityIndicator color="#000" /> : "Update Password"}
                                </BrutalistButton>
                            </>
                        )}

                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f' },
    scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },

    header: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center', marginBottom: 40 },
    iconBox: {
        width: 36, height: 36, backgroundColor: '#a3e635', borderWidth: 2, borderColor: '#000',
        borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', fontStyle: 'italic', letterSpacing: -1, fontFamily: 'monospace' },
    h1: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 36, marginBottom: 8, textAlign: 'center' },
    subtitle: { color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 32 },

    form: { width: '100%' },
    btn: { width: '100%', marginTop: 12 },

    forgotText: { color: '#a3e635', fontSize: 11, fontFamily: 'monospace', textDecorationLine: 'underline' },

    errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16 },
    errorText: { color: '#ef4444', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },

    footerLinks: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
    linkText: { color: '#9ca3af', fontSize: 13 },
    linkHighlight: { color: '#a3e635', fontSize: 13, textDecorationLine: 'underline', fontWeight: 'bold' },

    orContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, paddingHorizontal: 16 },
    line: { flex: 1, height: 1, backgroundColor: '#333' },
    orText: { color: '#9ca3af', marginHorizontal: 16, fontSize: 12, fontWeight: 'bold' },

    // Modal Styles
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
    modalContent: {
        backgroundColor: '#151515',
        borderTopWidth: 2, borderColor: '#fff',
        padding: 24, paddingBottom: 40,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
    modalSubtitle: { color: '#9ca3af', fontSize: 13, marginBottom: 24 },
});
