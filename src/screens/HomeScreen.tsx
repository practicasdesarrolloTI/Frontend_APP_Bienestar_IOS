import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  BackHandler,
  Modal,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fonts } from "../themes/fonts";
import { getPatientByDocument } from "../services/patientService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Toast from "react-native-toast-message";
import HomeHeader from "../components/HomeHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/** Datos del menú con íconos de MaterialIcons y pantallas asociadas */
const menuItems = [
  { id: "1", name: "Información", icon: "dashboard", screen: "Informacion" },
  { id: "2", name: "Citas", icon: "event", screen: "TusCitas" },
  {
    id: "3",
    name: "Programas",
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
  const [nombrePaciente, setNombrePaciente] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text1: "Sesión cerrada",
      text2: "Has cerrado sesión correctamente.",
    });
    navigation.replace("Login");
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
        size={40}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={styles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  /** Cargar el nombre del paciente desde AsyncStorage */
  useEffect(() => {
    const loadPaciente = async () => {
      try {
        const documento = await AsyncStorage.getItem("documento");
        if (!documento) return;
        const paciente = await getPatientByDocument(documento);
        if (paciente) {
          const nombreCompleto = `${paciente.primer_nombre} ${paciente.primer_apellido}`;
          const sexo = paciente.sexo;
          setNombrePaciente(nombreCompleto);
          setSexo(sexo);
        }
      } catch (error) {
        console.error("Error al cargar paciente", error);
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();

    // Manejo del botón de "Atrás" en Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setModalVisible(true);
        return true; // Prevenir navegación automática
      }
    );

    return () => backHandler.remove();
  }, []);

  /* Función para capitalizar el nombre */
  const capitalizeName = (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/fondo_preuba_app2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        {nombrePaciente && sexo && (
          <HomeHeader nombre={nombrePaciente} sexo={sexo} />
        )}
        
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.grid}
          />

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="logout" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Modal de Confirmación */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>¿Deseas cerrar sesión?</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.confirmText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / 2 - 45;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  grid: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  menuItem: {
    width: itemSize,
    height: itemSize,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.background,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    padding: 5,
  },
  icon: {
    marginBottom: 10,
  },
  menuText: {
    fontSize: 17,
    color: colors.primary,
    textAlign: "center",
    fontFamily: fonts.title,
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginLeft: 15,
    fontSize: 20,
    // marginBottom: 2,
    color: colors.preto,
    fontFamily: fonts.body,
  },
  labelName: {
    marginLeft: 15,
    fontSize: 20,
    marginBottom: 15,
    color: colors.preto,
    fontFamily: fonts.title,
  },
  // Modal styles
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.secondary,
    marginRight: 10,
  },
  cancelText: {
    color: "white",
    fontFamily: fonts.title,
  },
  confirmButton: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  confirmText: {
    color: "white",
    fontFamily: fonts.title,
  },
});

export default HomeScreen;
