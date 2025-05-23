import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import CustomHeader from "../components/CustomHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/Fondos/Landing.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          showBack={false}
          transparent={true}
          showProfileIcon={false}
          onLogout={() => {}}
        />

        {/* Contenido */}
        <View style={styles.container}>
          <View style={styles.phraseContainer}>
            <Text style={styles.text}>
              <Text style={styles.body}>Un modelo de atención </Text>
              <Text style={styles.body}>integral y cercano</Text>
            </Text>
          </View>

          {/* Botones de inicio de sesión */}
          <View style={styles.buttonContainer}>
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  phraseContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginRight: 50,
    marginLeft: 15,
  },
  text: {
    fontSize: 40,
    
    textAlign: "left",
    color: colors.white,
  },
  body: {
    fontFamily: fonts.title,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: colors.secondary,
    width: "95%",
    paddingVertical: 20,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  loginText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.title,
  },
  registerButton: {
    backgroundColor: colors.white,
    width: "95%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  registerText: {
    color: colors.preto,
    fontSize: 22,
    fontFamily: fonts.title,
  },
});

export default LandingScreen;
