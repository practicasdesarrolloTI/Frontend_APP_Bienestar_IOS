import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  fechaInicio: string;
  fechaFin: string;
  onChangeInicio: (fecha: string) => void;
  onChangeFin: (fecha: string) => void;
};

const CustomDateRangeFilter: React.FC<Props> = ({
  fechaInicio,
  fechaFin,
  onChangeInicio,
  onChangeFin,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Desde (YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          value={fechaInicio}
          placeholder="Ej: 2024-01-01"
          onChangeText={onChangeInicio}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Hasta (YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          value={fechaFin}
          placeholder="Ej: 2024-12-31"
          onChangeText={onChangeFin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  field: {
    flex: 1,
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.subtitle,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: fonts.body,
    fontSize: 14,
    color: "#333",
  },
});

export default CustomDateRangeFilter;
