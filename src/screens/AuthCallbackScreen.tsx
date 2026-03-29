import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts';
import { navigateToLogin, navigateToMain } from '../navigation/navigationRef';

export function AuthCallbackScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigateToMain();
    } else {
      navigateToLogin();
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🇰🇪</Text>
      <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />
      <Text style={styles.title}>Completing sign in...</Text>
      <Text style={styles.subtitle}>Please wait while we set up your account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  spinner: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280' },
});
