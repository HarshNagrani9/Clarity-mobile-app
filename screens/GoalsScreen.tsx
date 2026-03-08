import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useApp } from '../lib/store';
import { Plus, LayoutGrid, CalendarDays } from 'lucide-react-native';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { GoalCard } from '../components/goals/GoalCard';
import { AddGoalModal } from '../components/goals/AddGoalModal';
import { ScheduleView } from '../components/goals/ScheduleView';

export default function GoalsScreen() {
    const { goals, updateGoal, deleteGoal } = useApp();
    const [viewMode, setViewMode] = useState<'standard' | 'schedule'>('standard');
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const activeGoals = goals.filter(g => !g.completed).sort((a, b) => {
        const timeA = a.targetDate ? new Date(a.targetDate).getTime() : Infinity;
        const timeB = b.targetDate ? new Date(b.targetDate).getTime() : Infinity;
        return timeA - timeB;
    });
    const completedGoals = goals.filter(g => g.completed);

    const displayGoals = activeTab === 'active' ? activeGoals : completedGoals;

    return (
        <SafeAreaView style={s.safeArea}>
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Goals</Text>
                    <Text style={s.headerSubtitle}>Track long-term objectives.</Text>
                </View>
                <BrutalistButton
                    onPress={() => setAddModalVisible(true)}
                    bgColor="#a3e635"
                    textColor="#000"
                    style={s.addButton}
                >
                    <View style={s.addButtonContent}>
                        <Plus size={16} color="#000" />
                        <Text style={s.addButtonText}>New</Text>
                    </View>
                </BrutalistButton>
            </View>

            {/* View Mode Toggle */}
            <View style={s.viewToggleContainer}>
                <View style={s.viewToggle}>
                    <Pressable
                        style={[s.toggleBtn, viewMode === 'standard' && s.toggleBtnActive]}
                        onPress={() => setViewMode('standard')}
                    >
                        <LayoutGrid size={16} color={viewMode === 'standard' ? "#fff" : "#666"} />
                        <Text style={[s.toggleText, viewMode === 'standard' && s.toggleTextActive]}>Standard</Text>
                    </Pressable>
                    <Pressable
                        style={[s.toggleBtn, viewMode === 'schedule' && s.toggleBtnActive]}
                        onPress={() => setViewMode('schedule')}
                    >
                        <CalendarDays size={16} color={viewMode === 'schedule' ? "#fff" : "#666"} />
                        <Text style={[s.toggleText, viewMode === 'schedule' && s.toggleTextActive]}>Schedule</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
                {viewMode === 'standard' ? (
                    <>
                        {/* Sub Tabs: Active / Completed */}
                        <View style={s.subTabs}>
                            <Pressable onPress={() => setActiveTab('active')} style={s.subTabBtn}>
                                <Text style={[s.subTabText, activeTab === 'active' && s.subTabTextActive]}>Active Goals</Text>
                                {activeTab === 'active' && <View style={s.activeIndicator} />}
                            </Pressable>
                            <Pressable onPress={() => setActiveTab('completed')} style={s.subTabBtn}>
                                <Text style={[s.subTabText, activeTab === 'completed' && s.subTabTextActive]}>Completed</Text>
                                {activeTab === 'completed' && <View style={s.activeIndicator} />}
                            </Pressable>
                        </View>

                        {/* List */}
                        <View style={s.listContainer}>
                            {displayGoals.length > 0 ? (
                                displayGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onUpdate={updateGoal}
                                        onDelete={deleteGoal}
                                    />
                                ))
                            ) : (
                                <View style={s.emptyState}>
                                    <Text style={s.emptyText}>
                                        {activeTab === 'active' ? "No active goals. Set a new one!" : "No completed goals yet. Keep going!"}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                ) : (
                    <View style={{ flex: 1 }}>
                        <ScheduleView goals={goals} />
                    </View>
                )}
            </ScrollView>

            <AddGoalModal
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#9ca3af',
        fontSize: 14,
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
    },
    viewToggleContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    toggleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
        borderRadius: 6,
    },
    toggleBtnActive: {
        backgroundColor: '#2A2A2A',
    },
    toggleText: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#fff',
    },
    content: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 100,
    },
    subTabs: {
        flexDirection: 'row',
        gap: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        marginBottom: 20,
    },
    subTabBtn: {
        paddingVertical: 12,
        position: 'relative',
    },
    subTabText: {
        color: '#666',
        fontSize: 15,
        fontWeight: '600',
    },
    subTabTextActive: {
        color: '#fff',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#a3e635',
    },
    listContainer: {
        gap: 16,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151515',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
        borderStyle: 'dashed',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        fontFamily: 'monospace',
        lineHeight: 20,
    }
});
