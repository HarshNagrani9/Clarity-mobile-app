import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Habit } from '../../lib/types';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths, isToday, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

interface HabitHeatmapProps {
    habit: Habit;
    onToggleDate: (date: string) => void;
}

export function HabitHeatmap({ habit, onToggleDate }: HabitHeatmapProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const isCompleted = (date: Date) => {
        const isoDate = format(date, 'yyyy-MM-dd');
        return habit.completedDates.includes(isoDate);
    };

    const isInteractive = (date: Date) => {
        // Strict Mode: Can only check-in for Today, regardless of frequency.
        return isToday(date);
    };

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.monthText}>{format(currentMonth, 'MMMM yyyy')}</Text>
                <View style={s.navButtons}>
                    <Pressable onPress={prevMonth} style={s.navBtn} hitSlop={10}>
                        <ChevronLeft size={16} color="#fff" />
                    </Pressable>
                    <Pressable onPress={nextMonth} style={s.navBtn} hitSlop={10}>
                        <ChevronRight size={16} color="#fff" />
                    </Pressable>
                </View>
            </View>

            <View style={s.dayHeaderRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <Text key={i} style={s.dayHeaderText}>{d}</Text>
                ))}
            </View>

            <View style={s.grid}>
                {/* Empty cells for offset */}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <View key={`empty-${i}`} style={s.gridCell} />
                ))}

                {daysInMonth.map((date) => {
                    const completed = isCompleted(date);
                    const start = habit.startDate ? new Date(habit.startDate) : null;
                    const end = habit.endDate ? new Date(habit.endDate) : null;

                    // Check bounds
                    const beforeStart = start && date < startOfDay(start);
                    const afterEnd = end && date > startOfDay(end);
                    const outOfBounds = beforeStart || afterEnd;

                    const interactive = isInteractive(date) && !outOfBounds;

                    const isDateToday = isToday(date);

                    return (
                        <View key={date.toISOString()} style={s.gridCell}>
                            <Pressable
                                style={[
                                    s.dayBox,
                                    !completed && !outOfBounds && s.dayBoxPending,
                                    isDateToday && s.dayBoxToday,
                                    completed && { backgroundColor: habit.color, borderColor: habit.color },
                                    (!interactive && !completed) && s.dayBoxDisabled
                                ]}
                                onPress={() => interactive && onToggleDate(format(date, 'yyyy-MM-dd'))}
                            >
                                {completed && <Check size={12} color="#fff" />}
                            </Pressable>
                        </View>
                    );
                })}
            </View>

            <View style={s.footer}>
                <View style={s.legendItem}>
                    <View style={[s.legendColor, { backgroundColor: habit.color }]} />
                    <Text style={s.legendText}>Done</Text>
                </View>
                <View style={s.legendItem}>
                    <View style={[s.legendColor, s.dayBoxPending]} />
                    <Text style={s.legendText}>Pending</Text>
                </View>
                <Text style={s.noteText}>Check-in available for Today only</Text>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        backgroundColor: '#151515',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    navButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    navBtn: {
        padding: 2,
    },
    dayHeaderRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeaderText: {
        flex: 1,
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridCell: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        padding: 2,
    },
    dayBox: {
        flex: 1,
        borderRadius: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dayBoxPending: {
        backgroundColor: '#1E1E1E',
    },
    dayBoxDisabled: {
        opacity: 0.5,
    },
    dayBoxToday: {
        borderColor: '#a3e635',
        borderWidth: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        color: '#bbb',
        fontSize: 12,
    },
    noteText: {
        marginLeft: 'auto',
        color: '#666',
        fontSize: 10,
    }
});
