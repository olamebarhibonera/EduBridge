import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { supabase } from '../utils/supabase';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  website?: string;
  is_active?: boolean;
}

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'apps' as const },
  { key: 'University', label: 'Universities', icon: 'school' as const },
  { key: 'Hospital', label: 'Hospitals', icon: 'medkit' as const },
  { key: 'Embassy', label: 'Embassies', icon: 'flag' as const },
  { key: 'Restaurant', label: 'Restaurants', icon: 'restaurant' as const },
  { key: 'Shopping', label: 'Markets', icon: 'bag' as const },
  { key: 'Bank', label: 'Banks', icon: 'card' as const },
  { key: 'Transport', label: 'Transport', icon: 'bus' as const },
  { key: 'Government', label: 'Government', icon: 'business' as const },
  { key: 'Telecom', label: 'Telecom', icon: 'call' as const },
  { key: 'Housing', label: 'Housing', icon: 'home' as const },
];

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  University: 'school',
  Hospital: 'medkit',
  Embassy: 'flag',
  Restaurant: 'restaurant',
  Shopping: 'bag',
  Bank: 'card',
  Transport: 'bus',
  Government: 'business',
  Telecom: 'call',
  Housing: 'home',
  Healthcare: 'medkit',
  Education: 'school',
  Legal: 'briefcase',
  Other: 'location',
};

const DEFAULT_SERVICES: ServiceItem[] = [
  // Universities
  { id: 'd1', name: 'University of Nairobi', category: 'University', address: 'University Way, Nairobi', phone: '+254 20 491 8000', hours: '8:00 AM - 5:00 PM', description: 'Kenya\'s largest and oldest university' },
  { id: 'd2', name: 'Kenyatta University', category: 'University', address: 'Thika Road, Kahawa', phone: '+254 20 870 0901', hours: '8:00 AM - 5:00 PM', description: 'Major public university in Nairobi' },
  { id: 'd3', name: 'Strathmore University', category: 'University', address: 'Madaraka Estate, Ole Sangale Rd', phone: '+254 703 034 000', hours: '8:00 AM - 5:00 PM', description: 'Private chartered university' },
  { id: 'd4', name: 'USIU-Africa', category: 'University', address: 'Thika Road, Kasarani', phone: '+254 730 116 000', hours: '8:00 AM - 5:00 PM', description: 'United States International University' },
  // Hospitals
  { id: 'd5', name: 'Nairobi Hospital', category: 'Hospital', address: 'Argwings Kodhek Road', phone: '+254 20 284 5000', hours: '24/7', description: 'Full service hospital with emergency care' },
  { id: 'd6', name: 'Kenyatta National Hospital', category: 'Hospital', address: 'Hospital Road, Upper Hill', phone: '+254 20 272 6300', hours: '24/7', description: 'Kenya\'s largest public referral hospital' },
  { id: 'd7', name: 'Aga Khan University Hospital', category: 'Hospital', address: '3rd Parklands Avenue', phone: '+254 20 366 2000', hours: '24/7', description: 'Private hospital with specialist care' },
  // Embassies
  { id: 'd8', name: 'US Embassy', category: 'Embassy', address: 'United Nations Avenue, Gigiri', phone: '+254 20 363 6000', hours: '8:00 AM - 4:30 PM', description: 'Embassy of the United States' },
  { id: 'd9', name: 'French Embassy', category: 'Embassy', address: 'Peponi Road, Westlands', phone: '+254 20 277 8000', hours: '8:30 AM - 12:30 PM', description: 'Embassy of France in Kenya' },
  { id: 'd10', name: 'Chinese Embassy', category: 'Embassy', address: 'Woodlands Road, Kilimani', phone: '+254 20 272 6851', hours: '8:30 AM - 12:00 PM', description: 'Embassy of the People\'s Republic of China' },
  { id: 'd11', name: 'DRC Embassy', category: 'Embassy', address: 'Electricity House, Harambee Ave', phone: '+254 20 222 9771', hours: '9:00 AM - 3:00 PM', description: 'Embassy of DR Congo' },
  { id: 'd12', name: 'Burundi Embassy', category: 'Embassy', address: 'Development House, Moi Avenue', phone: '+254 20 221 8681', hours: '9:00 AM - 3:00 PM', description: 'Embassy of the Republic of Burundi' },
  { id: 'd13', name: 'Rwanda High Commission', category: 'Embassy', address: 'International House, Mama Ngina St', phone: '+254 20 215 9406', hours: '9:00 AM - 4:00 PM', description: 'High Commission of the Republic of Rwanda' },
  // Restaurants
  { id: 'd14', name: 'Java House', category: 'Restaurant', address: 'Kimathi Street, CBD', phone: '+254 20 222 8955', hours: '7:00 AM - 9:00 PM', description: 'Popular cafe chain with WiFi' },
  { id: 'd15', name: 'Mama Njeri\'s Kitchen', category: 'Restaurant', address: 'Near University of Nairobi', phone: '+254 712 345 678', hours: '7:00 AM - 8:00 PM', description: 'Affordable local Kenyan food' },
  { id: 'd16', name: 'KFC Kenya', category: 'Restaurant', address: 'Multiple locations, Nairobi', phone: '+254 709 875 000', hours: '10:00 AM - 10:00 PM', description: 'Fast food chain, multiple locations' },
  // Shopping & Markets
  { id: 'd17', name: 'Carrefour Supermarket', category: 'Shopping', address: 'The Hub Mall, Karen', phone: '+254 709 935 000', hours: '8:00 AM - 10:00 PM', description: 'Large supermarket chain, groceries & household' },
  { id: 'd18', name: 'Naivas Supermarket', category: 'Shopping', address: 'Multiple locations', phone: '+254 709 767 000', hours: '8:00 AM - 9:00 PM', description: 'Leading Kenyan supermarket chain' },
  { id: 'd19', name: 'Maasai Market', category: 'Shopping', address: 'Various locations (Tue/Sat)', phone: 'N/A', hours: 'Tue & Sat 9:00 AM - 6:00 PM', description: 'Traditional crafts, jewelry, souvenirs' },
  { id: 'd20', name: 'City Market Nairobi', category: 'Shopping', address: 'Muindi Mbingu Street, CBD', phone: 'N/A', hours: '8:00 AM - 6:00 PM', description: 'Fresh produce, flowers, curios' },
  // Banks
  { id: 'd21', name: 'Equity Bank', category: 'Bank', address: 'Multiple locations', phone: '+254 763 000 000', hours: '9:00 AM - 4:00 PM', description: 'Major Kenyan bank with student accounts' },
  { id: 'd22', name: 'KCB Bank', category: 'Bank', address: 'Multiple locations', phone: '+254 711 087 000', hours: '9:00 AM - 4:00 PM', description: 'Kenya Commercial Bank, ATMs everywhere' },
  { id: 'd23', name: 'M-Pesa Agent', category: 'Bank', address: 'Available everywhere', phone: '+254 722 000 000', hours: '7:00 AM - 9:00 PM', description: 'Mobile money — send, receive, pay bills' },
  // Transport
  { id: 'd24', name: 'JKIA Airport', category: 'Transport', address: 'Jomo Kenyatta International Airport', phone: '+254 20 661 1000', hours: '24/7', description: 'Nairobi\'s main international airport' },
  { id: 'd25', name: 'SGR Terminus', category: 'Transport', address: 'Syokimau, Nairobi', phone: '+254 20 290 3000', hours: '6:00 AM - 10:00 PM', description: 'Standard Gauge Railway to Mombasa' },
  { id: 'd26', name: 'Matatu Stage CBD', category: 'Transport', address: 'Tom Mboya Street, CBD', phone: 'N/A', hours: '5:00 AM - 11:00 PM', description: 'Main matatu stage for public transport' },
  // Government
  { id: 'd27', name: 'Immigration Department', category: 'Government', address: 'Nyayo House, Kenyatta Ave', phone: '+254 20 222 2022', hours: '8:00 AM - 5:00 PM', description: 'Visa extensions, permits, passes' },
  { id: 'd28', name: 'Huduma Centre', category: 'Government', address: 'GPO Building, Kenyatta Ave', phone: '+254 20 222 2333', hours: '8:00 AM - 5:00 PM', description: 'One-stop shop for government services' },
  // Telecom
  { id: 'd29', name: 'Safaricom Shop', category: 'Telecom', address: 'Westlands, Nairobi', phone: '+254 722 000 000', hours: '8:00 AM - 6:00 PM', description: 'SIM cards, M-Pesa, data bundles' },
  { id: 'd30', name: 'Airtel Shop', category: 'Telecom', address: 'Kenyatta Avenue, CBD', phone: '+254 733 100 100', hours: '8:00 AM - 6:00 PM', description: 'Mobile network, data plans' },
];

export function ServicesScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbServices, setDbServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name');
        if (data) {
          setDbServices(
            data.map((s: Record<string, unknown>) => ({
              id: s.id as string,
              name: s.name as string,
              category: s.category as string,
              address: (s.address as string) || '',
              phone: (s.phone as string) || 'N/A',
              hours: '',
              description: (s.description as string) || '',
              website: (s.website as string) || undefined,
              is_active: s.is_active as boolean,
            }))
          );
        }
      } catch {
        // Offline — use defaults only
      }
      setLoading(false);
    })();
  }, []);

  const allServices = [...dbServices, ...DEFAULT_SERVICES.filter(
    (d) => !dbServices.some((s) => s.name.toLowerCase() === d.name.toLowerCase())
  )];

  const filtered = allServices.filter((s) => {
    const matchCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const openMaps = (address: string) => {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address + ', Nairobi, Kenya')}`);
  };

  const openPhone = (phone: string) => {
    if (phone !== 'N/A') Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Essential Services</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find universities, hospitals, embassies & more</Text>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search by name, category, or address..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.accent : colors.card,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={active ? '#fff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Results count */}
        <Text style={[styles.resultCount, { color: colors.textTertiary }]}>
          {loading ? 'Loading...' : `${filtered.length} service${filtered.length !== 1 ? 's' : ''} found`}
        </Text>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {/* Services list */}
        {!loading && filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="search" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No services found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Try a different search or category</Text>
          </View>
        )}

        {!loading &&
          filtered.map((service) => {
            const iconName = categoryIconMap[service.category] ?? 'location';
            return (
              <View key={service.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrap, { backgroundColor: `${colors.accent}15` }]}>
                    <Ionicons name={iconName} size={22} color={colors.accent} />
                  </View>
                  <View style={styles.cardTitleWrap}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{service.name}</Text>
                    <Text style={[styles.cardCategory, { color: colors.accent }]}>{service.category}</Text>
                  </View>
                </View>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>{service.description}</Text>
                <View style={styles.meta}>
                  {service.address ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="location" size={15} color={colors.textTertiary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{service.address}</Text>
                    </View>
                  ) : null}
                  {service.phone && service.phone !== 'N/A' ? (
                    <Pressable onPress={() => openPhone(service.phone)} style={styles.metaRow}>
                      <Ionicons name="call" size={15} color={colors.textTertiary} />
                      <Text style={[styles.metaLink, { color: colors.accent }]}>{service.phone}</Text>
                    </Pressable>
                  ) : null}
                  {service.hours ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="time" size={15} color={colors.textTertiary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{service.hours}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.actions}>
                  <Pressable onPress={() => openMaps(service.address)} style={[styles.primaryBtn, { backgroundColor: colors.accent }]}>
                    <Ionicons name="navigate" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>Directions</Text>
                  </Pressable>
                  {service.phone && service.phone !== 'N/A' && (
                    <Pressable onPress={() => openPhone(service.phone)} style={[styles.secondaryBtn, { borderColor: colors.border }]}>
                      <Ionicons name="call" size={16} color={colors.accent} />
                      <Text style={[styles.secondaryBtnText, { color: colors.accent }]}>Call</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 16 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, marginBottom: 16 },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: { flex: 1, height: 48, paddingLeft: 44, paddingRight: 40, fontSize: 15 },
  clearBtn: { position: 'absolute', right: 12 },
  chipRow: { gap: 8, paddingBottom: 4, marginBottom: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  resultCount: { fontSize: 13, marginBottom: 12 },
  loadingWrap: { paddingVertical: 40, alignItems: 'center' },
  emptyWrap: { paddingVertical: 48, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 14 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitleWrap: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardCategory: { fontSize: 13, marginTop: 2 },
  desc: { fontSize: 13, marginTop: 10, lineHeight: 19 },
  meta: { marginTop: 10, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, flex: 1 },
  metaLink: { fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1 },
  secondaryBtnText: { fontSize: 14, fontWeight: '600' },
});
