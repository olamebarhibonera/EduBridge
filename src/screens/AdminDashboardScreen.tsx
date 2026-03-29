import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

export function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const isAdmin = useMemo(() => {
    return Boolean(user?.email?.includes('admin') || user?.user_metadata?.role === 'admin');
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }
    if (!isAdmin) {
      navigation.replace('MainTabs');
    }
  }, [user, isAdmin, navigation]);

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12.5%', icon: 'people' as const },
    { label: 'Active Sessions', value: '1,234', change: '+8.2%', icon: 'pulse' as const },
    { label: 'Translations', value: '45.2K', change: '+23.1%', icon: 'globe' as const },
    { label: 'Success Rate', value: '98.5%', change: '+2.1%', icon: 'shield-checkmark' as const },
  ];

  const recentActivity = [
    { id: '1', text: 'New user registrations this hour: 14', time: '5m ago', icon: 'person-add' as const },
    { id: '2', text: 'Translation API latency normalized', time: '13m ago', icon: 'flash' as const },
    { id: '3', text: '2 reports flagged for review', time: '27m ago', icon: 'warning' as const },
    { id: '4', text: 'Nightly backup completed', time: '1h ago', icon: 'cloud-done' as const },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Admin Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Welcome, {user?.user_metadata?.name || user?.email || 'Admin'}
          </Text>
        </View>
      </View>

      <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
        <View>
          <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>System Status</Text>
          <Text style={[styles.statusSub, { color: colors.textSecondary }]}>
            Last sync: {lastSync.toLocaleTimeString()}
          </Text>
        </View>
        <Pressable onPress={() => setLastSync(new Date())} style={styles.syncBtn}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.syncBtnText}>Sync</Text>
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statIconWrap}>
              <Ionicons name={s.icon} size={24} color="#2563eb" />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            <Text style={styles.statChange}>{s.change}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Controls</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelWrap}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Maintenance mode</Text>
            <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>Temporarily limit normal user actions</Text>
          </View>
          <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelWrap}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Allow new registrations</Text>
            <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>Control onboarding availability</Text>
          </View>
          <Switch value={registrationOpen} onValueChange={setRegistrationOpen} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Recent Activity</Text>
        {recentActivity.map((item) => (
          <View key={item.id} style={styles.activityRow}>
            <View style={styles.activityIconWrap}>
              <Ionicons name={item.icon} size={16} color="#2563eb" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={[styles.activityText, { color: colors.textPrimary }]}>{item.text}</Text>
              <Text style={[styles.activityTime, { color: colors.textTertiary }]}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="people" size={18} color="#fff" />
            <Text style={styles.actionText}>Users</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="bar-chart" size={18} color="#fff" />
            <Text style={styles.actionText}>Reports</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="settings" size={18} color="#fff" />
            <Text style={styles.actionText}>Config</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  headerTextWrap: { flex: 1 },
  backBtn: { marginRight: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: { fontSize: 16, fontWeight: '700' },
  statusSub: { fontSize: 12, marginTop: 4 },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  syncBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: '47%', borderRadius: 16, padding: 16, borderWidth: 1 },
  statIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 14, marginTop: 4 },
  statChange: { fontSize: 12, color: '#16a34a', marginTop: 4 },
  card: { borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  toggleLabelWrap: { flex: 1, paddingRight: 12 },
  toggleTitle: { fontSize: 14, fontWeight: '600' },
  toggleSub: { fontSize: 12, marginTop: 3 },
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityTextWrap: { flex: 1 },
  activityText: { fontSize: 14 },
  activityTime: { fontSize: 12, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
