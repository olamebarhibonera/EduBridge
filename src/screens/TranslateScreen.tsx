import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

const languages = [
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'swahili', name: 'Swahili', flag: '🇰🇪' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳' },
  { code: 'arabic', name: 'Arabic', flag: '🇸🇦' },
];

const commonPhrases = [
  { en: 'Hello', sw: 'Jambo / Habari' },
  { en: 'How much?', sw: 'Ni bei gani?' },
  { en: 'Thank you', sw: 'Asante' },
  { en: 'Where is...?', sw: 'Wapi...?' },
  { en: 'I need help', sw: 'Nahitaji msaada' },
  { en: 'How are you?', sw: 'Habari yako?' },
];

const mockTranslations: Record<string, string> = {
  hello: 'Jambo',
  goodbye: 'Kwaheri',
  'thank you': 'Asante',
  'how much': 'Ni bei gani',
  'where is': 'Wapi',
};

export function TranslateScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('english');
  const [targetLang, setTargetLang] = useState('swahili');

  const handleTranslate = () => {
    if (sourceLang === 'english' && targetLang === 'swahili') {
      const lower = sourceText.toLowerCase();
      const match = Object.keys(mockTranslations).find((k) => lower.includes(k));
      setTranslatedText(match ? mockTranslations[match] : '[Translation would appear here]');
    } else {
      setTranslatedText('[Translation would appear here]');
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Translation</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Translate between languages instantly</Text>

      <View style={styles.langRow}>
        <View style={[styles.langSelect, { backgroundColor: colors.card }]}>
          <Text style={[styles.langLabel, { color: colors.textPrimary }]}>
            {languages.find((l) => l.code === sourceLang)?.flag} {languages.find((l) => l.code === sourceLang)?.name}
          </Text>
        </View>
        <Pressable onPress={swapLanguages} style={[styles.swapBtn, { backgroundColor: colors.accent }]}>
          <Ionicons name="swap-horizontal" size={24} color="#fff" />
        </Pressable>
        <View style={[styles.langSelect, { backgroundColor: colors.card }]}>
          <Text style={[styles.langLabel, { color: colors.textPrimary }]}>
            {languages.find((l) => l.code === targetLang)?.flag} {languages.find((l) => l.code === targetLang)?.name}
          </Text>
        </View>
      </View>

      <View style={[styles.box, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.textArea, { color: colors.textPrimary }]}
          placeholder="Enter text to translate..."
          placeholderTextColor={colors.textTertiary}
          value={sourceText}
          onChangeText={setSourceText}
          multiline
          numberOfLines={4}
        />
        <View style={styles.iconRow}>
          <Pressable onPress={() => {}} style={styles.iconBtn}>
            <Ionicons name="volume-high" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={() => copyText(sourceText)} style={styles.iconBtn}>
            <Ionicons name="copy" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <Pressable onPress={handleTranslate} style={[styles.translateBtn, { backgroundColor: colors.accent }]}>
        <Text style={styles.translateBtnText}>Translate</Text>
      </Pressable>

      <View style={[styles.box, styles.resultBox, { backgroundColor: `${colors.accent}15` }]}>
        <Text style={[styles.resultText, { color: colors.textPrimary }]}>
          {translatedText || 'Translation will appear here...'}
        </Text>
        {translatedText ? (
          <View style={styles.iconRow}>
            <Pressable onPress={() => {}} style={styles.iconBtn}>
              <Ionicons name="volume-high" size={20} color={colors.accent} />
            </Pressable>
            <Pressable onPress={() => copyText(translatedText)} style={styles.iconBtn}>
              <Ionicons name="copy" size={20} color={colors.accent} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Common Swahili Phrases</Text>
      {commonPhrases.map((phrase, idx) => (
        <Pressable
          key={idx}
          onPress={() => {
            setSourceText(phrase.en);
            setTranslatedText(phrase.sw);
          }}
          style={[styles.phraseCard, { backgroundColor: colors.card }]}
        >
          <View>
            <Text style={[styles.phraseEn, { color: colors.textPrimary }]}>{phrase.en}</Text>
            <Text style={[styles.phraseSw, { color: colors.accent }]}>{phrase.sw}</Text>
          </View>
          <Ionicons name="volume-high" size={20} color={colors.textTertiary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  langSelect: { flex: 1, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12 },
  langLabel: { fontSize: 14 },
  swapBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  box: { borderRadius: 16, padding: 16, marginBottom: 12 },
  textArea: { minHeight: 100, fontSize: 16, paddingVertical: 8 },
  iconRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  iconBtn: { padding: 8 },
  translateBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  translateBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultBox: { padding: 16 },
  resultText: { minHeight: 80, fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  phraseCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 8 },
  phraseEn: { fontWeight: '500' },
  phraseSw: { fontSize: 14, marginTop: 4 },
});
