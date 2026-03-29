import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { MobileLayout } from '../components/MobileLayout';
import { HomeScreen } from '../screens/HomeScreen';
import { TranslateScreen } from '../screens/TranslateScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { AuthCallbackScreen } from '../screens/AuthCallbackScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

const ONBOARDING_KEY = 'edubridge_onboarding_complete';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MobileLayout {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Translate" component={TranslateScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.loadingLogo, { backgroundColor: colors.accent }]}>
        <Text style={styles.loadingLogoText}>E</Text>
      </View>
      <Text style={[styles.loadingTitle, { color: colors.textPrimary }]}>EduBridge</Text>
      <ActivityIndicator size="small" color={colors.accent} style={styles.spinner} />
    </View>
  );
}

export function RootNavigator() {
  const { loading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setShowOnboarding(value !== 'true');
    });
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  if (loading || showOnboarding === null) {
    return <LoadingScreen />;
  }

  if (showOnboarding) {
    return <WelcomeScreen onComplete={completeOnboarding} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Admin" component={AdminDashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingLogoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  spinner: {
    marginTop: 16,
  },
});
