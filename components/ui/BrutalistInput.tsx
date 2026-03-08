import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface BrutalistInputProps extends TextInputProps {
    label: string;
    error?: string;
    inputStyle?: object;
}

export const BrutalistInput = ({ label, error, inputStyle, ...props }: BrutalistInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={s.container}>
            <Text style={s.label}>{label}</Text>
            <TextInput
                style={[
                    s.input,
                    isFocused && s.inputFocused,
                    error ? s.inputError : null,
                    inputStyle,
                ]}
                placeholderTextColor="rgba(255,255,255,0.4)"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error ? <Text style={s.errorText}>{error}</Text> : null}
        </View>
    );
};

const s = StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '800',
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 8,
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    inputFocused: {
        borderColor: 'rgba(163,230,53,0.5)',
        backgroundColor: '#222',
        // Glow effect not directly possible on Android, using shadow for iOS
        shadowColor: '#a3e635',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
});
