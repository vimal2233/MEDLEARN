'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance, ColorSchemeName, Platform } from 'react-native';
import { lightTheme, darkTheme, type Theme } from '@/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  colorScheme: ColorSchemeName;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const { getItem } = await import('@react-native-async-storage/async-storage');
        const saved = await getItem('themeMode');
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setThemeModeState(saved as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadThemePreference();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const resolvedTheme = themeMode === 'system' ? colorScheme : themeMode;
  const isDark = resolvedTheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      const { setItem } = await import('@react-native-async-storage/async-storage');
      await setItem('themeMode', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  // Set status bar style for Expo
  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const { StatusBar } = await import('expo-status-bar');
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
        StatusBar.setBackgroundColor(isDark ? darkTheme.colors.background : lightTheme.colors.background, true);
      } catch (error) {
        // StatusBar might not be available
      }
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, colorScheme, setThemeMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useColorScheme = (): ColorSchemeName => {
  return useContext(ThemeContext)?.colorScheme ?? 'light';
};