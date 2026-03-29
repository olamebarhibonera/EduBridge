import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'school' as const,
    title: 'Welcome to EduBridge',
    subtitle: 'Your companion for studying in Kenya',
    description:
      'EduBridge helps international students navigate life in Kenya with translation, budgeting, local services, and more.',
    color: '#8b5cf6',
    bgGradient: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: '2',
    icon: 'language' as const,
    title: 'Translate Instantly',
    subtitle: 'Break language barriers',
    description:
      'Translate between English, Swahili, French, Arabic, Chinese and more with our real-time translation powered by AI.',
    color: '#2563eb',
    bgGradient: ['#2563eb', '#1d4ed8'],
  },
  {
    id: '3',
    icon: 'wallet' as const,
    title: 'Track Your Budget',
    subtitle: 'Manage finances in KES',
    description:
      'Keep track of your income and expenses with our intuitive budget tracker designed for student life in Kenya.',
    color: '#d97706',
    bgGradient: ['#d97706', '#b45309'],
  },
  {
    id: '4',
    icon: 'location' as const,
    title: 'Find Services',
    subtitle: 'Everything you need nearby',
    description:
      'Discover hospitals, banks, embassies, transport, restaurants and essential services around you.',
    color: '#16a34a',
    bgGradient: ['#16a34a', '#15803d'],
  },
  {
    id: '5',
    icon: 'heart' as const,
    title: 'Built With Love',
    subtitle: 'By OLAME BARHIBONERA Eben',
    description:
      'Created as a final year project to help fellow international students thrive during their studies in Kenya. 🇰🇪',
    color: '#ec4899',
    bgGradient: ['#ec4899', '#db2777'],
  },
];

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
        <View style={[styles.iconInner, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={48} color="#fff" />
        </View>
      </View>
      <Text style={[styles.slideTitle, { color: item.color }]}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Pressable onPress={onComplete} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      <View style={styles.bottomSection}>
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: slides[currentIndex].color,
                  },
                ]}
              />
            );
          })}
        </View>

        <Pressable
          onPress={goNext}
          style={[styles.nextBtn, { backgroundColor: slides[currentIndex].color }]}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={isLast ? 'checkmark' : 'arrow-forward'}
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  iconInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4b5563',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
