import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Platform, Alert, StatusBar } from 'react-native';
import { BrutalistButton } from '../ui/BrutalistButton';
import { X, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useApp } from '../../lib/store';

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
}

export function AddTaskModal({ visible, onClose }: AddTaskModalProps) {
    const { addTask } = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [dueDateStr, setDueDateStr] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Required", "Task title is required.");
            return;
        }

        try {
            await addTask({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                dueDate: dueDateStr || undefined,
            });

            // Reset and close
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDateStr('');
            onClose();
        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to add task");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>New Task</Text>
                    <Pressable onPress={onClose} style={s.closeBtn}>
                        <X size={24} color="#666" />
                    </Pressable>
                </View>

                <View style={s.form}>
                    <View style={s.inputGroup}>
                        <Text style={s.label}>Task Title</Text>
                        <TextInput
                            style={s.input}
                            placeholder="e.g. Finish the presentation"
                            placeholderTextColor="#666"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Priority</Text>
                        <View style={s.priorityContainer}>
                            {(['low', 'medium', 'high'] as const).map(p => (
                                <Pressable
                                    key={p}
                                    style={[
                                        s.priorityBtn,
                                        priority === p && s.priorityBtnActive,
                                        priority === p && p === 'high' && { borderColor: '#ef4444' },
                                        priority === p && p === 'medium' && { borderColor: '#f59e0b' },
                                        priority === p && p === 'low' && { borderColor: '#3b82f6' }
                                    ]}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text style={[
                                        s.priorityText,
                                        priority === p && s.priorityTextActive,
                                        priority === p && p === 'high' && { color: '#ef4444' },
                                        priority === p && p === 'medium' && { color: '#f59e0b' },
                                        priority === p && p === 'low' && { color: '#3b82f6' }
                                    ]}>
                                        {p.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Due Date (Optional)</Text>
                        <Pressable
                            style={[s.input, s.dateBtn]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Calendar size={16} color={dueDateStr ? '#a3e635' : '#666'} />
                            <Text style={{ color: dueDateStr ? '#fff' : '#666', fontSize: 15 }}>
                                {dueDateStr ? format(new Date(dueDateStr), 'MMM dd, yyyy') : 'Select Date...'}
                            </Text>
                        </Pressable>

                        {showDatePicker && (
                            <View style={s.datePickerWrapper}>
                                <DateTimePicker
                                    value={dueDateStr ? new Date(dueDateStr) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                    themeVariant="dark"
                                    onChange={(event, selectedDate) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (selectedDate) setDueDateStr(format(selectedDate, 'yyyy-MM-dd'));
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

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        style={{ marginTop: 24 }}
                        onPress={handleSubmit}
                    >
                        Create Task
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
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
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
    inputGroup: {
        marginBottom: 20,
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
    priorityContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
    },
    priorityBtnActive: {
        backgroundColor: '#222',
        borderWidth: 2,
    },
    priorityText: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
    },
    priorityTextActive: {
        color: '#fff',
    },
    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    datePickerWrapper: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden'
    }
});
