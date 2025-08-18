import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { initDb } from '../db';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

function RootLayoutInner() {
  const { colorScheme } = useTheme();
  const { user, loading } = useAuth();

  useFrameworkReady();

  useEffect(() => {
    initDb();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </ThemeProvider>
  );
}