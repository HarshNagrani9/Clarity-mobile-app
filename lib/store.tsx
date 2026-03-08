import React, { createContext, useContext, useState, useEffect } from "react";
import { Habit, Goal, Task, CalendarEvent, UserProfile } from "./types";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { calculateStreak } from './streak';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface AppState {
    habits: Habit[];
    goals: Goal[];
    tasks: Task[];
    events: CalendarEvent[];
    userProfile: UserProfile | null;
    recentActivities: { id: number, type: string, description: string, createdAt: string }[];
    isLoadingData: boolean;
    refreshData: () => Promise<void>;
    addHabit: (habit: Omit<Habit, "id" | "streak" | "completedDates">) => Promise<void>;
    toggleHabit: (id: number, dateStr?: string) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    logActivity: (type: string, description: string) => Promise<void>;
    addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'progress'>) => Promise<void>;
    updateGoal: (id: number, updates: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: number) => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'completed' | 'progress'>) => Promise<void>;
    toggleTask: (id: number) => Promise<void>;
    updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [recentActivities, setRecentActivities] = useState<{ id: number, type: string, description: string, createdAt: string }[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const authFetch = async (endpoint: string, options: RequestInit = {}, explicitToken?: string) => {
        const token = explicitToken || await auth.currentUser?.getIdToken();
        const headers = {
            ...options.headers,
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        } as HeadersInit;
        return fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setUserProfile({ uid: user.uid, email: user.email || "", displayName: user.displayName || undefined });

                const token = await user.getIdToken();
                await fetchData(user.uid, token);
            } else {
                setUserId(null);
                setUserProfile(null);
                setHabits([]);
                setGoals([]);
                setTasks([]);
                setEvents([]);
                setRecentActivities([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async (uid: string, token?: string) => {
        setIsLoadingData(true);
        try {
            const [habitsRes, goalsRes, tasksRes, activitiesRes, eventsRes] = await Promise.all([
                authFetch(`/api/habits?userId=${uid}`, {}, token),
                authFetch(`/api/goals?userId=${uid}`, {}, token),
                authFetch(`/api/tasks?userId=${uid}`, {}, token),
                authFetch(`/api/activities?userId=${uid}`, {}, token),
                authFetch(`/api/events?userId=${uid}`, {}, token)
            ]);

            if (habitsRes.ok) setHabits(await habitsRes.json());
            if (goalsRes.ok) setGoals(await goalsRes.json());
            if (tasksRes.ok) setTasks(await tasksRes.json());
            if (activitiesRes.ok) setRecentActivities(await activitiesRes.json());
            if (eventsRes.ok) setEvents(await eventsRes.json());

            // Also fetch profile preferences
            const profileRes = await authFetch('/api/users/profile', {}, token);
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setUserProfile(prev => prev ? { ...prev, ...profileData } : profileData);
            }
        } catch (error) {
            console.error("Failed to fetch data in mobile store", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const refreshData = async () => {
        if (userId) {
            await fetchData(userId);
        }
    };

    const logActivity = async (type: string, description: string) => {
        // Optimistic update
        const newActivity = { id: Date.now(), type, description, createdAt: new Date().toISOString() };
        setRecentActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep top 10

        if (userId) {
            try {
                await authFetch('/api/activities', {
                    method: 'POST',
                    body: JSON.stringify({ userId, type, description }),
                });
                await fetchData(userId); // Refresh strictly to get exact DB rows
            } catch (e) {
                console.error("Failed to log activity remotely", e);
            }
        }
    };

    const addHabit = async (habit: Omit<Habit, "id" | "streak" | "completedDates">) => {
        const tempId = Date.now();
        const newHabit = { ...habit, id: tempId, streak: 0, completedDates: [] };
        setHabits(prev => [...prev, newHabit]);

        if (userId) {
            try {
                const res = await authFetch('/api/habits', {
                    method: 'POST',
                    body: JSON.stringify({ ...habit, userId }),
                });
                if (res.ok) {
                    const createdHabit = await res.json();
                    setHabits(prev => prev.map(h => h.id === tempId ? createdHabit : h));
                    logActivity('habit', `Started new habit: ${createdHabit.title}`);
                }
            } catch (error) {
                console.error("Failed to persist new habit", error);
            }
        } else {
            logActivity('habit', `Started new habit: ${newHabit.title} (Guest)`);
        }
    };

    const toggleHabit = async (id: number, dateStr?: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const targetDate = dateStr || new Date().toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(targetDate);

        let newCompletedDates;
        if (isCompleted) {
            newCompletedDates = habit.completedDates.filter(d => d !== targetDate);
        } else {
            newCompletedDates = [...habit.completedDates, targetDate];
        }

        const newStreak = calculateStreak(newCompletedDates);
        const updates = { completedDates: newCompletedDates, streak: newStreak };

        setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

        if (!isCompleted) {
            logActivity('habit', `Completed habit: ${habit.title}`);
        }

        if (userId) {
            try {
                await authFetch(`/api/habits/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ ...updates, toggleDate: targetDate, userId: userId }),
                });
            } catch (e) {
                console.error("Failed to update habit remotely", e);
            }
        }
    };

    const deleteHabit = async (id: number) => {
        setHabits(prev => prev.filter(h => h.id !== id));
        if (userId) {
            try {
                await authFetch(`/api/habits/${id}`, { method: 'DELETE' });
            } catch (e) {
                console.error("Failed to delete habit remotely", e);
            }
        }
    };

    const addGoal = async (goal: Omit<Goal, 'id' | 'completed' | 'progress'>) => {
        const tempId = Date.now();
        const newGoal: Goal = {
            ...goal,
            id: tempId,
            completed: false,
            progress: 0,
            milestones: goal.milestones || []
        };
        setGoals(prev => [newGoal, ...prev]);
        if (userId) {
            try {
                const res = await authFetch('/api/goals', {
                    method: 'POST',
                    body: JSON.stringify({ ...goal, userId })
                });
                if (res.ok) {
                    const createdGoal = await res.json();
                    setGoals(prev => prev.map(g => g.id === tempId ? createdGoal : g));
                    logActivity('Goal Added', `You added a new goal: ${createdGoal.title}`);
                }
            } catch (e) { console.error("Error adding goal", e); }
        }
    };

    const updateGoal = async (id: number, updates: Partial<Goal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        if (updates.completed) {
            const goal = goals.find(g => g.id === id);
            if (goal) logActivity('goal', `Completed goal: ${goal.title}`);
        }
        if (userId) {
            try {
                await authFetch(`/api/goals/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(updates)
                });
            } catch (e) { console.error("Error updating goal", e); }
        }
    };

    const deleteGoal = async (id: number) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        if (userId) {
            try {
                await authFetch(`/api/goals/${id}`, {
                    method: 'DELETE'
                });
                logActivity('Goal Deleted', `You deleted a goal.`);
            } catch (e) { console.error("Error deleting goal", e); }
        }
    };

    const addTask = async (task: Omit<Task, 'id' | 'completed' | 'progress'>) => {
        const tempId = Date.now();
        const newTask: Task = { ...task, id: tempId, completed: false, progress: 0 };
        setTasks(prev => [newTask, ...prev]);

        if (userId) {
            try {
                const res = await authFetch('/api/tasks', {
                    method: 'POST',
                    body: JSON.stringify({ ...task, userId })
                });
                if (res.ok) {
                    const createdTask = await res.json();
                    setTasks(prev => prev.map(t => t.id === tempId ? createdTask : t));
                    logActivity('Task Added', `You added a new task: ${createdTask.title}`);
                }
            } catch (e) {
                console.error("Failed to add task", e);
            }
        }
    };

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newCompletedStat = !task.completed;
        const newProgress = newCompletedStat ? 100 : 0;

        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompletedStat, progress: newProgress } : t));
        if (newCompletedStat) logActivity('Task Completed', `You completed task: ${task.title}`);

        if (userId) {
            try {
                await authFetch(`/api/tasks/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ completed: newCompletedStat, progress: newProgress })
                });
            } catch (e) {
                console.error("Failed to toggle task", e);
            }
        }
    };

    const updateTask = async (id: number, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        if (userId) {
            try {
                await authFetch(`/api/tasks/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(updates)
                });
            } catch (e) {
                console.error("Failed to update task", e);
            }
        }
    };

    const deleteTask = async (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (userId) {
            try {
                await authFetch(`/api/tasks/${id}`, { method: 'DELETE' });
            } catch (e) {
                console.error("Failed to delete task", e);
            }
        }
    };

    return (
        <AppContext.Provider value={{
            habits, goals, tasks, userProfile, recentActivities, events, isLoadingData, refreshData,
            addHabit, toggleHabit, deleteHabit, logActivity,
            addGoal, updateGoal, deleteGoal,
            addTask, toggleTask, updateTask, deleteTask
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
