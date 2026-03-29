import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

const quickActions = [
  { icon: 'language' as const, label: 'Translate', path: 'Translate', color: '#8b5cf6' },
  { icon: 'wallet' as const, label: 'Budget', path: 'Budget', color: '#d97706' },
  { icon: 'location' as const, label: 'Services', path: 'Services', color: '#2563eb' },
];

const emergencyContacts = [
  { name: 'Police', number: '999', icon: 'alert-circle' as const },
  { name: 'Ambulance', number: '999', icon: 'heart' as const },
  { name: 'Campus Security', number: '020-XXX-XXXX', icon: 'business' as const },
];

const essentialServices = [
  { icon: 'book', label: 'Study Resources', color: '#7c3aed' },
  { icon: 'restaurant', label: 'Restaurants', color: '#ea580c' },
  { icon: 'bus', label: 'Transport', color: '#16a34a' },
  { icon: 'call', label: 'SIM Cards', color: '#2563eb' },
  { icon: 'business', label: 'Immigration', color: '#dc2626' },
  { icon: 'heart', label: 'Healthcare', color: '#db2777' },
];

const features = [
  { icon: 'globe', text: 'Support for 5 languages' },
  { icon: 'shield-checkmark', text: 'Secure & Private' },
  { icon: 'sparkles', text: 'Premium Experience' },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
      <View style={[styles.hero, { backgroundColor: colors.accent }]}>
        <Text style={styles.heroEmoji}>🇰🇪</Text>
        <Text style={styles.heroTitle}>
          {user ? `Karibu, ${displayName}! 👋` : 'Welcome to Kenya! 🌟'}
        </Text>
        <Text style={styles.heroSubtitle}>Your premium companion for studying in Kenya</Text>
        <View style={styles.featureChips}>
          {features.map((f) => (
            <View key={f.text} style={[styles.chip, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name={f.icon as any} size={14} color="#fff" />
              <Text style={styles.chipText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => navigation.navigate(action.path)}
              style={[styles.actionCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="#fff" />
              </View>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.section, { borderColor: '#fecaca', backgroundColor: '#fef2f2' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          </View>
          {emergencyContacts.map((c) => (
            <View key={c.name} style={styles.emergencyRow}>
              <View style={styles.emergencyLeft}>
                <Ionicons name={c.icon as any} size={16} color="#dc2626" />
                <Text style={styles.emergencyName}>{c.name}</Text>
              </View>
              <Pressable style={styles.emergencyBtn}>
                <Text style={styles.emergencyNumber}>{c.number}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Essential Services</Text>
        <View style={styles.servicesGrid}>
          {essentialServices.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => navigation.navigate('Services')}
              style={[styles.serviceCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.serviceIconWrap, { backgroundColor: `${s.color}20` }]}>
                <Ionicons name={s.icon as any} size={28} color={s.color} />
              </View>
              <Text style={[styles.serviceLabel, { color: colors.textPrimary }]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.tipsCard, { backgroundColor: colors.card }]}>
          <Text style={styles.tipsEmoji}>💡</Text>
          <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>Quick Tips</Text>
          <Text style={[styles.tip, { color: colors.textSecondary }]}>
            • Always carry your passport and student ID
          </Text>
          <Text style={[styles.tip, { color: colors.textSecondary }]}>
            • Download M-Pesa app for easy payments
          </Text>
          <Text style={[styles.tip, { color: colors.textSecondary }]}>
            • Save emergency contacts in your phone
          </Text>
          <Text style={[styles.tip, { color: colors.textSecondary }]}>
            • Learn basic Swahili - "Jambo" (Hello)!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    padding: 32,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 4 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  featureChips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 24, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  content: { padding: 24, paddingBottom: 100 },
  quickActions: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 14, fontWeight: '600' },
  section: { borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  emergencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 12, marginBottom: 8 },
  emergencyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emergencyName: { fontWeight: '500', color: '#111' },
  emergencyBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  emergencyNumber: { color: '#dc2626', fontWeight: '700', fontSize: 12 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  serviceCard: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  serviceIconWrap: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serviceLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  tipsCard: { borderRadius: 16, padding: 20 },
  tipsEmoji: { fontSize: 24, marginBottom: 4 },
  tipsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  tip: { fontSize: 14, marginBottom: 8 },
});
