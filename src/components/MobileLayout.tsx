import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Translate: 'language',
  Budget: 'wallet',
  Services: 'location',
  Profile: 'person',
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
        const iconName = tabIcons[route.name] ?? 'ellipse';

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
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? colors.accent : colors.textTertiary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.accent : colors.textTertiary },
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
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
