import React from "react";
import {
  View,
  Text,
  Image,
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
        source={require("../../assets/fono_prueba_app.jpg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title=""
          showBack={false}
          transparent={true}
          rightComponent={""}
        />

        {/* Contenido */}
        <View style={styles.container}>
          <View style={styles.phraseContainer}>
            <Text style={styles.text}>
              <Text style={styles.body}>Un modelo de atención </Text>
              <Text style={styles.body}>integral y cercano</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>

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
    paddingHorizontal: 30,
  },
  phraseContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  text: {
    fontSize: 36,
    textAlign: "left",
    color: colors.white,
  },
  body: {
    fontFamily: fonts.subtitle,
  },
  italic: {
    fontFamily: fonts.italic,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: colors.secondary,
    width: "98%",
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: fonts.title,
  },
  registerButton: {
    backgroundColor: colors.white,
    width: "98%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  registerText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.title,
  },
  headerText: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.subtitle,
  },
});

export default LandingScreen;
