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
      <MaterialIcons name="search-off" size={64} color={colors.preto} />
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
    paddingVertical: 10,
  },
  text: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: fonts.subtitle,
    color: colors.preto,
    textAlign: "center",
  },
});

export default EmptyState;
