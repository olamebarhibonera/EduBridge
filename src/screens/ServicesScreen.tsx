import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import type { Service } from '../types';

const initialServices: Service[] = [
  { id: '1', name: 'Nairobi Hospital', category: 'Healthcare', address: 'Argwings Kodhek Road, Nairobi', phone: '+254 20 284 5000', hours: '24/7', distance: '2.3 km', description: 'Full service hospital with emergency care' },
  { id: '2', name: 'Immigration Department', category: 'Government', address: 'Nyayo House, Kenyatta Avenue', phone: '+254 20 222 2022', hours: '8:00 AM - 5:00 PM', distance: '3.1 km', description: 'Visa extensions and permits' },
  { id: '3', name: 'Safaricom Shop', category: 'Telecom', address: 'Westlands, Nairobi', phone: '+254 722 000 000', hours: '8:00 AM - 6:00 PM', distance: '1.5 km', description: 'SIM cards, M-Pesa, internet packages' },
  { id: '4', name: 'Carrefour Supermarket', category: 'Shopping', address: 'The Hub Mall, Karen', phone: '+254 709 935 000', hours: '8:00 AM - 10:00 PM', distance: '4.2 km', description: 'Groceries and household items' },
  { id: '5', name: 'Java House', category: 'Restaurant', address: 'Kimathi Street, CBD', phone: '+254 20 222 8955', hours: '7:00 AM - 9:00 PM', distance: '2.8 km', description: 'Cafe and restaurant with WiFi' },
  { id: '6', name: 'University Library', category: 'Education', address: 'Campus Main Building', phone: '+254 20 123 4567', hours: '6:00 AM - 10:00 PM', distance: '0.5 km', description: 'Study materials and computer lab' },
  { id: '7', name: 'Matatu Stage', category: 'Transport', address: 'Campus Gate', phone: 'N/A', hours: '5:00 AM - 11:00 PM', distance: '0.2 km', description: 'Public transport to CBD and other areas' },
  { id: '8', name: "Mama Njeri's Kitchen", category: 'Restaurant', address: 'Near Campus', phone: '+254 712 345 678', hours: '7:00 AM - 8:00 PM', distance: '0.3 km', description: 'Affordable local Kenyan food' },
];

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Healthcare: 'heart',
  Government: 'business',
  Telecom: 'call',
  Shopping: 'bag',
  Restaurant: 'restaurant',
  Education: 'school',
  Transport: 'bus',
};

export function ServicesScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = initialServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openMaps = (address: string) => {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  const openPhone = (phone: string) => {
    if (phone !== 'N/A') Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Essential Services</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find everything you need nearby</Text>

      <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search services..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filtered.map((service) => {
        const iconName = categoryIcons[service.category] ?? 'location';
        return (
          <View key={service.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: `${colors.accent}20` }]}>
                <Ionicons name={iconName} size={24} color={colors.accent} />
              </View>
              <View style={styles.cardTitleWrap}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{service.name}</Text>
                <Text style={[styles.cardCategory, { color: colors.accent }]}>{service.category}</Text>
              </View>
              <Text style={[styles.distance, { color: colors.textTertiary }]}>{service.distance}</Text>
            </View>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{service.description}</Text>
            <View style={styles.meta}>
              <View style={styles.metaRow}>
                <Ionicons name="location" size={16} color={colors.textTertiary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{service.address}</Text>
              </View>
              {service.phone !== 'N/A' && (
                <Pressable onPress={() => openPhone(service.phone)} style={styles.metaRow}>
                  <Ionicons name="call" size={16} color={colors.textTertiary} />
                  <Text style={[styles.metaLink, { color: colors.accent }]}>{service.phone}</Text>
                </Pressable>
              )}
              <View style={styles.metaRow}>
                <Ionicons name="time" size={16} color={colors.textTertiary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{service.hours}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => openMaps(service.address)} style={[styles.primaryBtn, { backgroundColor: colors.accent }]}>
                <Text style={styles.primaryBtnText}>Get Directions</Text>
              </Pressable>
              {service.phone !== 'N/A' && (
                <Pressable onPress={() => openPhone(service.phone)} style={[styles.secondaryBtn, { backgroundColor: colors.border }]}>
                  <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>Call</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}

      <View style={[styles.linksCard, { backgroundColor: '#fdf4ff' }]}>
        <Text style={[styles.linksTitle, { color: colors.textPrimary }]}>🔗 Quick Links</Text>
        <Pressable onPress={() => Linking.openURL('https://www.immigration.go.ke')} style={styles.linkRow}>
          <Ionicons name="globe" size={20} color="#9333ea" />
          <Text style={styles.linkText}>Immigration</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://www.safaricom.co.ke')} style={styles.linkRow}>
          <Ionicons name="wifi" size={20} color="#9333ea" />
          <Text style={styles.linkText}>Internet</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 16 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, marginBottom: 20 },
  searchIcon: { position: 'absolute', left: 12, zIndex: 1 },
  searchInput: { flex: 1, height: 44, paddingLeft: 44, paddingRight: 12, fontSize: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitleWrap: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardCategory: { fontSize: 14, marginTop: 2 },
  distance: { fontSize: 14 },
  desc: { fontSize: 14, marginTop: 12 },
  meta: { marginTop: 12, gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 14 },
  metaLink: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  secondaryBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  secondaryBtnText: { fontSize: 14, fontWeight: '500' },
  linksCard: { borderRadius: 16, padding: 16 },
  linksTitle: { fontWeight: '600', marginBottom: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  linkText: { fontSize: 14, fontWeight: '500', color: '#374151' },
});
