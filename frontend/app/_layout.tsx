import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { loadFonts } from "@/components/Fonts";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = loadFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PaperProvider>
          <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SafeAreaView>
        </PaperProvider>
      </Provider>
    </ThemeProvider>
  );
}
