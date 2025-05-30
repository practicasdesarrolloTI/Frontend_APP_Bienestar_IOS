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
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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
        source={require("../../assets/backgrounds/Landing.png")}
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
          {/* Logo de la aplicación */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/logos/LogoZentriablanco.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
 
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },
  loginButton: {
    backgroundColor: colors.primary,
    width: scale(310),
    paddingVertical: verticalScale(15),
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
    paddingVertical: verticalScale(15),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
    alignItems: "center",
  },
  registerText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: verticalScale(12),
  },  
  image: {
    width: scale(200),
    aspectRatio: 0.8,
  },
});

export default LandingScreen;
