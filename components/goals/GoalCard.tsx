import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Goal } from '../../lib/types';
import { format, isBefore, startOfDay } from 'date-fns';
import { AlertCircle, CalendarClock, Trash2, CheckCircle2, Plus } from 'lucide-react-native';
import { BrutalistCard } from '../ui/BrutalistCard';
import { MilestoneDetailModal } from './MilestoneDetailModal';
import { AddMilestoneModal } from './AddMilestoneModal';

interface GoalCardProps {
    goal: Goal;
    onUpdate: (id: number, updates: Partial<Goal>) => void;
    onDelete: (id: number) => void;
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
    const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number | null>(null);
    const [isAddingMilestone, setIsAddingMilestone] = useState(false);

    const isGoalOverdue = goal.targetDate &&
        isBefore(new Date(goal.targetDate), startOfDay(new Date())) &&
        !goal.completed;

    const handleMilestoneToggle = (index: number) => {
        const newMilestones = [...goal.milestones];
        newMilestones[index].completed = !newMilestones[index].completed;

        const completedCount = newMilestones.filter(m => m.completed).length;
        const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : 0;

        onUpdate(goal.id, {
            milestones: newMilestones,
            progress,
            completed: progress === 100
        });
    };

    const handleAddMilestone = (newMilestone: any) => {
        const newMilestones = [...goal.milestones, newMilestone];
        const completedCount = newMilestones.filter(m => m.completed).length;
        const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : 0;

        onUpdate(goal.id, {
            milestones: newMilestones,
            progress,
            completed: progress === 100 // Might transition from complete to active!
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Goal",
            `Remove "${goal.title}" entirely?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(goal.id) }
            ]
        );
    };

    return (
        <BrutalistCard
            style={[s.card, isGoalOverdue && { borderColor: 'rgba(239, 68, 68, 0.4)' }]}
        >
            {/* Header */}
            <View style={s.header}>
                <View style={s.titleRow}>
                    <Text style={s.title}>{goal.title}</Text>
                    {isGoalOverdue && (
                        <View style={s.missedBadge}>
                            <AlertCircle size={10} color="#fff" />
                            <Text style={s.missedText}>Missed</Text>
                        </View>
                    )}
                </View>

                {goal.targetDate ? (
                    <View style={s.targetRow}>
                        <Text style={[s.targetText, isGoalOverdue && s.targetTextOverdue]}>
                            Target: {format(new Date(goal.targetDate), "MM/dd/yyyy")}
                        </Text>
                        {isGoalOverdue && <CalendarClock size={12} color="#ef4444" />}
                    </View>
                ) : null}

                <View style={s.actionRow}>
                    <View style={[s.statusBadge, goal.completed && s.statusBadgeCompleted]}>
                        <Text style={[s.statusText, goal.completed && s.statusTextCompleted]}>
                            {goal.completed ? "Completed" : "In Progress"}
                        </Text>
                    </View>
                    <Pressable onPress={handleDelete} hitSlop={10} style={s.trashBtn}>
                        <Trash2 size={16} color="#666" />
                    </Pressable>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={s.progressWrapper}>
                <View style={s.progressLabels}>
                    <Text style={s.progressLabelText}>Progress</Text>
                    <Text style={s.progressLabelText}>{goal.progress}%</Text>
                </View>
                <View style={[s.progressBarBg, isGoalOverdue && s.progressBarBgOverdue]}>
                    <View style={[
                        s.progressBarFill,
                        { width: `${goal.progress}%` },
                        isGoalOverdue && s.progressBarFillOverdue
                    ]} />
                </View>
            </View>

            {/* Milestones List */}
            <View style={s.milestonesSection}>
                <View style={s.milestonesHeaderRow}>
                    <Text style={s.milestonesHeader}>Milestones</Text>
                    <Pressable onPress={() => setIsAddingMilestone(true)} hitSlop={10} style={s.addMilestoneIconBtn}>
                        <Plus size={14} color="#888" />
                    </Pressable>
                </View>

                {goal.milestones.length === 0 ? (
                    <Text style={s.noMilestonesText}>No milestones yet. Tap + to add.</Text>
                ) : (
                    <View style={s.milestonesList}>
                        {goal.milestones.map((milestone, idx) => {
                            const isMilestoneOverdue = milestone.targetDate &&
                                isBefore(new Date(milestone.targetDate), startOfDay(new Date())) &&
                                !milestone.completed;

                            return (
                                <View key={idx} style={[s.milestoneRow, isMilestoneOverdue && s.milestoneRowOverdue]}>
                                    <Pressable
                                        style={s.checkbox}
                                        onPress={() => handleMilestoneToggle(idx)}
                                        hitSlop={5}
                                    >
                                        <View style={[s.checkboxBox, milestone.completed && s.checkboxBoxActive]}>
                                            {milestone.completed && <CheckCircle2 size={14} color="#a3e635" />}
                                        </View>
                                    </Pressable>

                                    <Pressable
                                        style={s.milestoneContent}
                                        onPress={() => setSelectedMilestoneIdx(idx)}
                                    >
                                        <View style={s.milestoneTitleRow}>
                                            <Text style={[
                                                s.milestoneTitle,
                                                milestone.completed && s.milestoneTitleCompleted,
                                                isMilestoneOverdue && !milestone.completed && s.milestoneTitleOverdue
                                            ]}>
                                                {milestone.title}
                                            </Text>
                                            <Text style={s.milestoneDetailsHook}>• Details</Text>
                                        </View>

                                        {milestone.targetDate ? (
                                            <View style={[s.milestoneDateBadge, isMilestoneOverdue && s.milestoneDateBadgeOverdue]}>
                                                <Text style={[s.milestoneDateText, isMilestoneOverdue && s.milestoneDateTextOverdue]}>
                                                    {format(new Date(milestone.targetDate), 'MMM d')}
                                                    {isMilestoneOverdue && " ⚠️"}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            {selectedMilestoneIdx !== null && (
                <MilestoneDetailModal
                    goal={goal}
                    milestoneIndex={selectedMilestoneIdx}
                    visible={selectedMilestoneIdx !== null}
                    onClose={() => setSelectedMilestoneIdx(null)}
                    onUpdate={onUpdate}
                />
            )}

            <AddMilestoneModal
                visible={isAddingMilestone}
                goal={goal}
                onClose={() => setIsAddingMilestone(false)}
                onAdd={handleAddMilestone}
            />
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    header: {
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
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
    targetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    targetText: {
        color: '#888',
        fontSize: 12,
    },
    targetTextOverdue: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeCompleted: {
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.1)',
    },
    statusText: {
        color: '#ccc',
        fontSize: 10,
    },
    statusTextCompleted: {
        color: '#a3e635',
        fontWeight: 'bold',
    },
    trashBtn: {
        padding: 4,
    },
    progressWrapper: {
        marginBottom: 20,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabelText: {
        color: '#666',
        fontSize: 12,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#2A2A2A',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarBgOverdue: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
    },
    progressBarFillOverdue: {
        backgroundColor: '#ef4444',
    },
    milestonesSection: {
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: 16,
    },
    milestonesHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    milestonesHeader: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
    },
    addMilestoneIconBtn: {
        padding: 4,
        backgroundColor: '#1A1A1A',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333'
    },
    noMilestonesText: {
        color: '#666',
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    milestonesList: {
        gap: 8,
    },
    milestoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#151515',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#222',
    },
    milestoneRowOverdue: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    checkbox: {
        justifyContent: 'center',
    },
    checkboxBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxBoxActive: {
        borderColor: '#a3e635',
    },
    milestoneContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    milestoneTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    milestoneTitle: {
        color: '#ddd',
        fontSize: 14,
        fontWeight: '500',
    },
    milestoneTitleCompleted: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    milestoneTitleOverdue: {
        color: '#ef4444',
    },
    milestoneDetailsHook: {
        color: '#a3e635',
        fontSize: 10,
        marginLeft: 8,
        opacity: 0.8,
    },
    milestoneDateBadge: {
        backgroundColor: '#222',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    milestoneDateBadgeOverdue: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    milestoneDateText: {
        color: '#888',
        fontSize: 10,
    },
    milestoneDateTextOverdue: {
        color: '#ef4444',
        fontWeight: 'bold',
    }
});
