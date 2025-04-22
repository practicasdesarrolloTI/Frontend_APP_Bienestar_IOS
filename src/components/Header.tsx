import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  title: string;
  rightComponent?: React.ReactNode;
};

const Header: React.FC<Props> = ({ title, rightComponent}) => {
 
  return (
    <View >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>{rightComponent}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      },
  header: {
    width: "100%",
    height: 70,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  right: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});

export default Header;
