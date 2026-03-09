import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SignupSuccessScreen from './screens/SignupSuccessScreen';
import LoginSuccessScreen from './screens/LoginSuccessScreen';
import ActivityLogScreen from './screens/ActivityLogScreen';
import MainTabs from './navigation/MainTabs';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { View, Platform, StatusBar } from 'react-native';
import { AppProvider, useApp } from './lib/store';
import { ModernLoader } from './components/ui/ModernLoader';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    SignupSuccess: undefined;
    LoginSuccess: undefined;
    Main: undefined; // The bottom tabs navigator
    ActivityLog: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

function AppContent() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const { isLoadingData } = useApp();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });
        return unsubscribe;
    }, [initializing]);

    if (initializing || (user && isLoadingData)) {
        return <ModernLoader />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? "Main" : "Login"}
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0f0f0f' },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="SignupSuccess" component={SignupSuccessScreen} />
                <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="ActivityLog" component={ActivityLogScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
