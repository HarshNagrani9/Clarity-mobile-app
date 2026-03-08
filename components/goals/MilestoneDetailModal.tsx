import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Linking } from 'react-native';
import { Goal } from '../../lib/types';
import { BrutalistButton } from '../ui/BrutalistButton';
import { X, ExternalLink, Plus } from 'lucide-react-native';

interface MilestoneDetailModalProps {
    goal: Goal;
    milestoneIndex: number;
    visible: boolean;
    onClose: () => void;
    onUpdate: (id: number, updates: Partial<Goal>) => void;
}

export function MilestoneDetailModal({ goal, milestoneIndex, visible, onClose, onUpdate }: MilestoneDetailModalProps) {
    const milestone = goal.milestones[milestoneIndex] || { title: "", completed: false };

    const [title, setTitle] = useState(milestone.title);
    const [description, setDescription] = useState(milestone.description || "");
    const [notes, setNotes] = useState(milestone.notes || "");
    const [resources, setResources] = useState<{ title: string; url: string }[]>(milestone.resources || []);

    const [newResTitle, setNewResTitle] = useState("");
    const [newResUrl, setNewResUrl] = useState("");

    // Reset when changing selected index
    useEffect(() => {
        if (visible && goal.milestones[milestoneIndex]) {
            const m = goal.milestones[milestoneIndex];
            setTitle(m.title || "");
            setDescription(m.description || "");
            setNotes(m.notes || "");
            setResources(m.resources || []);
        }
    }, [visible, milestoneIndex, goal.milestones]);

    const handleSave = () => {
        const newMilestones = [...goal.milestones];
        newMilestones[milestoneIndex] = {
            ...newMilestones[milestoneIndex],
            title,
            description,
            notes,
            resources
        };

        onUpdate(goal.id, { milestones: newMilestones });
        onClose();
    };

    const addResource = () => {
        if (newResTitle.trim() && newResUrl.trim()) {
            setResources([...resources, { title: newResTitle.trim(), url: newResUrl.trim() }]);
            setNewResTitle("");
            setNewResUrl("");
        }
    };

    const removeResource = (idx: number) => {
        setResources(resources.filter((_, i) => i !== idx));
    };

    const handleLinkOpen = (url: string) => {
        let fullUrl = url;
        if (!fullUrl.startsWith('http')) {
            fullUrl = `https://${url}`;
        }
        Linking.openURL(fullUrl).catch(err => console.error("An error occurred", err));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={s.container}>
                <View style={s.header}>
                    <View style={s.headerLeft}>
                        <Text style={s.headerTitle} numberOfLines={1}>{title || "Milestone Details"}</Text>
                        {milestone.completed && (
                            <View style={s.completedBadge}>
                                <Text style={s.completedText}>Completed</Text>
                            </View>
                        )}
                    </View>
                    <Pressable onPress={onClose} style={s.closeBtn}>
                        <X size={24} color="#666" />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={s.form} automaticallyAdjustKeyboardInsets>
                    <Text style={s.helpText}>Manage details, notes, and resources for this specific milestone.</Text>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Title</Text>
                        <TextInput
                            style={s.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Description (Overview)</Text>
                        <TextInput
                            style={[s.input, s.textAreaSmall]}
                            placeholder="What is this milestone about?"
                            placeholderTextColor="#666"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={s.inputGroup}>
                        <Text style={s.label}>Status Notes & Updates</Text>
                        <TextInput
                            style={[s.input, s.textAreaLarge]}
                            placeholder="Track your progress, thoughts, or blockers here..."
                            placeholderTextColor="#666"
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    <View style={s.resourcesSection}>
                        <Text style={s.label}>Resources & Links</Text>
                        <View style={s.resourceInputRow}>
                            <TextInput
                                style={[s.input, s.resourceInputFlex]}
                                placeholder="Link Title"
                                placeholderTextColor="#666"
                                value={newResTitle}
                                onChangeText={setNewResTitle}
                            />
                            <TextInput
                                style={[s.input, s.resourceInputFlex]}
                                placeholder="URL"
                                placeholderTextColor="#666"
                                value={newResUrl}
                                onChangeText={setNewResUrl}
                                autoCapitalize="none"
                            />
                            <Pressable style={s.addResourceBtn} onPress={addResource}>
                                <Plus size={20} color="#000" />
                            </Pressable>
                        </View>

                        <View style={s.resourceList}>
                            {resources.length === 0 ? (
                                <Text style={s.noResText}>No resources added.</Text>
                            ) : (
                                resources.map((res, idx) => (
                                    <View key={idx} style={s.resourceItem}>
                                        <Pressable style={s.resourceLink} onPress={() => handleLinkOpen(res.url)}>
                                            <ExternalLink size={14} color="#3b82f6" />
                                            <Text style={s.resourceLinkText} numberOfLines={1}>{res.title}</Text>
                                        </Pressable>
                                        <Pressable onPress={() => removeResource(idx)} hitSlop={10} style={{ padding: 4 }}>
                                            <X size={14} color="#ef4444" />
                                        </Pressable>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>

                    <BrutalistButton
                        bgColor="#a3e635"
                        textColor="#000"
                        style={{ marginTop: 24 }}
                        onPress={handleSave}
                    >
                        Save Details
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
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingRight: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    completedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.4)',
    },
    completedText: {
        color: '#4ade80',
        fontSize: 10,
        fontWeight: 'bold',
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
    inputGroup: {
        marginBottom: 20,
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
        padding: 14,
        color: '#fff',
        fontSize: 15,
    },
    textAreaSmall: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    textAreaLarge: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    resourcesSection: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: 20,
    },
    resourceInputRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    resourceInputFlex: {
        flex: 1,
        padding: 12,
    },
    addResourceBtn: {
        backgroundColor: '#a3e635',
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resourceList: {
        marginTop: 16,
        gap: 8,
    },
    noResText: {
        color: '#666',
        fontSize: 12,
        fontStyle: 'italic',
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    resourceLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        paddingRight: 16,
    },
    resourceLinkText: {
        color: '#3b82f6',
        fontSize: 14,
    }
});
