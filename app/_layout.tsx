import { setTokenGetter } from '@/api/api-client';
import { configureQueryClient } from '@/api/query-client';
import tokenCache from '@/components/biometrics/secure-token-storage';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, usePathname, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = configureQueryClient();
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

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

    // Group detection based on your semantics:
    // (public) => unauthenticated screens
    // (auth)   => authenticated-only screens
    const top = segments[0];
    const inPublicGroup = top === '(public)';
    const inAuthedGroup = top === '(auth)';
    const atRoot = pathname === '/';

    // 1) If signed-out user tries to access protected area → bounce to sign-in
    if (!isSignedIn && inAuthedGroup) {
      router.replace('/(public)/sign-in');
      return;
    }

    // 2) If signed-in user is in public area (sign-in/up/etc) → send to authed home
    if (isSignedIn && inPublicGroup) {
      router.replace('/(auth)/home'); // <-- your authed landing route
      return;
    }

    // 3) Optional: handle "/" intro page
    //    - If signed-in, skip intro and go to authed home.
    //    - If signed-out, stay on intro (index.tsx) until user taps "Get Started".
    if (atRoot && isSignedIn) {
      router.replace('/(auth)/home');
      return;
    }

  }, [isLoaded, isSignedIn, segments, pathname, router]);

  return <Slot />;
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <InitialLayout />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
