import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Activity } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { BrutalistCard } from '../ui/BrutalistCard';
import { useNavigation } from '@react-navigation/native';

interface ActivityItem {
    id: number;
    type: string;
    description: string;
    createdAt: string;
}

interface ActivityFeedProps {
    activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const navigation = useNavigation<any>();
    const displayedActivities = activities.slice(0, 5);

    return (
        <BrutalistCard style={s.card}>
            <View style={s.header}>
                <View style={s.titleRow}>
                    <Text style={s.title}>Recent Activity</Text>
                    <Activity size={18} color="#666" />
                </View>
            </View>
            <Text style={s.subtitle}>
                What you've done recently
            </Text>

            <View style={s.feedContainer}>
                {displayedActivities.length > 0 ? (
                    displayedActivities.map((activity, index) => (
                        <View key={activity.id} style={[s.activityRow, index === displayedActivities.length - 1 && s.lastRow]}>
                            <View style={s.dot} />
                            <View style={s.activityContent}>
                                <Text style={s.activityText}>{activity.description}</Text>
                                <Text style={s.timeText}>
                                    {activity.createdAt
                                        ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                                        : 'Just now'}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={s.emptyText}>
                        No activity recorded yet.
                    </Text>
                )}
            </View>

            {activities.length > 5 && (
                <Pressable style={s.showAllButton} onPress={() => navigation.navigate('ActivityLog')}>
                    <Text style={s.showAllText}>Show All</Text>
                </Pressable>
            )}
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 12,
        marginBottom: 24,
    },
    feedContainer: {
        paddingRight: 8,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        paddingBottom: 16,
        marginBottom: 16,
    },
    lastRow: {
        borderBottomWidth: 0,
        paddingBottom: 0,
        marginBottom: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#a3e635',
        marginTop: 6,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    timeText: {
        color: '#999',
        fontSize: 12,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'monospace',
        fontStyle: 'italic',
    },
    showAllButton: {
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: '#151515',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    showAllText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        fontSize: 14,
    }
});
