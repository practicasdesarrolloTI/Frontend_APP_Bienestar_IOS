import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
  Modal,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  backgroundColor?: string;
  transparent?: boolean;
  showProfileIcon?: boolean;
  onLogout: () => void;
};

type RootStackParamList = {
  Informacion: undefined;
};

const CustomHeader: React.FC<HeaderProps> = ({
  title = "",
  showBack = true,
  backgroundColor,
  transparent = false,
  showProfileIcon = false,
  onLogout,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View
      style={[
        styles.header,
        transparent
          ? styles.transparent
          : { backgroundColor: backgroundColor || colors.preto },
      ]}
    >
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

      {/* Icono de persona con menú */}
      {showProfileIcon && (
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <MaterialIcons
              name="person-outline"
              size={26}
              color={transparent ? colors.preto : "white"}
            />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.inlineMenu}>
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Informacion");
                }}
              >
                <Text style={styles.menuItem}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  onLogout();
                }}
              >
                <Text style={styles.menuItem}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 110,
    paddingTop: Platform.OS === "android" ? 15 : 10,
    paddingHorizontal: 20,
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
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  menuItem: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  inlineMenu: {
    position: "absolute",
    top: 55,
    right: 0,
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 999,
  },
});

export default CustomHeader;
