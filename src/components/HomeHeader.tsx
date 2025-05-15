import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type Props = {
  nombre: string;
  sexo: string;
  onLogout: () => void;
};

type RootStackParamList = {
  Informacion: undefined;
};

const HomeHeader: React.FC<Props> = ({ nombre, sexo, onLogout }) => {
  const saludo = sexo === "F" ? "¡Bienvenida!" : "¡Bienvenido!";
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const capitalize = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.saludo}>{saludo}</Text>
          <Text style={styles.nombre}>{capitalize(nombre)}</Text>
        </View>

        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => setMenuVisible(!menuVisible)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person" size={20} color={colors.preto} />
          </TouchableOpacity>

          <Modal
            transparent
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            {/* Cubre toda la pantalla */}
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setMenuVisible(false)}
            >
              {/* Evita que el touch dentro del menú también lo cierre */}
              <Pressable style={styles.menu}>
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
              </Pressable>
            </Pressable>
          </Modal>
        </View>
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
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  saludo: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.preto,
  },
  nombre: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: colors.preto,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeHeader;
