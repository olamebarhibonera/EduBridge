import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import { supabase } from '../utils/supabase';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
];

interface SavedPhrase {
  source_text: string;
  translated_text: string;
  category: string;
}

function decodeTranslationResult(text: string): string {
  let decoded = text;
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    decoded = decoded.replace(/%20/g, ' ').replace(/%([0-9A-Fa-f]{2})/g, (_m, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  }
  return decoded
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

async function translateText(text: string, from: string, to: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
    );
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const result = decodeTranslationResult(data.responseData.translatedText);
      if (result.toUpperCase() === result && text.toUpperCase() !== text) {
        return 'Translation unavailable for this language pair';
      }
      return result;
    }
    return 'Translation unavailable';
  } catch {
    return 'Network error — check your connection';
  }
}

export function TranslateScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('sw');
  const [loading, setLoading] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [pickerVisible, setPickerVisible] = useState<'source' | 'target' | null>(null);
  const [langSearch, setLangSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPhrases() {
      const { data } = await supabase
        .from('translations')
        .select('source_text, translated_text, category')
        .eq('is_verified', true)
        .limit(10);
      if (data) setSavedPhrases(data);
    }
    fetchPhrases();
  }, []);

  const commonPhrases: SavedPhrase[] = savedPhrases.length > 0
    ? savedPhrases
    : [
        { source_text: 'Hello', translated_text: 'Jambo / Habari', category: 'greeting' },
        { source_text: 'How much?', translated_text: 'Ni bei gani?', category: 'general' },
        { source_text: 'Thank you', translated_text: 'Asante', category: 'greeting' },
        { source_text: 'Where is...?', translated_text: 'Wapi...?', category: 'general' },
        { source_text: 'I need help', translated_text: 'Nahitaji msaada', category: 'emergency' },
        { source_text: 'How are you?', translated_text: 'Habari yako?', category: 'greeting' },
      ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    const result = await translateText(sourceText, sourceLang, targetLang);
    setTranslatedText(result);
    setLoading(false);
  };

  const handleAutoTranslate = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (text: string) => {
        setSourceText(text);
        setTranslatedText('');
        clearTimeout(timeout);
        if (text.trim().length >= 2) {
          timeout = setTimeout(async () => {
            setLoading(true);
            const result = await translateText(text, sourceLang, targetLang);
            setTranslatedText(result);
            setLoading(false);
          }, 600);
        }
      };
    })(),
    [sourceLang, targetLang]
  );

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getLang = (code: string) => ALL_LANGUAGES.find((l) => l.code === code);
  const filteredLangs = ALL_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase())
  );

  const selectLanguage = (code: string) => {
    if (pickerVisible === 'source') setSourceLang(code);
    else setTargetLang(code);
    setPickerVisible(null);
    setLangSearch('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Translation</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Translate between 28+ languages instantly
      </Text>

      <View style={styles.langRow}>
        <Pressable
          onPress={() => setPickerVisible('source')}
          style={[styles.langSelect, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.langLabel, { color: colors.textPrimary }]}>
            {getLang(sourceLang)?.flag} {getLang(sourceLang)?.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
        </Pressable>
        <Pressable onPress={swapLanguages} style={[styles.swapBtn, { backgroundColor: colors.accent }]}>
          <Ionicons name="swap-horizontal" size={22} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => setPickerVisible('target')}
          style={[styles.langSelect, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.langLabel, { color: colors.textPrimary }]}>
            {getLang(targetLang)?.flag} {getLang(targetLang)?.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
        </Pressable>
      </View>

      <View style={[styles.box, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.textArea, { color: colors.textPrimary }]}
          placeholder="Type to translate..."
          placeholderTextColor={colors.textTertiary}
          value={sourceText}
          onChangeText={handleAutoTranslate}
          multiline
          numberOfLines={4}
        />
        {sourceText.length > 0 && (
          <View style={styles.inputActions}>
            <Pressable onPress={() => { setSourceText(''); setTranslatedText(''); }}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </Pressable>
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>
              {sourceText.length}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={handleTranslate}
        style={[styles.translateBtn, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="language" size={20} color="#fff" />
            <Text style={styles.translateBtnText}>Translate</Text>
          </>
        )}
      </Pressable>

      <View style={[styles.box, styles.resultBox, { backgroundColor: `${colors.accent}12` }]}>
        {loading ? (
          <View style={styles.resultLoading}>
            <ActivityIndicator color={colors.accent} />
            <Text style={[styles.resultLoadingText, { color: colors.textTertiary }]}>
              Translating...
            </Text>
          </View>
        ) : (
          <Text style={[styles.resultText, { color: translatedText ? colors.textPrimary : colors.textTertiary }]}>
            {translatedText || 'Translation will appear here...'}
          </Text>
        )}
        {translatedText && !loading ? (
          <View style={styles.resultActions}>
            <Pressable onPress={() => copyText(translatedText)} style={styles.actionChip}>
              <Ionicons name={copied ? 'checkmark' : 'copy'} size={16} color={colors.accent} />
              <Text style={[styles.actionChipText, { color: colors.accent }]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {savedPhrases.length > 0 ? 'Verified Phrases' : 'Common Phrases'}
      </Text>
      {commonPhrases.map((phrase, idx) => (
        <Pressable
          key={idx}
          onPress={() => {
            setSourceText(phrase.source_text);
            setTranslatedText(phrase.translated_text);
          }}
          style={[styles.phraseCard, { backgroundColor: colors.card }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.phraseEn, { color: colors.textPrimary }]}>{phrase.source_text}</Text>
            <Text style={[styles.phraseSw, { color: colors.accent }]}>{phrase.translated_text}</Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: `${colors.accent}15` }]}>
            <Text style={[styles.categoryText, { color: colors.accent }]}>{phrase.category}</Text>
          </View>
        </Pressable>
      ))}

      <View style={[styles.apiNote, { backgroundColor: colors.card }]}>
        <Ionicons name="globe" size={16} color={colors.accent} />
        <Text style={[styles.apiNoteText, { color: colors.textTertiary }]}>
          Powered by MyMemory API — 28+ languages supported
        </Text>
      </View>

      <Modal visible={pickerVisible !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgPrimary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select {pickerVisible === 'source' ? 'Source' : 'Target'} Language
              </Text>
              <Pressable onPress={() => { setPickerVisible(null); setLangSearch(''); }}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <View style={[styles.modalSearch, { backgroundColor: colors.card }]}>
              <Ionicons name="search" size={18} color={colors.textTertiary} />
              <TextInput
                style={[styles.modalSearchInput, { color: colors.textPrimary }]}
                placeholder="Search languages..."
                placeholderTextColor={colors.textTertiary}
                value={langSearch}
                onChangeText={setLangSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredLangs}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected =
                  (pickerVisible === 'source' && item.code === sourceLang) ||
                  (pickerVisible === 'target' && item.code === targetLang);
                return (
                  <Pressable
                    onPress={() => selectLanguage(item.code)}
                    style={[
                      styles.langItem,
                      { backgroundColor: isSelected ? `${colors.accent}15` : 'transparent' },
                    ]}
                  >
                    <Text style={styles.langItemFlag}>{item.flag}</Text>
                    <Text style={[styles.langItemName, { color: colors.textPrimary }]}>
                      {item.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  langSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  langLabel: { fontSize: 13, fontWeight: '500' },
  swapBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  box: { borderRadius: 16, padding: 16, marginBottom: 12 },
  textArea: { minHeight: 100, fontSize: 16, paddingVertical: 8, textAlignVertical: 'top' },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: { fontSize: 12 },
  translateBtn: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  translateBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultBox: { padding: 16, minHeight: 120 },
  resultText: { fontSize: 16, lineHeight: 24 },
  resultLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 8 },
  resultLoadingText: { fontSize: 14 },
  resultActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  actionChipText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  phraseEn: { fontWeight: '500' },
  phraseSw: { fontSize: 14, marginTop: 4 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  apiNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  apiNoteText: { fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalSearchInput: { flex: 1, fontSize: 15 },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  langItemFlag: { fontSize: 22 },
  langItemName: { flex: 1, fontSize: 15, fontWeight: '500' },
});
