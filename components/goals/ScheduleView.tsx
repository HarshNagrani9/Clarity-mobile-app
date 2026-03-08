import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval,
    isSameMonth, isToday, addMonths, subMonths,
    startOfWeek, endOfWeek, compareAsc, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react-native';
import { Goal } from '../../lib/types';

interface ScheduleViewProps {
    goals: Goal[];
}

export function ScheduleView({ goals }: ScheduleViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Calculate calendar grid
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Flatten goals and milestones
    const scheduleItems = useMemo(() => {
        const items: { date: Date; type: 'goal' | 'milestone'; title: string; goalTitle?: string; completed: boolean; color: string }[] = [];

        goals.forEach(goal => {
            if (goal.targetDate) {
                items.push({
                    date: parseISO(goal.targetDate),
                    type: 'goal',
                    title: goal.title,
                    completed: goal.completed,
                    color: goal.completed ? '#22c55e' : '#3b82f6' // green : blue
                });
            }
            goal.milestones.forEach(milestone => {
                if (milestone.targetDate) {
                    items.push({
                        date: parseISO(milestone.targetDate),
                        type: 'milestone',
                        title: milestone.title,
                        goalTitle: goal.title,
                        completed: milestone.completed,
                        color: milestone.completed ? 'rgba(34, 197, 94, 0.8)' : '#f97316' // green/80 : orange
                    });
                }
            });
        });

        return items.sort((a, b) => compareAsc(a.date, b.date));
    }, [goals]);

    // Group items by Month -> Day
    const groupedSchedule = useMemo(() => {
        const groups: Record<string, { date: Date; items: typeof scheduleItems }[]> = {};

        scheduleItems.forEach(item => {
            const monthKey = format(item.date, 'MMMM yyyy');
            const dayKey = format(item.date, 'yyyy-MM-dd');

            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }

            let dayGroup = groups[monthKey].find(d => format(d.date, 'yyyy-MM-dd') === dayKey);
            if (!dayGroup) {
                dayGroup = { date: item.date, items: [] };
                groups[monthKey].push(dayGroup);
            }
            dayGroup.items.push(item);
        });

        return groups;
    }, [scheduleItems]);

    return (
        <View style={s.container}>
            {/* Header Control */}
            <View style={s.headerCard}>
                <View style={s.headerTopRow}>
                    <Pressable
                        style={s.monthSelector}
                        onPress={() => setIsCalendarExpanded(!isCalendarExpanded)}
                        hitSlop={10}
                    >
                        <Text style={s.monthSelectorTitle}>{format(currentMonth, "MMMM yyyy")}</Text>
                        <CalendarIcon size={18} color="#999" />
                    </Pressable>

                    <View style={s.navArrows}>
                        <Pressable style={s.arrowBtn} onPress={prevMonth} hitSlop={10}>
                            <ChevronLeft size={24} color="#ccc" />
                        </Pressable>
                        <Pressable style={s.arrowBtn} onPress={nextMonth} hitSlop={10}>
                            <ChevronRight size={24} color="#ccc" />
                        </Pressable>
                    </View>
                </View>

                {/* Grid */}
                {isCalendarExpanded && (
                    <View style={s.gridContainer}>
                        <View style={s.weekdayHeader}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <Text key={i} style={s.weekdayText}>{d}</Text>
                            ))}
                        </View>

                        <View style={s.daysGrid}>
                            {days.map((day) => {
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isTodayDate = isToday(day);
                                const dayStr = format(day, 'yyyy-MM-dd');
                                const hasItems = scheduleItems.some(i => format(i.date, 'yyyy-MM-dd') === dayStr);

                                return (
                                    <View key={day.toISOString()} style={s.dayCell}>
                                        <View style={[
                                            s.dayCircle,
                                            isTodayDate && s.dayCircleToday,
                                            !isCurrentMonth && s.dayCircleNotInMonth
                                        ]}>
                                            <Text style={[
                                                s.dayText,
                                                isTodayDate && s.dayTextToday,
                                                !isCurrentMonth && s.dayTextNotInMonth
                                            ]}>
                                                {format(day, 'd')}
                                            </Text>
                                        </View>
                                        {hasItems && !isTodayDate && (
                                            <View style={s.dayDot} />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
            </View>

            {/* Schedule List */}
            {Object.keys(groupedSchedule).length === 0 ? (
                <View style={s.emptyState}>
                    <Text style={s.emptyStateTitle}>No Upcoming Goals</Text>
                    <Text style={s.emptyStateDesc}>Add goals to see your schedule here.</Text>
                </View>
            ) : (
                <View style={s.scheduleList}>
                    {Object.entries(groupedSchedule).map(([month, days]) => (
                        <View key={month} style={s.monthGroup}>
                            {/* Visual Month Header Strip */}
                            <View style={s.monthStrip}>
                                <Text style={s.monthStripText}>{month}</Text>
                            </View>

                            <View style={s.daysList}>
                                {days.map((dayGroup, idx) => (
                                    <View key={idx} style={s.dayGroupRow}>
                                        {/* Date Side */}
                                        <View style={s.dateSide}>
                                            <Text style={s.dateSideWeekday}>{format(dayGroup.date, 'EEE')}</Text>
                                            <View style={[s.dateSideNumBox, isToday(dayGroup.date) && s.dateSideNumBoxToday]}>
                                                <Text style={[s.dateSideNum, isToday(dayGroup.date) && s.dateSideNumToday]}>
                                                    {format(dayGroup.date, 'd')}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Items Side */}
                                        <View style={s.itemsSide}>
                                            {dayGroup.items.map((item, i) => (
                                                <View
                                                    key={i}
                                                    style={[
                                                        s.scheduleItemCard,
                                                        { borderLeftColor: item.type === 'goal' ? '#3b82f6' : '#f97316' }
                                                    ]}
                                                >
                                                    <View style={[s.itemColorDot, { backgroundColor: item.color }]} />

                                                    <View style={s.itemContent}>
                                                        <Text
                                                            style={[s.itemTitle, item.completed && s.itemTitleCompleted]}
                                                            numberOfLines={1}
                                                        >
                                                            {item.title}
                                                        </Text>
                                                        {item.type === 'milestone' && (
                                                            <Text style={s.itemGoalRef} numberOfLines={1}>
                                                                Goal: {item.goalTitle}
                                                            </Text>
                                                        )}
                                                    </View>

                                                    {item.completed && <CheckCircle2 size={16} color="#22c55e" />}
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerCard: {
        backgroundColor: '#151515',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
        overflow: 'hidden',
        marginBottom: 20,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        backgroundColor: '#111',
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    monthSelectorTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    navArrows: {
        flexDirection: 'row',
        gap: 8,
    },
    arrowBtn: {
        padding: 4,
    },
    gridContainer: {
        padding: 16,
    },
    weekdayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    weekdayText: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: `${100 / 7}%`,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCircleToday: {
        backgroundColor: '#fff',
    },
    dayCircleNotInMonth: {
        opacity: 0.3,
    },
    dayText: {
        color: '#ccc',
        fontSize: 14,
    },
    dayTextToday: {
        color: '#000',
        fontWeight: 'bold',
    },
    dayTextNotInMonth: {
        color: '#666',
    },
    dayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 2,
    },
    emptyState: {
        padding: 40,
        backgroundColor: '#151515',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateDesc: {
        color: '#888',
        fontSize: 14,
    },
    scheduleList: {
        gap: 24,
    },
    monthGroup: {
        backgroundColor: '#151515',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
        overflow: 'hidden',
    },
    monthStrip: {
        backgroundColor: '#222',
        padding: 16,
        paddingVertical: 24,
    },
    monthStripText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        opacity: 0.9,
    },
    daysList: {
        padding: 12,
        gap: 16,
    },
    dayGroupRow: {
        flexDirection: 'row',
        gap: 16,
    },
    dateSide: {
        width: 44,
        alignItems: 'center',
        paddingTop: 4,
    },
    dateSideWeekday: {
        color: '#888',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    dateSideNumBox: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    dateSideNumBoxToday: {
        backgroundColor: '#a3e635', // Match Brutalist brand color
    },
    dateSideNum: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateSideNumToday: {
        color: '#000',
    },
    itemsSide: {
        flex: 1,
        gap: 8,
    },
    scheduleItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderLeftWidth: 4,
        borderRadius: 10,
        padding: 12,
        gap: 12,
    },
    itemColorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    itemTitleCompleted: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    itemGoalRef: {
        color: '#888',
        fontSize: 11,
        marginTop: 2,
    }
});
