import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { BrutalistButton } from '../ui/BrutalistButton';
import { X, Plus, Calendar as CalendarIcon } from 'lucide-react-native';
import { useApp } from '../../lib/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface AddGoalModalProps {
    visible: boolean;
    onClose: () => void;
}

export function AddGoalModal({ visible, onClose }: AddGoalModalProps) {
    const { addGoal } = useApp();
    const [title, setTitle] = useState('');
    const [targetDateStr, setTargetDateStr] = useState('');

    const [milestones, setMilestones] = useState<{ title: string; targetDate?: string; description?: string }[]>([]);

    const [newMilestone, setNewMilestone] = useState('');
    const [newMilestoneDate, setNewMilestoneDate] = useState('');
    const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

    const [showGoalDatePicker, setShowGoalDatePicker] = useState(false);
    const [showMilestoneDatePicker, setShowMilestoneDatePicker] = useState(false);

    const handleAddMilestone = () => {
        if (!newMilestone.trim()) return;

        // Validation 1: Child date cannot exceed Parent date
        if (targetDateStr && newMilestoneDate && newMilestoneDate > targetDateStr) {
            Alert.alert("Invalid Date", `Milestone date cannot be after the goal target date (${targetDateStr}).`);
            return;
        }

        // Validation 2: Chronological Order
        if (newMilestoneDate && milestones.length > 0) {
            const lastMilestone = milestones[milestones.length - 1];
            if (lastMilestone.targetDate && newMilestoneDate <= lastMilestone.targetDate) {
                Alert.alert("Chronology Error", "Milestones must be strictly chronological (after the previous one).");
                return;
            }
        }

        setMilestones([...milestones, {
            title: newMilestone.trim(),
            targetDate: newMilestoneDate || undefined,
            description: newMilestoneDesc.trim() || undefined
        }]);

        setNewMilestone('');
        setNewMilestoneDate('');
        setNewMilestoneDesc('');
    };

    const removeMilestone = (idx: number) => {
        setMilestones(milestones.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Required", "Goal title is required.");
            return;
        }

        // Final Safety Check
        if (targetDateStr && milestones.length > 0) {
            for (const m of milestones) {
                if (m.targetDate && m.targetDate > targetDateStr) {
                    Alert.alert("Error", `Milestone "${m.title}" cannot be after the goal deadline (${targetDateStr}).`);
                    return;
                }
            }
        }

        for (let i = 0; i < milestones.length - 1; i++) {
            const current = milestones[i];
            const next = milestones[i + 1];
            if (current.targetDate && next.targetDate) {
                if (current.targetDate >= next.targetDate) {
                    Alert.alert("Error", `Milestone "${current.title}" must come before "${next.title}".`);
                    return;
                }
            }
        }

        await addGoal({
            title: title.trim(),
            targetDate: targetDateStr || undefined,
            startDate: new Date().toISOString(),
            milestones: milestones.map(m => ({
                title: m.title,
                targetDate: m.targetDate,
                description: m.description,
                completed: false,
                notes: "",
                resources: []
            }))
        });

        // Reset
        setTitle('');
        setTargetDateStr('');
        setMilestones([]);
        setNewMilestone('');
        setNewMilestoneDate('');
        setNewMilestoneDesc('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>New Goal</Text>
                    <Pressable onPress={onClose} style={s.closeBtn}>
                        <X size={24} color="#666" />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={s.form} automaticallyAdjustKeyboardInsets>
                    <Text style={s.helpText}>Define your goal and break it down into milestones.</Text>

                    {/* Top Level Goal Inputs */}
                    <View style={s.topInputsContainer}>
                        <View style={s.inputGroupRow}>
                            <Text style={s.labelInline}>Goal</Text>
                            <TextInput
                                style={[s.input, s.inputFlex]}
                                placeholder="e.g. Launch Product"
                                placeholderTextColor="#666"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                        <View style={s.inputGroupRow}>
                            <Text style={s.labelInline}>Target</Text>
                            <Pressable
                                style={[s.input, s.inputFlex, { justifyContent: 'center' }]}
                                onPress={() => setShowGoalDatePicker(true)}
                            >
                                <Text style={{ color: targetDateStr ? '#fff' : '#666', fontSize: 15 }}>
                                    {targetDateStr ? targetDateStr : 'Select Date'}
                                </Text>
                            </Pressable>

                        </View>
                        {showGoalDatePicker && (
                            <View style={s.datePickerContainer}>
                                <DateTimePicker
                                    value={targetDateStr ? new Date(targetDateStr) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                    themeVariant="dark"
                                    onChange={(event, selectedDate) => {
                                        if (Platform.OS === 'android') setShowGoalDatePicker(false);
                                        if (selectedDate) setTargetDateStr(format(selectedDate, 'yyyy-MM-dd'));
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <BrutalistButton
                                        bgColor="#333" textColor="#fff"
                                        style={{ marginTop: 8 }}
                                        onPress={() => setShowGoalDatePicker(false)}
                                    >
                                        Done
                                    </BrutalistButton>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Milestones Array */}
                    <View style={s.milestonesSection}>
                        <Text style={s.sectionTitle}>Milestones</Text>

                        {/* Adder Form */}
                        <View style={s.adderBox}>
                            <View style={s.adderTopRow}>
                                <TextInput
                                    style={[s.input, s.adderInputTitle]}
                                    placeholder="Milestone title..."
                                    placeholderTextColor="#666"
                                    value={newMilestone}
                                    onChangeText={setNewMilestone}
                                />
                                <Pressable
                                    style={[s.input, s.adderInputDate, { justifyContent: 'center', paddingVertical: 10 }]}
                                    onPress={() => setShowMilestoneDatePicker(true)}
                                >
                                    <Text style={{ color: newMilestoneDate ? '#fff' : '#666', fontSize: 13 }} numberOfLines={1}>
                                        {newMilestoneDate ? newMilestoneDate : 'Date (Opt)'}
                                    </Text>
                                </Pressable>

                            </View>

                            {showMilestoneDatePicker && (
                                <View style={s.datePickerContainer}>
                                    <DateTimePicker
                                        value={newMilestoneDate ? new Date(newMilestoneDate) : new Date()}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        themeVariant="dark"
                                        onChange={(event, selectedDate) => {
                                            if (Platform.OS === 'android') setShowMilestoneDatePicker(false);
                                            if (selectedDate) setNewMilestoneDate(format(selectedDate, 'yyyy-MM-dd'));
                                        }}
                                    />
                                    {Platform.OS === 'ios' && (
                                        <BrutalistButton
                                            bgColor="#333" textColor="#fff"
                                            style={{ marginTop: 8 }}
                                            onPress={() => setShowMilestoneDatePicker(false)}
                                        >
                                            Done
                                        </BrutalistButton>
                                    )}
                                </View>
                            )}
                            <TextInput
                                style={[s.input, s.adderInputDesc]}
                                placeholder="Notes/description (optional)..."
                                placeholderTextColor="#666"
                                multiline
                                value={newMilestoneDesc}
                                onChangeText={setNewMilestoneDesc}
                            />
                            <Pressable style={s.addMilestoneBtn} onPress={handleAddMilestone}>
                                <Plus size={16} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={s.addMilestoneLbl}>Add Milestone</Text>
                            </Pressable>
                        </View>

                        {/* List View */}
                        <View style={s.milestonesList}>
                            {milestones.length === 0 && (
                                <Text style={s.noMilestonesText}>No milestones added.</Text>
                            )}
                            {milestones.map((m, idx) => (
                                <View key={idx} style={s.milestoneItem}>
                                    <View style={s.milestoneItemLeft}>
                                        <Text style={s.milestoneItemTitle}>{m.title}</Text>
                                        {m.description && <Text style={s.milestoneItemDesc} numberOfLines={1}>{m.description}</Text>}
                                        {m.targetDate && <Text style={s.milestoneItemDate}>Due: {m.targetDate}</Text>}
                                    </View>
                                    <Pressable onPress={() => removeMilestone(idx)} hitSlop={10} style={s.trashBtn}>
                                        <X size={16} color="#ef4444" />
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        style={{ marginTop: 32 }}
                        onPress={handleSubmit}
                    >
                        Create Goal
                    </BrutalistButton>
                </ScrollView>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        backgroundColor: '#151515',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    closeBtn: {
        padding: 4,
    },
    form: {
        padding: 20,
        paddingBottom: 40,
    },
    helpText: {
        color: '#888',
        fontSize: 14,
        marginBottom: 24,
    },
    topInputsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    inputGroupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    labelInline: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
        width: 60,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 14,
        color: '#fff',
        fontSize: 15,
    },
    inputFlex: {
        flex: 1,
    },
    milestonesSection: {
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    adderBox: {
        backgroundColor: '#151515',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 8,
        padding: 12,
        gap: 8,
    },
    adderTopRow: {
        flexDirection: 'row',
        gap: 8,
    },
    adderInputTitle: {
        flex: 2,
    },
    adderInputDate: {
        flex: 1,
        fontSize: 13,
        padding: 10,
    },
    adderInputDesc: {
        minHeight: 60,
        textAlignVertical: 'top',
        fontSize: 13,
        padding: 10,
    },
    addMilestoneBtn: {
        backgroundColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 6,
        marginTop: 4,
    },
    addMilestoneLbl: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    milestonesList: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        padding: 12,
        maxHeight: 250,
    },
    noMilestonesText: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        paddingVertical: 10,
    },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222',
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    milestoneItemLeft: {
        flex: 1,
        paddingRight: 10,
        gap: 2,
    },
    milestoneItemTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    milestoneItemDesc: {
        color: '#666',
        fontSize: 12,
    },
    milestoneItemDate: {
        color: '#3b82f6',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    trashBtn: {
        padding: 4,
        marginTop: -4,
        marginRight: -4,
    },
    datePickerContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden'
    }
});
