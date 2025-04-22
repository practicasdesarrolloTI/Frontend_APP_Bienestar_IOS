import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { Taviraj_400Regular, Taviraj_500Medium_Italic,Taviraj_900Black,Taviraj_700Bold_Italic} from "@expo-google-fonts/taviraj";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/CustomToast";

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    Taviraj_400Regular,
    Taviraj_500Medium_Italic,
    DMSans_700Bold,
    Taviraj_900Black,
    Taviraj_700Bold_Italic,
    
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando fuentes...</Text>
      </View>
    );
  }

  return (<GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider>
    <AppNavigator />
    <Toast
      position="top"
      visibilityTime={5000}
      autoHide={true}
      config={{
        success: (props) => <CustomToast {...{ ...props, text1: props.text1 || "Default success message" }} type="success" />,
        error: (props) => <CustomToast {...{ ...props, text1: props.text1 || "Default error message" }} type="error" />,
        info: (props) => <CustomToast {...{ ...props, text1: props.text1 || "Default info message" }} type="info" />,
      }}
    />
    </PaperProvider>
  </GestureHandlerRootView>
);
};

  