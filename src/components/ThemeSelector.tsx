import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import type { ThemeId } from '../types';

const options: { id: ThemeId; name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'light', name: 'Light', icon: 'sunny' },
  { id: 'dark', name: 'Dark', icon: 'moon' },
  { id: 'chocolate', name: 'Chocolate', icon: 'cafe' },
  { id: 'pink', name: 'Pink', icon: 'heart' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => setTheme(opt.id)}
            style={[styles.option, isActive && styles.optionActive]}
          >
            <Ionicons name={opt.icon} size={28} color={isActive ? '#fff' : '#6b7280'} />
            <Text style={[styles.optionName, isActive && styles.optionNameActive]}>{opt.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  option: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
  },
  optionActive: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  optionName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  optionNameActive: { color: '#fff' },
});
