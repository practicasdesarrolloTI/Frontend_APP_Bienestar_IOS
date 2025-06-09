import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
} from "react-native";
import LottieView from "lottie-react-native";
import colors from "../themes/colors";
import { scale, verticalScale } from "react-native-size-matters";
import { fonts } from "../themes/fonts";

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/fondo_preuba_app2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Lottie Animation */}
          <LottieView
            source={require("../../assets/lottie/LoadingHeart.json")}
            autoPlay
            loop
            progress={21 / 210}
            style={styles.lottie}
          />
          <Text style={styles.loadingText}>Cargando...</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },

  lottie: {
    width: scale(200),
    height: verticalScale(200),
  },

  loadingText: {
    fontFamily: fonts.body,
    fontSize: scale(16),
    color: colors.primary,
    marginTop: verticalScale(2),
  },
});

export default LoadingScreen;
