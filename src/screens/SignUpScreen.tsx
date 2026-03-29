import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';

const universities = [
  'University of Nairobi',
  'Kenyatta University',
  'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
  'Moi University',
  'Egerton University',
  'Maseno University',
  'Masinde Muliro University of Science and Technology (MMUST)',
  'Dedan Kimathi University of Technology (DeKUT)',
  'Technical University of Kenya (TUK)',
  'Technical University of Mombasa (TUM)',
  'Pwani University',
  'Chuka University',
  'Meru University of Science and Technology (MUST)',
  'Karatina University',
  'Kisii University',
  'Laikipia University',
  'Maasai Mara University',
  'South Eastern Kenya University (SEKU)',
  'Muranga University of Technology (MUT)',
  'University of Eldoret',
  'Kibabii University',
  'Taita Taveta University (TTU)',
  'Rongo University',
  'Kaimosi Friends University',
  'Koitaleel Samoei University College',
  'Mama Ngina University College',
  'Tom Mboya University',
  'Open University of Kenya',
  'Riara University',
  'Strathmore University',
  'United States International University - Africa (USIU-Africa)',
  'Daystar University',
  'Africa Nazarene University',
  'Catholic University of Eastern Africa (CUEA)',
  'Mount Kenya University (MKU)',
  'KCA University',
  'Kabarak University',
  'Zetech University',
  'Pan Africa Christian University (PAC)',
  'Scott Christian University',
  'St Pauls University',
  'Kenya Methodist University (KeMU)',
  'Kiriri Womens University of Science and Technology',
  'Great Lakes University of Kisumu (GLUK)',
  'Gretsa University',
  'Umma University',
  'Management University of Africa (MUA)',
  'Presbyterian University of East Africa (PUEA)',
  'The East African University',
  'Adventist University of Africa',
  'International Leadership University (ILU)',
  'Tangaza University',
  'Islamic University of Kenya',
  'Other',
];

const courses = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Medicine',
  'Engineering',
  'Law',
  'Other',
];

export function SignUpScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showUniversityPicker, setShowUniversityPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    course: '',
    studentId: '',
    country: '',
    arrivalDate: '',
  });

  const setField = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    const normalizedEmail = formData.email.trim().toLowerCase();
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            university: formData.university,
            course: formData.course,
            student_id: formData.studentId,
            country: formData.country,
            arrival_date: formData.arrivalDate,
          },
          emailRedirectTo: 'edubridge://auth/callback',
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (data?.user && !data?.session) {
        setFormData((prev) => ({ ...prev, email: normalizedEmail }));
        setSuccess(true);
      } else if (data?.session) {
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Sign up failed');
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: 'edubridge://auth/callback' },
      });
    } catch (err: any) {
      setError(err?.message ?? `Failed to sign up with ${provider}`);
    }
  };

  const handleResendConfirmation = async () => {
    setError('');
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email first');
      return;
    }
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
      });
      if (resendError) {
        setError(resendError.message);
      } else {
        setError('Confirmation email sent. Please check inbox and spam folder.');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend');
    }
  };

  if (success) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-circle" size={64} color="#16a34a" style={styles.successIcon} />
          <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Check Your Email!</Text>
          <Text style={[styles.successText, { color: colors.textSecondary }]}>
            We've sent a confirmation email to {formData.email}. Click the link in the email to activate your account.
          </Text>
          <Text style={[styles.successHint, { color: colors.textSecondary }]}>
            If you don't see it in 1-2 minutes, check Spam/Junk or tap resend below.
          </Text>
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Go to Login</Text>
          </Pressable>
          <Pressable onPress={handleResendConfirmation} style={styles.resendBtn}>
            <Text style={[styles.resendText, { color: colors.accent }]}>Resend confirmation email</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bgSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join the student community in Kenya</Text>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}><Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>1</Text></View>
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}><Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>2</Text></View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {step === 1 && (
            <>
              <View style={styles.oauthRow}>
                <Pressable onPress={() => handleOAuth('google')} style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Google</Text>
                </Pressable>
                <Pressable onPress={() => handleOAuth('facebook')} style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Facebook</Text>
                </Pressable>
              </View>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or sign up with email</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {step === 1 && (
            <>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput style={styles.input} placeholder="John Doe" value={formData.name} onChangeText={(v) => setField('name', v)} />
              <Text style={styles.label}>Email *</Text>
              <TextInput style={styles.input} placeholder="student@university.ac.ke" value={formData.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.label}>Password *</Text>
              <TextInput style={styles.input} placeholder="••••••••" value={formData.password} onChangeText={(v) => setField('password', v)} secureTextEntry />
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput style={styles.input} placeholder="••••••••" value={formData.confirmPassword} onChangeText={(v) => setField('confirmPassword', v)} secureTextEntry />
              <Pressable onPress={handleNextStep} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Continue</Text>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>University</Text>
              <Pressable style={styles.selectInput} onPress={() => setShowUniversityPicker(true)}>
                <Text style={formData.university ? styles.selectText : styles.selectPlaceholder}>
                  {formData.university || 'Select your university'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6b7280" />
              </Pressable>
              <Text style={styles.label}>Course of Study</Text>
              <Pressable style={styles.selectInput} onPress={() => setShowCoursePicker(true)}>
                <Text style={formData.course ? styles.selectText : styles.selectPlaceholder}>
                  {formData.course || 'Select your course'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6b7280" />
              </Pressable>
              <Text style={styles.label}>Student ID (Optional)</Text>
              <TextInput style={styles.input} placeholder="e.g. STU2026001" value={formData.studentId} onChangeText={(v) => setField('studentId', v)} />
              <Text style={styles.label}>Country of Origin</Text>
              <TextInput style={styles.input} placeholder="e.g. China" value={formData.country} onChangeText={(v) => setField('country', v)} />
              <Text style={styles.label}>Arrival Date in Kenya</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={formData.arrivalDate} onChangeText={(v) => setField('arrivalDate', v)} />
              <View style={styles.rowBtns}>
                <Pressable onPress={() => setStep(1)} style={styles.outlineBtn}>
                  <Text style={[styles.outlineBtnText, { color: colors.accent }]}>Back</Text>
                </Pressable>
                <Pressable onPress={handleSignUp} disabled={loading} style={styles.primaryBtn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
                </Pressable>
              </View>
            </>
          )}
        </View>

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
          <Text style={[styles.footerLink, { color: colors.accent }]}>Sign In</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showUniversityPicker} transparent animationType="fade" onRequestClose={() => setShowUniversityPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select University</Text>
            <ScrollView style={styles.modalList}>
              {universities.map((item) => (
                <Pressable
                  key={item}
                  style={styles.modalOption}
                  onPress={() => {
                    setField('university', item);
                    setShowUniversityPicker(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowUniversityPicker(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showCoursePicker} transparent animationType="fade" onRequestClose={() => setShowCoursePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Course</Text>
            <ScrollView style={styles.modalList}>
              {courses.map((item) => (
                <Pressable
                  key={item}
                  style={styles.modalOption}
                  onPress={() => {
                    setField('course', item);
                    setShowCoursePicker(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowCoursePicker(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: '#ec4899' },
  stepNum: { color: '#374151', fontWeight: '600' },
  stepNumActive: { color: '#fff' },
  stepLine: { width: 48, height: 4, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#ec4899' },
  card: { borderRadius: 16, padding: 24, marginBottom: 24 },
  oauthRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  oauthBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, alignItems: 'center' },
  oauthText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { paddingHorizontal: 16, fontSize: 12, color: '#6b7280' },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { flex: 1, fontSize: 14, color: '#991b1b' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, fontSize: 16 },
  selectInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  selectText: { fontSize: 16, color: '#111827' },
  selectPlaceholder: { fontSize: 16, color: '#9ca3af' },
  primaryBtn: { height: 48, backgroundColor: '#ec4899', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineBtn: { flex: 1, height: 48, borderWidth: 2, borderColor: '#ec4899', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: { fontSize: 16, fontWeight: '600' },
  rowBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
  successIcon: { alignSelf: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  successText: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  successHint: { fontSize: 13, textAlign: 'center', marginBottom: 8 },
  resendBtn: { marginTop: 12 },
  resendText: { fontSize: 14, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: { borderRadius: 16, padding: 16, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalList: { marginBottom: 12 },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalOptionText: { fontSize: 15 },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ec4899',
    borderRadius: 10,
  },
  modalCloseText: { color: '#fff', fontWeight: '600' },
});
