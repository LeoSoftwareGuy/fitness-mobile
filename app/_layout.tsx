import { setTokenGetter } from '@/api/api-client';
import { configureQueryClient } from '@/api/query-client';
import tokenCache from '@/components/biometrics/secure-token-storage';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, usePathname, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';
import '../global.nativewind';

SplashScreen.preventAutoHideAsync();

const queryClient = configureQueryClient();
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#151515',
    card: '#151515',
    primary: '#FFFFFF',
  },
};

function InitialLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) setTokenGetter(getToken);
  }, [isLoaded, getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    const top = segments[0];
    const inPublicGroup = top === '(public)';
    const inAuthedGroup = top === '(auth)';
    const atRoot = pathname === '/';

    if (!isSignedIn && inAuthedGroup) {
      router.replace('/(public)/sign-in');
      return;
    }

    if (isSignedIn && inPublicGroup) {
      router.replace('/(auth)/home');
      return;
    }

    if (atRoot && isSignedIn) {
      router.replace('/(auth)/home');
      return;
    }

  }, [isLoaded, isSignedIn, segments, pathname, router]);

  return (
    <ThemeProvider value={customTheme}>
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Righteous-Regular': require('../assets/fonts/Righteous-Regular.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache()}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#151515' }}>
        <QueryClientProvider client={queryClient}>
          <InitialLayout />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}