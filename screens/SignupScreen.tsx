import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrutalistInput } from '../components/ui/BrutalistInput';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { RootStackParamList } from '../App';
import { AuthService } from '../services/auth';
import { Mail, Zap } from 'lucide-react-native';
import { GoogleAuthButton } from '../components/ui/GoogleAuthButton';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

type SignupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: { navigation: SignupScreenProp }) {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { signIn: googleSignIn, isLoading: isGoogleLoading } = useGoogleAuth(
        () => navigation.navigate('SignupSuccess'),
        (err) => setErrorMsg(err)
    );

    const handleSendOTP = async () => {
        if (!name || !email || !password || !mobile) {
            setErrorMsg('All fields are required.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        try {
            await AuthService.sendOTP(email, 'SIGNUP');
            setStep('OTP');
        } catch (e: any) {
            setErrorMsg(e.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setErrorMsg('Please enter the 6-digit code.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        try {
            await AuthService.verifySignupOTP(email, otp, password, name, mobile);
            navigation.navigate('SignupSuccess');
        } catch (e: any) {
            setErrorMsg(e.message || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
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

                <Text style={s.h1}>Create an{'\n'}Account</Text>
                <Text style={s.subtitle}>Enter your details below to begin.</Text>

                {errorMsg ? (
                    <View style={s.errorBox}>
                        <Text style={s.errorText}>{errorMsg}</Text>
                    </View>
                ) : null}

                {step === 'DETAILS' ? (
                    <View style={s.form}>
                        <BrutalistInput
                            label="Full Name"
                            placeholder="John Doe"
                            autoCapitalize="words"
                            value={name}
                            onChangeText={setName}
                        />
                        <BrutalistInput
                            label="Mobile Number"
                            placeholder="+1234567890"
                            keyboardType="phone-pad"
                            value={mobile}
                            onChangeText={setMobile}
                        />
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

                        <BrutalistButton
                            bgColor="#a3e635"
                            textColor="#000"
                            shadowColor="#fff"
                            style={s.btn}
                            onPress={handleSendOTP}
                        >
                            {isLoading ? <ActivityIndicator color="#000" /> : "Sign Up"}
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
                ) : (
                    <View style={s.form}>
                        <BrutalistInput
                            label="Verification Code"
                            placeholder="123456"
                            keyboardType="number-pad"
                            maxLength={6}
                            inputStyle={{ textAlign: 'center', letterSpacing: 16, fontSize: 32, fontWeight: '900', color: '#a3e635' }}
                            value={otp}
                            onChangeText={setOtp}
                        />
                        <BrutalistButton
                            bgColor="#ec4899"
                            textColor="#000"
                            shadowColor="#fff"
                            style={s.btn}
                            onPress={handleVerifyOTP}
                        >
                            {isLoading ? <ActivityIndicator color="#000" /> : "Verify & Create Account"}
                        </BrutalistButton>
                    </View>
                )}

                {/* Footer links */}
                <View style={s.footerLinks}>
                    <Text style={s.linkText}>Already have an account? </Text>
                    <Text style={s.linkHighlight} onPress={() => navigation.navigate('Login')}>
                        Sign In
                    </Text>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f' },
    scroll: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 60, justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center', marginBottom: 50 },
    iconBox: {
        width: 36, height: 36, backgroundColor: '#a3e635', borderWidth: 2, borderColor: '#000',
        borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', fontStyle: 'italic', letterSpacing: -1, fontFamily: 'monospace' },
    h1: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 36, marginBottom: 8, textAlign: 'center' },
    subtitle: { color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 32 },
    form: { width: '100%' },
    btn: { width: '100%', marginTop: 12 },
    errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16 },
    errorText: { color: '#ef4444', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
    footerLinks: { flexDirection: 'row', justifyContent: 'center', marginTop: 48 },
    linkText: { color: '#9ca3af', fontSize: 13 },
    linkHighlight: { color: '#a3e635', fontSize: 13, textDecorationLine: 'underline', fontWeight: 'bold' },

    orContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, paddingHorizontal: 16 },
    line: { flex: 1, height: 1, backgroundColor: '#333' },
    orText: { color: '#9ca3af', marginHorizontal: 16, fontSize: 12, fontWeight: 'bold' },
});
