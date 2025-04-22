import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import Header from "../components/Header";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <Header
        title=""
        rightComponent={
          <Image
            source={require("../../assets/logomecuidosinletra.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        }
      />
      
      <View style={styles.container}>
        <Image
          source={require("../../assets/imagenmuestra2.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>
          <Text style={styles.body}>Un modelo de atención </Text>
          <Text style={styles.italic}>integral y cercano</Text>
        </Text>

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
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  
  logo: {
    height: 35,
    marginVertical: 15,
    tintColor: colors.white,
  },
  text: {
    fontSize: 17,
    textAlign: "center",
    color: colors.preto,
    marginBottom: 5,
    marginTop: 30,
  },
  body: {
    fontFamily: fonts.subtitle,
  },
  italic: {
    fontFamily: fonts.italic,
  },
  image: {
    height: 170,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: colors.primary,
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
    borderWidth: 1.5,
    borderColor: colors.primary,
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
});

export default LandingScreen;
