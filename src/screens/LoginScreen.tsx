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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setEmailNotConfirmed(false);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Enter email and password');
      setLoading(false);
      return;
    }
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (signInError) {
        const msg = signInError.message;
        // Supabase often returns "Invalid login credentials" for unconfirmed email (security)
        const possiblyUnconfirmed =
          /not confirmed|confirm your email|email not confirmed|invalid login credentials/i.test(msg);
        setEmailNotConfirmed(possiblyUnconfirmed);
        setError(
          possiblyUnconfirmed && /invalid login credentials/i.test(msg)
            ? 'Invalid login credentials. If you just signed up, check your email and tap the confirmation link first, then try again.'
            : msg
        );
        setLoading(false);
        return;
      }
      if (data?.session) {
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred');
    }
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Enter your email above first');
      return;
    }
    setError('');
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
      });
      if (resendError) setError(resendError.message);
      else setError('Confirmation email sent. Check your inbox.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend');
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: 'edubridge://auth/callback' },
      });
      if (oauthError) setError(oauthError.message);
    } catch (err: any) {
      setError(err?.message ?? `Failed to login with ${provider}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🇰🇪</Text>
          <Text style={styles.heroTitle}>Welcome Back!</Text>
          <Text style={styles.heroSubtitle}>Sign in to your premium student companion</Text>
        </View>

        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" style={styles.errorIcon} />
              <View style={styles.errorContent}>
                <Text style={styles.errorText}>{error}</Text>
                {emailNotConfirmed && (
                  <Pressable onPress={handleResendConfirmation} style={styles.resendLink}>
                    <Text style={styles.resendLinkText}>Resend confirmation email</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="student@university.ac.ke"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { paddingRight: 48 }]}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9ca3af" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthRow}>
            <Pressable onPress={() => handleOAuth('google')} style={styles.oauthBtn}>
              <Text style={styles.oauthText}>Google</Text>
            </Pressable>
            <Pressable onPress={() => handleOAuth('facebook')} style={styles.oauthBtn}>
              <Text style={styles.oauthText}>Facebook</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.footerLink}>Sign Up</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ec4899' },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center', paddingVertical: 48 },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroEmoji: { fontSize: 48, marginBottom: 16 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  errorIcon: { marginTop: 2 },
  errorContent: { flex: 1 },
  errorText: { fontSize: 14, color: '#991b1b' },
  resendLink: { marginTop: 8 },
  resendLinkText: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputWrap: { position: 'relative', marginBottom: 16 },
  inputIcon: { position: 'absolute', left: 14, top: 14, zIndex: 1 },
  input: {
    height: 48,
    paddingLeft: 44,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  eyeBtn: { position: 'absolute', right: 12, top: 14 },
  primaryBtn: {
    height: 48,
    backgroundColor: '#db2777',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#d1d5db' },
  dividerText: { paddingHorizontal: 16, fontSize: 14, color: '#6b7280' },
  oauthRow: { flexDirection: 'row', gap: 12 },
  oauthBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  oauthText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  footerLink: { color: '#fcd34d', fontWeight: '700', fontSize: 14 },
});
