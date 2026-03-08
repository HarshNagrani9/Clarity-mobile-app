import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useApp } from '../lib/store';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitTrends } from '../components/habits/HabitTrends';
import { AddHabitModal } from '../components/habits/AddHabitModal';

export default function HabitsScreen() {
    const { habits, deleteHabit } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const handlePrevDay = () => setSelectedDate(curr => subDays(curr, 1));
    const handleNextDay = () => setSelectedDate(curr => addDays(curr, 1));

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const displayDate = format(selectedDate, 'EEEE, MMMM do');
    const isToday = isSameDay(selectedDate, new Date());

    return (
        <SafeAreaView style={s.safeArea}>
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Habit Tracker</Text>
                    <Text style={s.headerSubtitle}>Build consistency daily.</Text>
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

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
                {/* Date Scroller */}
                <View style={s.dateScroller}>
                    <Pressable onPress={handlePrevDay} style={s.dateBtn} hitSlop={10}>
                        <ChevronLeft size={24} color="#fff" />
                    </Pressable>
                    <Text style={s.dateText}>{displayDate}</Text>
                    <Pressable
                        onPress={handleNextDay}
                        style={[s.dateBtn, isToday && s.dateBtnDisabled]}
                        disabled={isToday}
                        hitSlop={10}
                    >
                        <ChevronRight size={24} color={isToday ? "#444" : "#fff"} />
                    </Pressable>
                </View>

                {/* Trends Graph */}
                <HabitTrends />

                {/* Habits List */}
                <View style={s.listContainer}>
                    {habits.length > 0 ? (
                        habits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                selectedDate={formattedDate}
                                onDelete={deleteHabit}
                            />
                        ))
                    ) : (
                        <View style={s.emptyState}>
                            <Text style={s.emptyText}>No habits created yet. Tap "New" to start tracking!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modals */}
            <AddHabitModal
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
    content: {
        padding: 20,
        paddingBottom: 100, // accommodate bottom tabs
    },
    dateScroller: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginBottom: 24,
    },
    dateBtn: {
        padding: 4,
    },
    dateBtnDisabled: {
        opacity: 0.5,
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        fontFamily: 'monospace',
        lineHeight: 20,
    }
});
