import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import BackgroundLanding from "../components/Backgrounds/BackgroundLanding";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const HBotones = Math.max(466, Math.min(965, height * 0.70));

  return (
    <BackgroundLanding>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />

        {/* Contenido */}
        <View style={styles.container}>
          {/* Botones de inicio de sesión */}
          <View style={[styles.buttonContainer, { top: HBotones }]}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Botón de registro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLanding>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    display: "flex",
    paddingHorizontal: scale(15),
  },
  buttonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: colors.primary,
    width: scale(310),
    paddingVertical: verticalScale(12),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
    alignItems: "center",
  },
  loginText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
  },
  registerButton: {
    backgroundColor: colors.secondary,
    width: scale(310),
    paddingVertical: verticalScale(12),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
    alignItems: "center",
  },
  registerText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
  },
});

export default LandingScreen;
