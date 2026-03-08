import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useApp } from '../lib/store';
import { format, formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react-native';

export default function ActivityLogScreen({ navigation }: { navigation: any }) {
    const { recentActivities } = useApp();

    return (
        <SafeAreaView style={s.safeArea}>
            <View style={s.header}>
                <Pressable onPress={() => navigation.goBack()} style={s.backButton}>
                    <ArrowLeft color="#fff" size={24} />
                </Pressable>
                <Text style={s.headerTitle}>Activity Log</Text>
            </View>
            <ScrollView contentContainerStyle={s.content}>
                {recentActivities.length > 0 ? recentActivities.map((activity) => (
                    <View key={activity.id} style={s.activityRow}>
                        <View style={s.dot} />
                        <View style={s.activityContent}>
                            <Text style={s.activityText}>{activity.description}</Text>
                            <Text style={s.timeText}>
                                {activity.createdAt
                                    ? format(new Date(activity.createdAt), 'MMM d, yyyy · h:mm a')
                                    : 'Just now'}
                            </Text>
                        </View>
                    </View>
                )) : (
                    <View style={s.emptyState}>
                        <Text style={s.emptyText}>No activity recorded yet.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        backgroundColor: '#151515',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    content: {
        padding: 24,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#1E1E1E',
        paddingBottom: 20,
        marginBottom: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#a3e635',
        marginTop: 5,
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 6,
    },
    timeText: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
        fontFamily: 'monospace',
    }
});
