import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts, DMSans_400Regular, DMSans_500Medium } from "@expo-google-fonts/dm-sans";
import { Taviraj_400Regular, Taviraj_500Medium_Italic } from "@expo-google-fonts/taviraj";
import { Text, View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    Taviraj_400Regular,
    Taviraj_500Medium_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando fuentes...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}