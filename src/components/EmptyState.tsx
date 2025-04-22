import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  message: string;
};

const EmptyState: React.FC<Props> = ({ message }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search-off" size={60} color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textAlign: "center",
  },
});

export default EmptyState;
