import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useApp } from '../lib/store';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { Plus } from 'lucide-react-native';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskModal } from '../components/tasks/AddTaskModal';

export function TasksScreen() {
    const { tasks, toggleTask, updateTask, deleteTask } = useApp();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [isAddingTask, setIsAddingTask] = useState(false);

    const activeTasks = tasks.filter(t => !t.completed).sort((a, b) => {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return timeA - timeB;
    });
    const completedTasks = tasks.filter(t => t.completed);

    const highPriorityCount = activeTasks.filter(t => t.priority === 'high').length;
    const mediumPriorityCount = activeTasks.filter(t => t.priority === 'medium').length;
    const lowPriorityCount = activeTasks.filter(t => t.priority === 'low').length;

    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Tasks</Text>
                    <Text style={s.headerSubtitle}>Manage your daily to-dos.</Text>
                </View>
                <BrutalistButton
                    onPress={() => setIsAddingTask(true)}
                    bgColor="#a3e635"
                    textColor="#000"
                    style={s.addBtn}
                >
                    <Plus size={16} color="#000" style={{ marginRight: 6 }} />
                    New Task
                </BrutalistButton>
            </View>

            {/* Content Body */}
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

                {/* Priority Breakdown (Active only) */}
                {activeTab === 'active' && activeTasks.length > 0 && (
                    <View style={s.priorityBox}>
                        <Text style={s.priorityBoxTitle}>Priority</Text>
                        <View style={s.priorityRow}>
                            <View style={s.priorityStat}>
                                <Text style={[s.prioNum, { color: '#ef4444' }]}>{highPriorityCount}</Text>
                                <Text style={s.prioLabel}>High</Text>
                            </View>
                            <View style={s.priorityStat}>
                                <Text style={[s.prioNum, { color: '#f59e0b' }]}>{mediumPriorityCount}</Text>
                                <Text style={s.prioLabel}>Medium</Text>
                            </View>
                            <View style={s.priorityStat}>
                                <Text style={[s.prioNum, { color: '#3b82f6' }]}>{lowPriorityCount}</Text>
                                <Text style={s.prioLabel}>Low</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Tab Switcher */}
                <View style={s.tabContainer}>
                    <Pressable
                        style={[s.tabBtn, activeTab === 'active' && s.tabBtnActive]}
                        onPress={() => setActiveTab('active')}
                    >
                        <Text style={[s.tabText, activeTab === 'active' && s.tabTextActive]}>
                            Active ({activeTasks.length})
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[s.tabBtn, activeTab === 'completed' && s.tabBtnActive]}
                        onPress={() => setActiveTab('completed')}
                    >
                        <Text style={[s.tabText, activeTab === 'completed' && s.tabTextActive]}>
                            Completed ({completedTasks.length})
                        </Text>
                    </Pressable>
                </View>

                {/* List View */}
                {activeTab === 'active' ? (
                    <View style={s.list}>
                        {activeTasks.length > 0 ? (
                            activeTasks.map(task => (
                                <TaskCard key={task.id} task={task} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />
                            ))
                        ) : (
                            <Text style={s.emptyText}>No active tasks. Good job!</Text>
                        )}
                    </View>
                ) : (
                    <View style={s.list}>
                        {completedTasks.length > 0 ? (
                            completedTasks.map(task => (
                                <TaskCard key={task.id} task={task} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />
                            ))
                        ) : (
                            <Text style={s.emptyText}>No completed tasks yet.</Text>
                        )}
                    </View>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>

            <AddTaskModal
                visible={isAddingTask}
                onClose={() => setIsAddingTask(false)}
            />
        </View>
    );
}

// Keeping the older default export so navigation doesn't instantly crash
export default TasksScreen;

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
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
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    addBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    priorityBox: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    priorityBoxTitle: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 1,
    },
    priorityRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    priorityStat: {
        alignItems: 'center',
    },
    prioNum: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    prioLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        padding: 4,
        borderRadius: 8,
        marginBottom: 20,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    tabBtnActive: {
        backgroundColor: '#333',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#fff',
    },
    list: {
        gap: 12,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
        fontStyle: 'italic',
    }
});
