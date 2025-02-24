import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";

/** Datos del menú con íconos de MaterialIcons */
const menuItems = [
  { id: "1", name: "Inicio", icon: "dashboard" as const },
  { id: "2", name: "Tus citas", icon: "event" as const },
  { id: "3", name: "Tus programas", icon: "assignment" as const },
  { id: "4", name: "Resultados", icon: "fact-check" as const },
  { id: "5", name: "Formulaciones y ordenamientos", icon: "medication" as const },
  { id: "6", name: "Trámites y autorizaciones", icon: "article" as const },
  { id: "7", name: "Autocuidado", icon: "self-improvement" as const },
  { id: "8", name: "Alertas", icon: "notifications-active" as const },
  { id: "9", name: "Entérate", icon: "campaign" as const },
  { id: "10", name: "Servicios", icon: "business-center" as const },
];

const HomeScreen = ({ navigation }: any) => {
  /** Función para cerrar sesión */
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigation.navigate("Login"); // Redirige a la pantalla de inicio de sesión
    
  };

  return (
    <View style={styles.container}>
      {/* Sección del perfil */}
      <View style={styles.header}>
        {/* <MaterialIcons name="account-circle" size={40} color={colors.primary} /> */}
      </View>

      {/* Lista de elementos del menú */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              item.id === "1" ? navigation.navigate("PatientInfo") : console.log(`Abrir ${item.name}`)
            }

          >
            <MaterialIcons
              name={item.icon}
              size={25}
              color={colors.primary}
              style={styles.icon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    alignItems: "flex-end",
    padding: 15,
    marginTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.primary,
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoutButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    color: colors.primary,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
