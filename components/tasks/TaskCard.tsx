import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import { Task } from '../../lib/types';
import { format, isBefore, startOfDay } from 'date-fns';
import { CheckCircle2, AlertCircle, CalendarClock, Trash2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BrutalistCard } from '../ui/BrutalistCard';

interface TaskCardProps {
    task: Task;
    onToggle: (id: number) => void;
    onUpdate: (id: number, updates: Partial<Task>) => void;
    onDelete: (id: number) => void;
}

const PRIORITY_COLORS = {
    high: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    medium: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    low: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' }
};

export function TaskCard({ task, onToggle, onUpdate, onDelete }: TaskCardProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Using local state for the slider allows smooth dragging,
    // we only commit to the backend when the user releases (onSlidingComplete).
    const [localProgress, setLocalProgress] = useState(task.progress);

    const isOverdue = task.dueDate &&
        isBefore(new Date(task.dueDate), startOfDay(new Date())) &&
        !task.completed;

    const prioColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low;

    const handleProgressCommit = (newProgress: number) => {
        onUpdate(task.id, { progress: newProgress });
        // Automatically check off if they slide it strictly to 100%
        if (newProgress === 100 && !task.completed) {
            onToggle(task.id);
        } else if (newProgress < 100 && task.completed) {
            onToggle(task.id);
        }
    };

    const handleDelete = () => {
        Alert.alert("Delete Task", `Remove "${task.title}"?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => onDelete(task.id) }
        ]);
    };

    return (
        <BrutalistCard style={[s.card, isOverdue && s.cardOverdue]}>
            <View style={s.contentRow}>
                {/* Custom Checkbox */}
                <Pressable
                    style={s.checkbox}
                    onPress={() => onToggle(task.id)}
                    hitSlop={10}
                >
                    <View style={[s.checkboxBox, task.completed && s.checkboxBoxActive]}>
                        {task.completed && <CheckCircle2 size={16} color="#a3e635" />}
                    </View>
                </Pressable>

                <View style={s.mainContent}>
                    {/* Header Row: Title & Priority */}
                    <View style={s.titleRow}>
                        <Text style={[s.title, task.completed && s.titleCompleted]}>
                            {task.title}
                        </Text>

                        <View style={[s.badge, { backgroundColor: prioColor.bg }]}>
                            <Text style={[s.badgeText, { color: prioColor.text }]}>
                                {task.priority}
                            </Text>
                        </View>

                        {isOverdue && (
                            <View style={s.missedBadge}>
                                <AlertCircle size={10} color="#fff" />
                                <Text style={s.missedText}>Missed</Text>
                            </View>
                        )}
                    </View>

                    {/* Progress Slider (Only if not completed) */}
                    {!task.completed && (
                        <View style={s.sliderContainer}>
                            <Text style={s.progressText}>{Math.round(localProgress)}%</Text>
                            <Slider
                                style={s.slider}
                                minimumValue={0}
                                maximumValue={100}
                                step={10}
                                value={localProgress}
                                onValueChange={setLocalProgress}
                                onSlidingComplete={handleProgressCommit}
                                minimumTrackTintColor="#a3e635"
                                maximumTrackTintColor="#333"
                                thumbTintColor="#fff"
                            />
                        </View>
                    )}

                    {/* Due Date & Custom Picker */}
                    {task.dueDate ? (
                        <Pressable
                            style={s.dateRow}
                            onPress={() => !task.completed && setShowDatePicker(true)}
                        >
                            <CalendarClock size={12} color={isOverdue ? "#ef4444" : "#888"} />
                            <Text style={[s.dateText, isOverdue && s.dateTextOverdue]}>
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>

                {/* Delete Btn */}
                <Pressable onPress={handleDelete} hitSlop={10} style={s.deleteBtn}>
                    <Trash2 size={16} color="#666" />
                </Pressable>
            </View>

            {/* Native Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    value={task.dueDate ? new Date(task.dueDate) : new Date()}
                    mode="date"
                    display="default"
                    themeVariant="dark"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios'); // keep open on iOS until 'done' might be needed, but simplified here
                        if (Platform.OS === 'android') setShowDatePicker(false);

                        if (event.type === 'set' && selectedDate) {
                            const newDateIso = format(selectedDate, 'yyyy-MM-dd');
                            onUpdate(task.id, { dueDate: newDateIso });
                            if (Platform.OS === 'ios') setShowDatePicker(false);
                        } else if (event.type === 'dismissed') {
                            setShowDatePicker(false);
                        }
                    }}
                />
            )}
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    card: {
        marginBottom: 12,
        padding: 16,
    },
    cardOverdue: {
        borderColor: 'rgba(239, 68, 68, 0.4)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)'
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    checkbox: {
        marginTop: 2,
    },
    checkboxBox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
    },
    checkboxBoxActive: {
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.1)',
    },
    mainContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    titleCompleted: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    missedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4,
    },
    missedText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        backgroundColor: '#1A1A1A',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333'
    },
    progressText: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'monospace',
        width: 35,
    },
    slider: {
        flex: 1,
        height: 20,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    dateText: {
        color: '#888',
        fontSize: 12,
    },
    dateTextOverdue: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    deleteBtn: {
        padding: 4,
    }
});
