import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { ThemeSelector } from '../components/ThemeSelector';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, loading, isAdmin, signOut } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bgPrimary }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) return null;

  const displayName = user.full_name || user.user_metadata?.name as string || user.email?.split('@')[0] || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your account and preferences</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.accent }]}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{user.role || 'Student'}</Text>
        </View>
        <View style={styles.profileMeta}>
          {user.university && (
            <Text style={styles.profileMetaText}>{user.course ? `${user.course} • ` : ''}{user.university}</Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: user.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }]}>
            <View style={[styles.statusDot, { backgroundColor: user.status === 'active' ? '#22c55e' : '#ef4444' }]} />
            <Text style={styles.statusText}>{user.status || 'Active'}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <ThemeSelector />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Contact Information</Text>
        <View style={styles.infoRow}>
          <View style={[styles.infoIconWrap, { backgroundColor: `${colors.accent}20` }]}>
            <Ionicons name="mail" size={18} color={colors.accent} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.email}</Text>
          </View>
        </View>
        {user.phone && (
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: `${colors.accent}20` }]}>
              <Ionicons name="call" size={18} color={colors.accent} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.phone}</Text>
            </View>
          </View>
        )}
        {user.preferred_language && (
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: `${colors.accent}20` }]}>
              <Ionicons name="language" size={18} color={colors.accent} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Language</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.preferred_language.toUpperCase()}</Text>
            </View>
          </View>
        )}
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
              <Text style={styles.adminSubtitle}>Manage users and platform</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </Pressable>
      )}

      <View style={[styles.docCard, { backgroundColor: '#fef9c3' }]}>
        <Text style={[styles.docTitle, { color: '#713f12' }]}>📄 Important Documents</Text>
        <Text style={[styles.docItem, { color: '#92400e' }]}>• Passport (always carry a copy)</Text>
        <Text style={[styles.docItem, { color: '#92400e' }]}>• Student ID card</Text>
        <Text style={[styles.docItem, { color: '#92400e' }]}>• Student visa/permit</Text>
        <Text style={[styles.docItem, { color: '#92400e' }]}>• Admission letter</Text>
      </View>

      <Pressable onPress={handleSignOut} style={[styles.signOutBtn, { backgroundColor: '#fee2e2' }]}>
        <Ionicons name="log-out" size={20} color="#dc2626" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.footer, { color: colors.textTertiary }]}>EduBridge v1.0.0</Text>
      <Text style={[styles.footer, { color: colors.textTertiary }]}>Built by OLAME BARHIBONERA Eben</Text>
      <Text style={[styles.footer, { color: colors.textTertiary }]}>Made for international students in Kenya 🇰🇪</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 20 },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  roleBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  profileMeta: { alignItems: 'center', gap: 8 },
  profileMetaText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  card: { borderRadius: 16, padding: 16, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  infoIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15, fontWeight: '500' },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#db2777',
    borderRadius: 16,
    marginBottom: 20,
  },
  adminLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  adminSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  docCard: { borderRadius: 16, padding: 16, marginBottom: 20 },
  docTitle: { fontWeight: '600', marginBottom: 8, fontSize: 15 },
  docItem: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  footer: { textAlign: 'center', fontSize: 12, marginBottom: 4 },
});
