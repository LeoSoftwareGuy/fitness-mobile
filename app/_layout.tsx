import { configureQueryClient } from '@/api/query-client';
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = configureQueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Righteous-Regular": require("../assets/fonts/Righteous-Regular.ttf"),
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="intro" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(bio)" options={{ headerShown: false }} />
          <Stack.Screen name="(calendar)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(todays-workout)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(exercise-history)/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(muscle-group)/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(onboarding)/onBoardingScreen"
            options={{ headerShown: false }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};