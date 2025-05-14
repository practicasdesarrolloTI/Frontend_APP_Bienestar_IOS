import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import colors from "../themes/colors";

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
        <ActivityIndicator size="large" color={colors.primary} />
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
});

export default LoadingScreen;
