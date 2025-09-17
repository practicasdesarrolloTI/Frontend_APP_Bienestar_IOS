import React from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Text,
} from "react-native";
import colors from "../../themes/colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
type Props = { children?: React.ReactNode; headerHeight?: number };

export default function BackgroundSummary({ children, headerHeight }: Props) {
  const { width, height } = useWindowDimensions();
  const HH = headerHeight ?? Math.max(80, Math.min(165, height * 0.12 ));
  const HLogo = headerHeight ?? Math.max(200, Math.min(423, height * 0.3));

  return (
    <View style={styles.root}>
      {/* 1) Capa intermedia: header + fotoLanding */}
      <View style={styles.bgLayer1}>
        <View
          style={{
            top: "50%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              source={require("../../../assets/backgrounds/LogoGrande.png")}
              style={{
                position: "absolute",
                width: width,
                resizeMode: "contain",
              }}
            />
          </View>
        </View>
      </View>

      {/* 2) Capa 2: container blanco*/}
      <View style={[styles.bgLayer2]}>
        <View
          style={{
            top: HH,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              height: height - HH,
              width: width * 0.85,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          ></View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            source={require("../../../assets/logos/LogoZentriablanco.png")}
            style={{ height: HLogo * 0.25, aspectRatio: 0.8 }}
            resizeMode="contain"
          />
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
    backgroundColor: colors.background,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // fondo debajo
  },
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // fondo debajo
  },
  bgLayer2: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2, // fondo debajo
  },
  contentLayer: {
    flex: 1,
    zIndex: 3, // contenido encima
    position: "relative", // sin paddingTop forzado
  },
  body: {
    backgroundColor: colors.background,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    aspectRatio: 0.8,
  },
  label: {
    color: colors.white,
    fontSize: moderateScale(34),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
