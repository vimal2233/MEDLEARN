import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

// Supabase configuration - these should be set via environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.'
  );
}

// Storage adapter for React Native
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
    };
  }

  // For native, we'll use AsyncStorage
  return {
    getItem: async (key: string) => {
      try {
        const { getItem } = await import('@react-native-async-storage/async-storage');
        return await getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        const { setItem } = await import('@react-native-async-storage/async-storage');
        await setItem(key, value);
      } catch (error) {
        console.warn('Failed to set storage item:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        const { removeItem } = await import('@react-native-async-storage/async-storage');
        await removeItem(key);
      } catch (error) {
        console.warn('Failed to remove storage item:', error);
      }
    },
  };
};

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': `medlearn/${Platform.OS}`,
    },
  },
});

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: 'medlearn://auth/callback',
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'medlearn://auth/reset-password',
    });
    return { data, error },
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    return { data, error };
  },

  // Update user metadata
  updateUser: async (metadata: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.updateUser({ data: metadata });
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    create: async (profile: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      return { data, error };
    },

    update: async (userId: string, updates: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    },
  },

  // Generic query builder
  from: (table: string) => supabase.from(table),
};

// Real-time subscriptions
export const realtime = {
  subscribe: (table: string, filter: string, callback: (payload: unknown) => void) => {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table, filter }, callback)
      .subscribe();
  },
};

export default supabase;