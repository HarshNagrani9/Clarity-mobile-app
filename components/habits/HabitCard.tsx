import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Habit } from '../../lib/types';
import { Flame, Check, Trash2, CalendarDays } from 'lucide-react-native';
import { BrutalistButton } from '../ui/BrutalistButton';
import { format } from 'date-fns';
import { useApp } from '../../lib/store';
import { HabitHeatmap } from './HabitHeatmap';

interface HabitCardProps {
    habit: Habit;
    selectedDate: string;
    onDelete: (id: number) => void;
}

export function HabitCard({ habit, selectedDate, onDelete }: HabitCardProps) {
    const { toggleHabit } = useApp();
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompletedOnDate = habit.completedDates.includes(selectedDate);
    const isToday = selectedDate === today;
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete "${habit.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(habit.id) }
            ]
        );
    };

    return (
        <View style={s.cardContainer}>
            <View style={s.headerRow}>
                <Text style={s.title}>{habit.title}</Text>

                <View style={s.rightIcons}>
                    <Pressable onPress={() => setIsCalendarOpen(!isCalendarOpen)} hitSlop={15} style={s.calendarBtn}>
                        <CalendarDays size={16} color={isCalendarOpen ? "#fff" : "#666"} style={{ marginRight: 8 }} />
                    </Pressable>
                    <Flame size={16} color="#f97316" fill="#f97316" />
                    <Text style={s.streakText}>{habit.streak}</Text>
                </View>
            </View>

            {isCalendarOpen && (
                <View style={s.calendarContainer}>
                    <HabitHeatmap habit={habit} onToggleDate={(date) => toggleHabit(habit.id, date)} />
                </View>
            )}

            <View style={s.bottomRow}>
                <View style={s.actionRow}>
                    <BrutalistButton
                        bgColor={isCompletedOnDate ? habit.color : "transparent"}
                        textColor={isCompletedOnDate ? "#fff" : "#fff"}
                        shadowColor={isCompletedOnDate ? "#000" : "#121212"}
                        style={s.checkInBtnOuter}
                        onPress={() => {
                            if (isToday) {
                                toggleHabit(habit.id, selectedDate);
                            }
                        }}
                    >
                        <View style={s.checkInContent}>
                            {isCompletedOnDate && <Check size={16} color="#fff" />}
                            <Text style={[s.checkInText, isCompletedOnDate && s.checkInTextActive]}>
                                {isCompletedOnDate ? "Done" : (isToday ? "Check In" : "Not Done")}
                            </Text>
                        </View>
                    </BrutalistButton>

                    <View style={s.frequencyBadge}>
                        <Text style={s.frequencyText}>{habit.frequency}</Text>
                    </View>
                </View>

                <Pressable onPress={handleDelete} hitSlop={15} style={s.deleteBtn}>
                    <Trash2 size={16} color="#666" />
                </Pressable>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginBottom: 8, // if we use gap it handles it, but just in case
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: 14,
    },
    calendarBtn: {
        marginRight: 4,
    },
    calendarContainer: {
        marginBottom: 16,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkInBtnOuter: { // Brutalist overrides for this specific tiny button
        padding: 0,
    },
    checkInContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    checkInText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkInTextActive: {
        color: '#fff',
    },
    frequencyBadge: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    frequencyText: {
        color: '#888',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    deleteBtn: {
        padding: 4,
    }
});
