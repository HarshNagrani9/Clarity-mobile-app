import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { CheckCircle } from 'lucide-react-native';

type SignupSuccessScreenProp = NativeStackNavigationProp<RootStackParamList, 'SignupSuccess'>;

export default function SignupSuccessScreen({ navigation }: { navigation: SignupSuccessScreenProp }) {
    return (
        <View style={s.container}>
            <View style={s.iconWrapper}>
                <CheckCircle size={64} color="#a3e635" strokeWidth={1.5} />
            </View>

            <Text style={s.h1}>Account{'\n'}Created!</Text>

            <View style={s.messageBox}>
                <Text style={s.messageText}>
                    Your account has been successfully verified and securely created.
                </Text>
            </View>

            <BrutalistButton
                bgColor="#a3e635"
                textColor="#000"
                style={s.btn}
                onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
            >
                Enter Clarity
            </BrutalistButton>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    iconWrapper: {
        marginBottom: 32,
        backgroundColor: 'rgba(163,230,53,0.1)',
        padding: 24,
        borderRadius: 64,
    },
    h1: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 48,
        marginBottom: 24,
        letterSpacing: -2,
    },
    messageBox: {
        borderLeftWidth: 4,
        borderLeftColor: '#a3e635',
        paddingLeft: 16,
        marginBottom: 48,
    },
    messageText: {
        color: '#9ca3af',
        fontSize: 16,
        fontFamily: 'monospace',
        lineHeight: 24,
    },
    btn: { width: '100%' }
});
