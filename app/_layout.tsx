import React from 'react';
import { Stack } from 'expo-router';
import { Providers } from '@/components/Providers';
import { SplashScreen } from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Providers>
  );
}