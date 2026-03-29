import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Use env vars if set (create .env with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY)
// Otherwise fallback to default project (same as web app)
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://xhitkkmtytcakjqytlnm.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaXRra210eXRjYWtqcXl0bG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTU2MTEsImV4cCI6MjA4NzA5MTYxMX0.ngCbkwn_f2f8nYiKzS1qCx0rSgbYFsQ4-pqBdsy7kOo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
