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

/** Datos del menú con íconos de MaterialIcons y pantallas asociadas */
const menuItems = [
  { id: "1", name: "Inicio", icon: "dashboard", screen: "Informacion" },
  { id: "2", name: "Tus citas", icon: "event", screen: "TusCitas" },
  { id: "3", name: "Tus programas", icon: "assignment", screen: "TusProgramas" },
  { id: "4", name: "Resultados", icon: "fact-check" , screen: "Resultados"},
  { id: "5", name: "Medicamentos", icon: "medication", screen: "Medicamentos" },
  { id: "6", name: "Autocuidado", icon: "self-improvement", screen: "Autocuidado" },
];

const HomeScreen = ({ navigation }: any) => {
  /** Función para cerrar sesión */
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigation.navigate("Login"); // Redirige a la pantalla de inicio de sesión
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
      </View>
      {/* Lista de elementos del menú */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer} 
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              item.screen
                ? navigation.navigate(item.screen)
                : console.log(`Abrir ${item.name}`)
            }
          >
            <MaterialIcons
              name={item.icon as keyof typeof MaterialIcons.glyphMap}
              size={30}
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
    backgroundColor: colors.white,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    padding: 15,
    marginTop: 100,
    marginBottom: 20, 
  },
  listContainer: {
    alignItems: "center", 
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: 350, 
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.primary,
    marginBottom: 15,
    justifyContent: "center", 
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoutButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    color: colors.primary,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
