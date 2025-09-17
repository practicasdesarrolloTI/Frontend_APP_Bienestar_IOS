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

export default function BackgroundPerfil({ children, headerHeight }: Props) {
  const { width, height } = useWindowDimensions();
  const HH = headerHeight ?? Math.max(130, Math.min(260, height * 0.2));
  const HLogo = headerHeight ?? Math.max(200, Math.min(423, height * 0.3));
  const HLabel = Math.max(346, Math.min(710 , height * 0.52));

  return (
    <View style={styles.root}>

      {/* 1) Capa intermedia: header + fotoLanding */}
      <View style={styles.bgLayer1}>
        <View
          style={{
            height: HH,
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
              source={require("../../../assets/logos/LogoCuidarMe.png")}
              style={{
                position: "absolute",
                height: HLogo * 0.3,
                resizeMode: "contain",
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: height - HH,
            padding: 0,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Image
              source={require("../../../assets/backgrounds/fotoLanding.png")}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                resizeMode: "cover",
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
              }}
            />
          </View>
        </View>
      </View>

      <View style={[styles.bgLayer2]}>
        <View
          style={{
            top: HLabel
          }}
        >
          <View >
            <Text style={styles.label}>
              {" "}
              Un modelo de atención integral y cercano
            </Text>
          </View>
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
    backgroundColor: colors.white,
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
    backgroundColor: "#EDEDED",
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
