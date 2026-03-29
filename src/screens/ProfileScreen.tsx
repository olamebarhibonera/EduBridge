import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { ThemeSelector } from '../components/ThemeSelector';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, loading, signOut } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  useEffect(() => {
    if (!loading && !user) {
      navigation.replace('Login');
    }
  }, [loading, user, navigation]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bgPrimary }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (!user) return null;

  const userData = {
    name: user.user_metadata?.name ?? 'Student Name',
    email: user.email ?? '',
    phone: user.user_metadata?.phone ?? '+254 712 345 678',
    university: user.user_metadata?.university ?? 'University of Nairobi',
    course: user.user_metadata?.course ?? 'Computer Science',
    studentId: user.user_metadata?.student_id ?? 'STU2026001',
    country: user.user_metadata?.country ?? 'International Student',
    arrivalDate: user.user_metadata?.arrival_date ?? 'Jan 15, 2026',
  };

  const isAdmin = user.email?.includes('admin');

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('Login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your account and preferences</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {userData.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileId}>{userData.studentId}</Text>
        <View style={styles.profileMeta}>
          <Text style={styles.profileMetaText}>{userData.course} • {userData.university}</Text>
          <Text style={styles.profileMetaText}>From {userData.country}</Text>
          <Text style={styles.profileMetaText}>Arrived {userData.arrivalDate}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <ThemeSelector />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={colors.accent} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{userData.email}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={colors.accent} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{userData.phone}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={colors.accent} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Campus Location</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>Nairobi, Kenya</Text>
          </View>
        </View>
      </View>

      {isAdmin && (
        <Pressable
          onPress={() => navigation.navigate('Admin')}
          style={styles.adminCard}
        >
          <View style={styles.adminLeft}>
            <View style={styles.adminIconWrap}>
              <Ionicons name="shield" size={24} color="#fcd34d" />
            </View>
            <View>
              <Text style={styles.adminTitle}>Admin Dashboard</Text>
              <Text style={styles.adminSubtitle}>Manage users and view analytics</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </Pressable>
      )}

      <View style={[styles.docCard, { backgroundColor: '#fef9c3' }]}>
        <Text style={[styles.docTitle, { color: colors.textPrimary }]}>📄 Important Documents</Text>
        <Text style={[styles.docItem, { color: colors.textSecondary }]}>• Passport (always carry a copy)</Text>
        <Text style={[styles.docItem, { color: colors.textSecondary }]}>• Student ID card</Text>
        <Text style={[styles.docItem, { color: colors.textSecondary }]}>• Student visa/permit</Text>
        <Text style={[styles.docItem, { color: colors.textSecondary }]}>• Admission letter</Text>
      </View>

      <Pressable onPress={handleSignOut} style={[styles.signOutBtn, { backgroundColor: '#fee2e2' }]}>
        <Ionicons name="log-out" size={20} color="#dc2626" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.footer, { color: colors.textTertiary }]}>Student Support App v1.0.0</Text>
      <Text style={[styles.footer, { color: colors.textTertiary }]}>Made for international students in Kenya 🇰🇪</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 20 },
  profileCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  profileId: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  profileMeta: { gap: 4 },
  profileMetaText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  card: { borderRadius: 16, padding: 16, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 16 },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    marginBottom: 20,
  },
  adminLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  adminTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  adminSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  docCard: { borderRadius: 16, padding: 16, marginBottom: 20 },
  docTitle: { fontWeight: '600', marginBottom: 8 },
  docItem: { fontSize: 14, marginBottom: 4 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginBottom: 24 },
  signOutText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  footer: { textAlign: 'center', fontSize: 12, marginBottom: 4 },
});
