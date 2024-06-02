import { useFonts } from 'expo-font';

export const loadFonts = () => {
  const [fontsLoaded] = useFonts({
    "Dosis-ExtraBold": require("../assets/fonts/Dosis-ExtraBold.ttf"),
    "Dosis-Regular": require("../assets/fonts/Dosis-Regular.ttf"),
    "Dosis-Medium": require("../assets/fonts/Dosis-Medium.ttf"),
    "Dosis-Bold": require("../assets/fonts/Dosis-Bold.ttf"),
  });

  return fontsLoaded;
};