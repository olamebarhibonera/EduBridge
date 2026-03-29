import React from 'react';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

const tabConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap }> = {
  Home: { icon: 'home-outline', iconFocused: 'home' },
  Translate: { icon: 'language-outline', iconFocused: 'language' },
  Budget: { icon: 'wallet-outline', iconFocused: 'wallet' },
  Services: { icon: 'location-outline', iconFocused: 'location' },
  Profile: { icon: 'person-outline', iconFocused: 'person' },
};

export function MobileLayout({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel as string) ?? route.name;
        const isFocused = state.index === index;
        const config = tabConfig[route.name] ?? { icon: 'ellipse-outline', iconFocused: 'ellipse' };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            {isFocused && (
              <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} />
            )}
            <View style={[styles.iconWrap, isFocused && { backgroundColor: `${colors.accent}15` }]}>
              <Ionicons
                name={isFocused ? config.iconFocused : config.icon}
                size={22}
                color={isFocused ? colors.accent : colors.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.accent : colors.textTertiary,
                  fontWeight: isFocused ? '600' : '400',
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 6,
    borderTopWidth: 1,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
