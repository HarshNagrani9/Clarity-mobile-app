import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Target, ListTodo, Calendar, Activity } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import HabitsScreen from '../screens/HabitsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import TasksScreen from '../screens/TasksScreen';
import CalendarScreen from '../screens/CalendarScreen';

export type MainTabParamList = {
    Dashboard: undefined;
    Habits: undefined;
    Goals: undefined;
    Tasks: undefined;
    Calendar: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0a0a0a',
                    borderTopColor: '#222',
                    height: 85, // Increased height to account for safe area
                    paddingBottom: 30, // Pushed up from the very bottom edge
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#a3e635',
                tabBarInactiveTintColor: '#666',
                tabBarLabelStyle: {
                    fontFamily: 'monospace',
                    fontSize: 10,
                    fontWeight: '800',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Habits"
                component={HabitsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Tasks"
                component={TasksScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ListTodo size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
