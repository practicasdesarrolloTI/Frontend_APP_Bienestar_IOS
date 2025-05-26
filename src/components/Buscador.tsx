import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

const Buscador = ({ value, onChange, placeholder = "Buscar..." }: Props) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color="#999" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    paddingLeft: 10,
    color: colors.preto,
  },
});

export default Buscador;