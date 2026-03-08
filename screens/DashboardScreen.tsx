import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { DistributionPie } from '../components/dashboard/DistributionPie';
import { RadarStats } from '../components/dashboard/RadarStats';
import { CheckCircle, Target, ListTodo, TrendingUp } from 'lucide-react-native';
import { useApp } from '../lib/store';
import { format } from 'date-fns';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// We need to extend the props to access navigation
type DashboardScreenProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function DashboardScreen({ navigation }: { navigation: any }) {
    const [showProfile, setShowProfile] = useState(false);

    // Global Store
    const { habits, goals, tasks, recentActivities } = useApp();

    // Metric Calculations matching webapp/app/(dashboard)/dashboard/page.tsx
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    const totalDailyHabits = dailyHabits.length;
    const dailyHabitsCompletedToday = dailyHabits.filter(h =>
        h.completedDates.includes(todayStr)
    ).length;

    const habitPercentage = totalDailyHabits > 0
        ? Math.min(100, Math.round((dailyHabitsCompletedToday / totalDailyHabits) * 100))
        : 0;

    const activeGoals = goals.filter(g => !g.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high').length;

    const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

    // Get User Details for UI
    const user = auth.currentUser;
    const displayName = user?.displayName || 'User';
    const initials = displayName.substring(0, 2).toUpperCase();
    const email = user?.email || 'No email attached';

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowProfile(false);
            // Force reset back to Landing stack after signing out
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Landing' }] });
        } catch (error: any) {
            Alert.alert('Error logging out', error.message);
        }
    };

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            <View style={s.headerContainer}>
                <View style={s.headerTitleArea}>
                    <Text style={s.title}>Dashboard</Text>
                    <Text style={s.subtitle}>Welcome back! Here's your overview for today.</Text>
                </View>

                <Pressable style={s.profileButton} onPress={() => setShowProfile(true)}>
                    <Text style={s.profileInitials}>{initials}</Text>
                </Pressable>
            </View>

            {/* Metrics Grid */}
            <View style={s.grid}>
                <StatCard
                    title="Daily Habits"
                    value={`${habitPercentage}%`}
                    subtitle={`${dailyHabitsCompletedToday} / ${totalDailyHabits} completed`}
                    icon={<CheckCircle size={18} color="#666" />}
                />
                <StatCard
                    title="Active Goals"
                    value={activeGoals}
                    subtitle="Keep pushing!"
                    icon={<Target size={18} color="#666" />}
                />
                <StatCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    subtitle={`${highPriorityTasks} high priority`}
                    icon={<ListTodo size={18} color="#666" />}
                />
                <StatCard
                    title="Best Streak"
                    value={`${maxStreak} Days`}
                    subtitle="Consistency is key"
                    icon={<TrendingUp size={18} color="#666" />}
                />
            </View>

            {/* Charts Grid */}
            <View style={s.chartsGrid}>
                <RadarStats />
                <DistributionPie />
            </View>

            {/* Recent Activity */}
            <ActivityFeed activities={recentActivities} />

            {/* Profile Modal */}
            <Modal visible={showProfile} animationType="fade" transparent={true} onRequestClose={() => setShowProfile(false)}>
                <TouchableWithoutFeedback onPress={() => setShowProfile(false)}>
                    <View style={s.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={s.modalContent}>
                                <View style={s.modalHeader}>
                                    <View style={s.modalAvatarLarge}>
                                        <Text style={s.modalAvatarText}>{initials}</Text>
                                    </View>
                                    <View>
                                        <Text style={s.modalName}>{displayName}</Text>
                                        <Text style={s.modalEmail}>{email}</Text>
                                    </View>
                                </View>

                                <BrutalistButton
                                    bgColor="#ef4444"
                                    textColor="#fff"
                                    style={{ width: '100%' }}
                                    onPress={handleLogout}
                                >
                                    Log Out
                                </BrutalistButton>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    content: {
        padding: 24,
        paddingTop: 60, // account for safe area
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    headerTitleArea: {
        flex: 1,
        paddingRight: 16,
    },
    profileButton: {
        width: 44,
        height: 44,
        backgroundColor: '#a3e635',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitials: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        fontFamily: 'monospace',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 4,
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 14,
        lineHeight: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    chartsGrid: {
        marginBottom: 16,
    },
    placeholderBox: {
        borderWidth: 2,
        borderColor: '#333',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#666',
        fontFamily: 'monospace',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#151515',
        borderWidth: 2,
        borderColor: '#333',
        width: '100%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
    },
    modalAvatarLarge: {
        width: 64,
        height: 64,
        backgroundColor: '#a3e635',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    modalAvatarText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        fontFamily: 'monospace',
    },
    modalName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalEmail: {
        color: '#9ca3af',
        fontSize: 14,
        marginTop: 4,
    }
});
