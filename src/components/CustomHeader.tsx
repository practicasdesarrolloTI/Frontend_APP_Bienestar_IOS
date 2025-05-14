import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  transparent?: boolean;
};

const CustomHeader: React.FC<HeaderProps> = ({
  title = "",
  showBack = true,
  rightComponent,
  backgroundColor,
  transparent = false,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.header,
        transparent
          ? styles.transparent
          : { backgroundColor: backgroundColor || colors.preto },
      ]}
    >
      {/* Botón de regreso */}
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="chevron-left"
            size={28}
            color={transparent ? colors.preto : "white"}
          />
        </TouchableOpacity>
      )}

      {/* Título centrado */}
      <View style={styles.tittleStyles}>
        {!!title && (
          <Text
            style={[
              styles.title,
              { color: transparent ? colors.preto : "white" },
            ]}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Componente a la derecha */}
      <View>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingTop: Platform.OS === "android" ? 15 : 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  transparent: {
    backgroundColor: "transparent" as ViewStyle["backgroundColor"],
  },
  tittleStyles: {
    marginLeft: 15,
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.title,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: colors.white,
    elevation: 5,
  },
});

export default CustomHeader;
