import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  nombre: string;
  sexo: string;
   onProfilePress?: () => void
};

const HomeHeader: React.FC<Props> = ({ nombre, sexo }) => {
  const saludo = sexo === "F" ? "¡Bienvenida!" : "¡Bienvenido!";
  const capitalize = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.nombre}>{capitalize(nombre)}</Text>
      </View>
      <View style={styles.right}>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
header: {
  height: 120,
  paddingTop: Platform.OS === "android" ? 15 : 10,
  paddingHorizontal: 20,
  justifyContent: "flex-end",
  backgroundColor: "transparent", 
},
  left: {
    marginRight: 15,
  },
  right: {
    flex: 1,
  },
  saludo: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.preto,
  },
  nombre: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.preto,
  },
});

export default HomeHeader;