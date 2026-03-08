import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Platform, Alert } from 'react-native';
import { BrutalistButton } from '../ui/BrutalistButton';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Goal } from '../../lib/types';

interface AddMilestoneModalProps {
    visible: boolean;
    goal: Goal;
    onClose: () => void;
    onAdd: (newMilestone: any) => void;
}

export function AddMilestoneModal({ visible, goal, onClose, onAdd }: AddMilestoneModalProps) {
    const [title, setTitle] = useState('');
    const [targetDateStr, setTargetDateStr] = useState('');
    const [description, setDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert("Required", "Milestone title is required.");
            return;
        }

        // Validate date
        if (goal.targetDate && targetDateStr && targetDateStr > goal.targetDate) {
            Alert.alert("Invalid Date", `Milestone date cannot be after the goal target date (${goal.targetDate}).`);
            return;
        }

        // Validate chronology with existing milestones (must be appended)
        if (goal.milestones.length > 0 && targetDateStr) {
            const lastMilestone = goal.milestones[goal.milestones.length - 1];
            if (lastMilestone.targetDate && targetDateStr <= lastMilestone.targetDate) {
                Alert.alert("Date Error", "New milestones should logically follow the previous milestones timeline.");
                return;
            }
        }

        const newMilestone = {
            title: title.trim(),
            targetDate: targetDateStr || undefined,
            description: description.trim() || undefined,
            completed: false,
            notes: "",
            resources: []
        };

        onAdd(newMilestone);

        // Reset
        setTitle('');
        setTargetDateStr('');
        setDescription('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>Add Milestone</Text>
                    <Pressable onPress={onClose} style={s.closeBtn}>
                        <X size={24} color="#666" />
                    </Pressable>
                </View>

                <View style={s.form}>
                    <Text style={s.helpText}>Add a new step to "{goal.title}".</Text>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Milestone Title</Text>
                        <TextInput
                            style={s.input}
                            placeholder="e.g. Design mockup"
                            placeholderTextColor="#666"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Target Date (Optional)</Text>
                        <Pressable
                            style={[s.input, { justifyContent: 'center' }]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: targetDateStr ? '#fff' : '#666', fontSize: 15 }}>
                                {targetDateStr ? targetDateStr : 'Select Date...'}
                            </Text>
                        </Pressable>

                        {showDatePicker && (
                            <View style={s.datePickerContainer}>
                                <DateTimePicker
                                    value={targetDateStr ? new Date(targetDateStr) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                    themeVariant="dark"
                                    onChange={(event, selectedDate) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (selectedDate) setTargetDateStr(format(selectedDate, 'yyyy-MM-dd'));
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <BrutalistButton
                                        bgColor="#333" textColor="#fff"
                                        style={{ marginTop: 8 }}
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        Done
                                    </BrutalistButton>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Description (Optional)</Text>
                        <TextInput
                            style={[s.input, s.textArea]}
                            placeholder="Brief description..."
                            placeholderTextColor="#666"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        style={{ marginTop: 16 }}
                        onPress={handleSubmit}
                    >
                        Append Milestone
                    </BrutalistButton>
                </View>
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
    },
    helpText: {
        color: '#888',
        fontSize: 14,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
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
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
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
