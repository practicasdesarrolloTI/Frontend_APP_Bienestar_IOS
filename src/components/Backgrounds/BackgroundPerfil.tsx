import React from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Text,
} from "react-native";
import colors from "../../themes/colors";

type Props = { children?: React.ReactNode; headerHeight?: number };

export default function BackgroundPerfil({ children, headerHeight }: Props) {
  const { width, height } = useWindowDimensions();
  const HH =
    headerHeight ?? Math.round(Math.max(130, Math.min(260, height * 0.20)));

  return (
    <View style={styles.root}>
      {/* Capa de fondo completa */}
      <View style={styles.bgLayer}>
        <View
          style={{
            height: HH,
            backgroundColor: "#292F65",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              source={require("../../../assets/backgrounds/logoPerfil.png")}
              style={{
                position: "absolute",
                height: HH * 0.45,
                resizeMode: "contain"
              }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            width: width * 0.9,
            height:height * 0.70,
            alignSelf: "center"           
          }}
        >
        </View>
      </View>
      {/* Contenido: SIEMPRE por encima del fondo */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EDEDED",

  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // fondo debajo
  },
  contentLayer: {
    flex: 1,
    zIndex: 1, // contenido encima
    position: "relative", // sin paddingTop forzado
  },
  body: {
    backgroundColor: "#EDEDED",
  },
});
