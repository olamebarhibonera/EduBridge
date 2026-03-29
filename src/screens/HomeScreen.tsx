import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { supabase } from '../utils/supabase';

const quickActions = [
  { icon: 'language' as const, label: 'Translate', path: 'Translate', color: '#ec4899' },
  { icon: 'wallet' as const, label: 'Budget', path: 'Budget', color: '#d97706' },
  { icon: 'location' as const, label: 'Services', path: 'Services', color: '#2563eb' },
];

const emergencyContacts = [
  { name: 'Police', number: '999', icon: 'alert-circle' as const },
  { name: 'Ambulance', number: '999', icon: 'heart' as const },
  { name: 'Fire', number: '999', icon: 'flame' as const },
];

const essentialServices = [
  { icon: 'book', label: 'Study Resources', color: '#ec4899' },
  { icon: 'restaurant', label: 'Restaurants', color: '#ea580c' },
  { icon: 'bus', label: 'Transport', color: '#16a34a' },
  { icon: 'call', label: 'SIM Cards', color: '#2563eb' },
  { icon: 'business', label: 'Immigration', color: '#dc2626' },
  { icon: 'heart', label: 'Healthcare', color: '#db2777' },
];

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const displayName = user?.full_name || user?.user_metadata?.name as string || user?.email?.split('@')[0] || 'Guest';

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from('announcements')
        .select('id, title, content, priority')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setAnnouncements(data);
    }
    fetchAnnouncements();
  }, []);

  const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
    urgent: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    high: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    normal: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    low: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
      <View style={[styles.hero, { backgroundColor: colors.accent }]}>
        <Text style={styles.heroEmoji}>🇰🇪</Text>
        <Text style={styles.heroTitle}>
          {user ? `Karibu, ${displayName}! 👋` : 'Welcome to Kenya! 🌟'}
        </Text>
        <Text style={styles.heroSubtitle}>Your companion for studying in Kenya</Text>
        <View style={styles.featureChips}>
          {[
            { icon: 'globe', text: '28+ Languages' },
            { icon: 'shield-checkmark', text: 'Secure' },
            { icon: 'sparkles', text: 'Premium' },
          ].map((f) => (
            <View key={f.text} style={styles.chip}>
              <Ionicons name={f.icon as any} size={14} color="#fff" />
              <Text style={styles.chipText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {announcements.length > 0 && (
          <View style={styles.announcementsSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Announcements</Text>
            {announcements.map((a) => {
              const pc = priorityColors[a.priority] || priorityColors.normal;
              return (
                <View key={a.id} style={[styles.announcementCard, { backgroundColor: pc.bg, borderColor: pc.border }]}>
                  <View style={styles.announcementHeader}>
                    <Ionicons name="megaphone" size={16} color={pc.text} />
                    <Text style={[styles.announcementTitle, { color: pc.text }]}>{a.title}</Text>
                  </View>
                  <Text style={[styles.announcementContent, { color: pc.text }]} numberOfLines={2}>
                    {a.content}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

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

        <View style={[styles.emergencySection, { borderColor: '#fecaca', backgroundColor: '#fef2f2' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.emergencySectionTitle}>Emergency Contacts</Text>
          </View>
          {emergencyContacts.map((c) => (
            <Pressable
              key={c.name}
              onPress={() => Linking.openURL(`tel:${c.number}`)}
              style={styles.emergencyRow}
            >
              <View style={styles.emergencyLeft}>
                <Ionicons name={c.icon as any} size={16} color="#dc2626" />
                <Text style={styles.emergencyName}>{c.name}</Text>
              </View>
              <View style={styles.emergencyBtn}>
                <Ionicons name="call" size={14} color="#dc2626" />
                <Text style={styles.emergencyNumber}>{c.number}</Text>
              </View>
            </Pressable>
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
              <View style={[styles.serviceIconWrap, { backgroundColor: `${s.color}15` }]}>
                <Ionicons name={s.icon as any} size={28} color={s.color} />
              </View>
              <Text style={[styles.serviceLabel, { color: colors.textPrimary }]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.tipsCard, { backgroundColor: colors.card }]}>
          <Text style={styles.tipsEmoji}>💡</Text>
          <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>Quick Tips</Text>
          {[
            'Always carry your passport and student ID',
            'Download M-Pesa app for easy payments',
            'Save emergency contacts in your phone',
            'Learn basic Swahili — "Jambo" means Hello!',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.tip, { color: colors.textSecondary }]}>{tip}</Text>
            </View>
          ))}
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
  featureChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chipText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  content: { padding: 24, paddingBottom: 100 },
  announcementsSection: { marginBottom: 20 },
  announcementCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  announcementHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  announcementTitle: { fontSize: 14, fontWeight: '600' },
  announcementContent: { fontSize: 13, lineHeight: 18 },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: '600' },
  emergencySection: { borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  emergencySectionTitle: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  emergencyLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emergencyName: { fontWeight: '500', color: '#111' },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emergencyNumber: { color: '#dc2626', fontWeight: '700', fontSize: 12 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  serviceCard: {
    width: '47%' as any,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  serviceIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  tipsCard: { borderRadius: 16, padding: 20 },
  tipsEmoji: { fontSize: 24, marginBottom: 4 },
  tipsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  tip: { fontSize: 14, flex: 1, lineHeight: 20 },
});
