import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { parseAuthTokensFromUrl, isAuthCallbackUrl } from '../utils/authDeepLink';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  university?: string;
  course?: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  status: string;
  preferred_language?: string;
  user_metadata?: Record<string, unknown>;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshSession: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function handleAuthUrl(url: string | null): Promise<boolean> {
  if (!isAuthCallbackUrl(url)) return false;
  const tokens = parseAuthTokensFromUrl(url);
  if (!tokens) return false;
  try {
    const { error } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
    return !error;
  } catch {
    return false;
  }
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const handledInitialUrl = useRef(false);

  const setSessionAndProfile = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      setSession(currentSession);
      const profile = await fetchProfile(currentSession.user.id);
      if (profile) {
        setUser({
          ...profile,
          user_metadata: currentSession.user.user_metadata,
        });
      } else {
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email ?? '',
          role: 'student',
          status: 'active',
          user_metadata: currentSession.user.user_metadata,
        });
      }
    } else {
      setSession(null);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      await setSessionAndProfile(currentSession);
    } catch (error) {
      console.error('Session refresh error:', error);
      setSession(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!handledInitialUrl.current) {
        handledInitialUrl.current = true;
        const initialUrl = await Linking.getInitialURL();
        const handled = await handleAuthUrl(initialUrl);
        if (handled) await refreshSession();
      }
      await refreshSession();
      setLoading(false);
    };
    initAuth();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        await setSessionAndProfile(currentSession);
        setLoading(false);
      }
    );

    const linkSub = Linking.addEventListener('url', async ({ url }) => {
      const handled = await handleAuthUrl(url);
      if (handled) await refreshSession();
    });

    return () => {
      authSub.unsubscribe();
      linkSub.remove();
    };
  }, []);

  const signOut = async () => {
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore errors — local state is already cleared
    }
    // Belt-and-suspenders: clear persisted session from storage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter((k) => k.startsWith('sb-') || k.includes('supabase'));
      if (authKeys.length > 0) await AsyncStorage.multiRemove(authKeys);
    } catch {
      // Ignore storage cleanup errors
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (!error) {
      setUser({ ...user, ...updates });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAdmin, signOut, refreshSession, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
