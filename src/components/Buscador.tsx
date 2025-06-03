import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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
      <MaterialIcons name="search" size={moderateScale(20)} color="#999" />
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
    paddingHorizontal: moderateScale(10),
    alignItems: "center",
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  input: {
    flex: 1,
    height: verticalScale(35),
    fontSize: moderateScale(16),
    paddingLeft: moderateScale(10),
    color: colors.preto,
  },
});

export default Buscador;
