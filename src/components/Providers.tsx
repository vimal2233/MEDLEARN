'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { SplashScreen } from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { useTheme as useThemeHook } from '@/contexts/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProvidersContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialized, loading } = useAuth();
  const { isDark } = useThemeHook();

  useEffect(() => {
    if (initialized && !loading) {
      SplashScreen.hideAsync();
    }
  }, [initialized, loading]);

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#0A1628' : '#F8FAFC' }}>
        <ActivityIndicator size="large" color={isDark ? '#14C9B0' : '#1A6BB8'} />
      </View>
    );
  }

  return <>{children}</>;
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ProvidersContent>{children}</ProvidersContent>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};