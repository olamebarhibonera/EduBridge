import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Linking from 'expo-linking';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { parseAuthTokensFromUrl, isAuthCallbackUrl } from '../utils/authDeepLink';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const handledInitialUrl = useRef(false);

  const refreshSession = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (currentSession?.user) {
        setSession(currentSession);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email ?? '',
          user_metadata: currentSession.user.user_metadata,
        });
      } else {
        setSession(null);
        setUser(null);
      }
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

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (currentSession?.user) {
        setSession(currentSession);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email ?? '',
          user_metadata: currentSession.user.user_metadata,
        });
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    const linkSub = Linking.addEventListener('url', async ({ url }) => {
      const handled = await handleAuthUrl(url);
      if (handled) {
        await refreshSession();
      }
    });

    return () => {
      authSub.unsubscribe();
      linkSub.remove();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
