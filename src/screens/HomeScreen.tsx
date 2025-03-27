import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/** Datos del menú con íconos de MaterialIcons y pantallas asociadas */
const menuItems = [
  { id: "1", name: "Inicio", icon: "dashboard", screen: "Informacion" },
  { id: "2", name: "Tus citas", icon: "event", screen: "TusCitas" },
  {
    id: "3",
    name: "Tus programas",
    icon: "assignment",
    screen: "TusProgramas",
  },
  { id: "4", name: "Resultados", icon: "fact-check", screen: "Resultados" },
  { id: "5", name: "Medicamentos", icon: "medication", screen: "Medicamentos" },
  {
    id: "6",
    name: "Autocuidado",
    icon: "self-improvement",
    screen: "Autocuidado",
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  /** Función para cerrar sesión */
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigation.navigate("Login"); // Redirige a la pantalla de inicio de sesión
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() =>
        item.screen
          ? navigation.navigate(item.screen as any)
          : console.log(`Abrir ${item.name}`)
      }
    >
      <MaterialIcons
        name={item.icon as keyof typeof MaterialIcons.glyphMap}
        size={50}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={styles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
      />

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / 2 - 50; // Ajuste dinámico

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: "flex-start",
    padding: 15,
    marginTop: 30,
    marginBottom: 40,
  },
  grid: {
    alignItems: "center",
  },
  menuItem: {
    width: itemSize,
    height: itemSize,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default HomeScreen;
