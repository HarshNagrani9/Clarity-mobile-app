import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useApp } from '../lib/store';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalIcon, Play, Target, ListTodo } from 'lucide-react-native';

export default function CalendarScreen() {
    const [centerDate, setCenterDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { habits, tasks, goals, events, toggleHabit, toggleTask, updateGoal } = useApp();

    const daysWindow = useMemo(() => {
        const days = [];
        for (let i = -7; i <= 7; i++) {
            days.push(addDays(centerDate, i));
        }
        return days;
    }, [centerDate]);

    // Unified Data Aggregator for selectedDate
    const agendaData = useMemo(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        const dayHabits = habits.filter(h => {
            if (h.startDate && dateStr < format(new Date(h.startDate), 'yyyy-MM-dd')) return false;
            if (h.frequency === 'daily' || h.frequency === 'weekly') return true;
            return false;
        }).map(h => {
            const isFuture = dateStr > todayStr;
            return {
                id: `h_${h.id}`,
                title: h.title,
                type: 'habit',
                color: '#a3e635',
                icon: Play,
                completed: h.completedDates.includes(dateStr),
                // Disable toggling for future dates
                onToggle: isFuture ? undefined : () => toggleHabit(h.id, dateStr)
            };
        });

        const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr)).map(t => ({
            id: `t_${t.id}`,
            title: t.title,
            type: 'task',
            color: t.priority === 'high' ? '#ef4444' : (t.priority === 'medium' ? '#f59e0b' : '#3b82f6'),
            icon: ListTodo,
            completed: t.completed,
            onToggle: () => toggleTask(t.id)
        }));

        const dayGoals = goals.filter(g => g.targetDate && g.targetDate.startsWith(dateStr)).map(g => ({
            id: `g_${g.id}`,
            title: g.title,
            type: 'goal deadline',
            color: '#c084fc', // Lighter purple for Goal Deadline
            icon: Target,
            completed: g.completed,
            onToggle: () => {
                const newCompleted = !g.completed;
                updateGoal(g.id, {
                    completed: newCompleted,
                    progress: newCompleted ? 100 : 0
                });
            }
        }));

        const dayMilestones = goals.flatMap(g =>
            (g.milestones || []).filter(m => m.targetDate && m.targetDate.startsWith(dateStr)).map((m, mIdx) => ({
                id: `m_${g.id}_${m.title}`,
                title: `${g.title}: ${m.title}`,
                type: 'milestone',
                color: '#d946ef', // Fuchsia for Milestone
                icon: Target,
                completed: m.completed,
                onToggle: () => {
                    // Deep copy to avoid strict strict-mode read-only bugs and glitches
                    const newMilestones = JSON.parse(JSON.stringify(g.milestones));
                    newMilestones[mIdx].completed = !newMilestones[mIdx].completed;

                    const completedCount = newMilestones.filter((ms: any) => ms.completed).length;
                    const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : 0;

                    updateGoal(g.id, {
                        milestones: newMilestones,
                        progress,
                        completed: progress === 100
                    });
                }
            }))
        );

        const dayEvents = events.filter(e => e.date === dateStr).map(e => ({
            id: `e_${e.id}`,
            title: e.title,
            type: 'event',
            color: '#10b981', // Emerald for Event
            icon: CalIcon,
            completed: false,
            onToggle: undefined // Events aren't checkable
        }));

        return [...dayEvents, ...dayTasks, ...dayGoals, ...dayMilestones, ...dayHabits];
    }, [selectedDate, habits, tasks, goals, events, toggleHabit, toggleTask, updateGoal]);


    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Calendar</Text>
                    <Text style={s.headerSubtitle}>Unified daily agenda.</Text>
                </View>
            </View>

            {/* Horizontal Date Strip Control */}
            <View style={s.stripWrapper}>
                <View style={s.stripControls}>
                    <Pressable onPress={() => setCenterDate(subDays(centerDate, 7))} style={s.chevronBtn}>
                        <ChevronLeft size={20} color="#fff" />
                    </Pressable>
                    <Text style={s.stripMonthText}>{format(centerDate, 'MMMM yyyy')}</Text>
                    <Pressable onPress={() => setCenterDate(addDays(centerDate, 7))} style={s.chevronBtn}>
                        <ChevronRight size={20} color="#fff" />
                    </Pressable>
                </View>

                {/* The Strip */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.stripScroll}
                >
                    {daysWindow.map((d, i) => {
                        const isSelected = isSameDay(d, selectedDate);
                        const isToday = isSameDay(d, new Date());
                        return (
                            <Pressable
                                key={i}
                                onPress={() => setSelectedDate(d)}
                                style={[
                                    s.daySlot,
                                    isSelected && s.daySlotSelected,
                                    isToday && !isSelected && s.daySlotToday
                                ]}
                            >
                                <Text style={[s.dayName, isSelected && { color: '#000' }]}>
                                    {format(d, 'E')}
                                </Text>
                                <Text style={[s.dayNum, isSelected && { color: '#000' }]}>
                                    {format(d, 'd')}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Daily Agenda List */}
            <ScrollView contentContainerStyle={s.agendaContent} showsVerticalScrollIndicator={false}>
                <Text style={s.agendaTitle}>
                    {isSameDay(selectedDate, new Date()) ? 'Today\'s Agenda' : format(selectedDate, 'EEEE, MMM do')}
                </Text>

                {agendaData.length > 0 ? (
                    <View style={s.agendaList}>
                        {agendaData.map((item) => {
                            const IconComponent = item.icon;

                            const Wrapper = item.onToggle ? Pressable : View;

                            return (
                                <Wrapper
                                    key={item.id}
                                    style={s.agendaItem}
                                    onPress={item.onToggle ? () => item.onToggle && item.onToggle() : undefined}
                                >
                                    <View style={[s.iconBox, { backgroundColor: `${item.color}20` }]}>
                                        <IconComponent size={14} color={item.color} />
                                    </View>
                                    <View style={s.agendaItemBody}>
                                        <Text style={[
                                            s.agendaItemTitle,
                                            // Apply color logic primarily to the badge, leave title white unless done
                                            item.completed && s.completedText
                                        ]}>
                                            {item.title}
                                        </Text>
                                        <View style={[s.typeBadge, { backgroundColor: `${item.color}20` }]}>
                                            <Text style={[s.agendaItemType, { color: item.color }]}>{item.type.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    {/* Outline circle for checkable items, solid circle for completed */}
                                    {item.onToggle && (
                                        <View style={[s.checkboxBox, item.completed && s.checkboxBoxActive]}>
                                            {item.completed && <CheckCircle2 size={16} color="#a3e635" />}
                                        </View>
                                    )}
                                </Wrapper>
                            )
                        })}
                    </View>
                ) : (
                    <View style={s.emptyState}>
                        <CalIcon size={32} color="#333" style={{ marginBottom: 12 }} />
                        <Text style={s.emptyStateText}>No items scheduled for this day.</Text>
                    </View>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#151515',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'monospace',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    stripWrapper: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    stripControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    chevronBtn: {
        padding: 4,
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
    },
    stripMonthText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    stripScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    daySlot: {
        width: 50,
        height: 65,
        backgroundColor: '#222',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    daySlotToday: {
        borderColor: '#a3e635',
    },
    daySlotSelected: {
        backgroundColor: '#a3e635',
        borderColor: '#a3e635',
    },
    dayName: {
        color: '#888',
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    dayNum: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    agendaContent: {
        padding: 20,
    },
    agendaTitle: {
        color: '#ccc',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'monospace',
    },
    agendaList: {
        gap: 12,
    },
    agendaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    agendaItemBody: {
        flex: 1,
    },
    agendaItemTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    completedText: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    agendaItemType: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 6,
    },
    checkboxBox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxBoxActive: {
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.1)',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    }
});
