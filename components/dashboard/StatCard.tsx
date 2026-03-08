import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrutalistCard } from '../ui/BrutalistCard';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
    return (
        <View style={s.container}>
            <BrutalistCard style={s.card}>
                <View style={s.header}>
                    <Text style={s.title}>{title}</Text>
                    {icon}
                </View>
                <View style={s.content}>
                    <Text style={s.value}>{value}</Text>
                    <Text style={s.subtitle}>{subtitle}</Text>
                </View>
            </BrutalistCard>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        width: '48%', // Allows 2 cards per row with gap
        marginBottom: 16,
    },
    card: {},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    content: {
        marginTop: 4,
    },
    value: {
        color: '#a3e635',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
    },
    subtitle: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'monospace',
    }
});
