import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../themes/colors";

/** Texto y funcionamiento del botón */
interface Props {
  title: string;
  onPress: () => void;
}

/** Botón personalizado reutilizable en la app */
const CustomButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
