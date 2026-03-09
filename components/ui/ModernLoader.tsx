import React from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';

export const ModernLoader = () => {
    const spinValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={s.container}>
            <View style={s.loaderContainer}>
                <Animated.View style={[s.ring, { transform: [{ rotate: spin }] }]} />
                <View style={s.center}>
                    <Text style={s.logoText}>C</Text>
                </View>
            </View>
            <Text style={s.loadingText}>INITIALIZING...</Text>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    ring: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#a3e635',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        position: 'absolute',
    },
    center: {
        width: 40,
        height: 40,
        backgroundColor: '#a3e635',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }],
    },
    logoText: {
        color: '#000',
        fontSize: 24,
        fontWeight: '900',
        transform: [{ rotate: '-45deg' }],
    },
    loadingText: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: 4,
    },
});
