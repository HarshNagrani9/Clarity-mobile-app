import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Switch } from 'react-native';
import { BrutalistButton } from '../ui/BrutalistButton';
import { X } from 'lucide-react-native';
import { useApp } from '../../lib/store';

interface AddHabitModalProps {
    visible: boolean;
    onClose: () => void;
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#ef4444', // red
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
];

export function AddHabitModal({ visible, onClose }: AddHabitModalProps) {
    const { addHabit } = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [color, setColor] = useState(COLORS[0]);

    const handleSave = async () => {
        if (!title.trim()) return;

        await addHabit({
            title: title.trim(),
            description: description.trim() || undefined,
            frequency,
            color,
            startDate: new Date().toISOString()
        });

        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>New Habit</Text>
                    <Pressable onPress={onClose} style={s.closeBtn}>
                        <X size={24} color="#666" />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={s.form}>
                    <View style={s.inputGroup}>
                        <Text style={s.label}>Habit Name</Text>
                        <TextInput
                            style={s.input}
                            placeholder="e.g. Read 10 Pages"
                            placeholderTextColor="#666"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Description (Optional)</Text>
                        <TextInput
                            style={[s.input, s.textArea]}
                            placeholder="Why is this important?"
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Frequency</Text>
                        <View style={s.frequencyRow}>
                            <Pressable
                                style={[s.freqBtn, frequency === 'daily' && s.freqBtnActive]}
                                onPress={() => setFrequency('daily')}
                            >
                                <Text style={[s.freqText, frequency === 'daily' && s.freqTextActive]}>Daily</Text>
                            </Pressable>
                            <Pressable
                                style={[s.freqBtn, frequency === 'weekly' && s.freqBtnActive]}
                                onPress={() => setFrequency('weekly')}
                            >
                                <Text style={[s.freqText, frequency === 'weekly' && s.freqTextActive]}>Weekly</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Color Marker</Text>
                        <View style={s.colorRow}>
                            {COLORS.map((c) => (
                                <Pressable
                                    key={c}
                                    style={[s.colorCircle, { backgroundColor: c }, color === c && s.colorCircleActive]}
                                    onPress={() => setColor(c)}
                                />
                            ))}
                        </View>
                    </View>

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        style={{ marginTop: 24, width: '100%' }}
                        onPress={handleSave}
                    >
                        Save Habit
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
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    frequencyRow: {
        flexDirection: 'row',
        gap: 12,
    },
    freqBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
    },
    freqBtnActive: {
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.1)',
    },
    freqText: {
        color: '#888',
        fontWeight: 'bold',
    },
    freqTextActive: {
        color: '#a3e635',
    },
    colorRow: {
        flexDirection: 'row',
        gap: 16,
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorCircleActive: {
        borderColor: '#fff',
    }
});
