import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler,
  ImageBackground,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fonts } from "../themes/fonts";
import { getPatientByDocument } from "../services/patientService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from "../components/LoadingScreen";
import Toast from "react-native-toast-message";
import HomeHeader from "../components/HomeHeader";
import LogOutModal from "../components/LogOutModal";
import Carousel from "../components/Carousel";
import CustomHeader from "../components/CustomHeader";
import { fetchProgramas } from "../services/programService";
import { Scroll } from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Programa = {
  id: string;
  fecha_cita: string;
  programa: string;
  hora: string;
  medico: string;
  especialidad: string;
  estado: string;
};

/** Datos del menú con íconos de MaterialIcons y pantallas asociadas */
const menuItems = [
  { id: "1", name: "Información", icon: "dashboard", screen: "Informacion" },
  { id: "2", name: "Citas", icon: "event", screen: "TusCitas" },
  { id: "3", name: "Programas", icon: "assignment", screen: "TusProgramas" },
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
  const [hasError, setHasError] = useState(false);
  const [tienePrograma, setTienePrograma] = useState<boolean>(true);
  const [programas, setProgramas] = useState<Programa[]>([]);

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

  /** Renderizar cada elemento del menú */
  const renderItem = ({ item }: any) => {
    const isAutocuidado = item.name === "Autocuidado";
    const disabled = isAutocuidado && sinProgramas;

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          disabled && styles.disabledItem,
          disabled && { opacity: 0.6 },
        ]}
        disabled={disabled}
        onPress={() => item.screen && navigation.navigate(item.screen as any)}
      >
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={35}
          color={disabled ? colors.lightGray : colors.preto}
        />
        <Text
          style={[styles.menuText, disabled && { color: colors.lightGray }]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  /** Manejar el evento de retroceso del hardware */
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setModalVisible(true);
          return true;
        }
      );

      return () => backHandler.remove();
    }, [])
  );

  /** Cargar el nombre del paciente desde AsyncStorage */
  useEffect(() => {
    const loadPaciente = async () => {
      try {
        const documento = await AsyncStorage.getItem("documento");
        if (!documento) throw new Error("No hay documento");
        const tipoDocumento = await AsyncStorage.getItem("tipoDocumento");
        if (tipoDocumento && documento) {
          const programas = await fetchProgramas(tipoDocumento, documento);
          setProgramas(programas);
        }

        const paciente = await getPatientByDocument(documento);
        if (paciente) {
          const nombreCompleto = `${paciente.primer_nombre} ${
            paciente.segundo_nombre ?? ""
          } ${paciente.primer_apellido}`;
          setNombrePaciente(nombreCompleto);
          setSexo(paciente.sexo);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error("Error al cargar paciente", error);
        setHasError(true); // activa la bandera de error
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();
  }, []);

  const sinProgramas =
    programas.length === 0 ||
    programas.every(
      (p) =>
        !p.programa || p.programa.toLowerCase().includes("no tiene programa")
    );

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
        {!loading &&
          (hasError ? (
            <CustomHeader
              title="Inicio"
              showBack={false}
              transparent={true}
              showProfileIcon={false}
              onLogout={() => setModalVisible(true)}
            />
          ) : (
            nombrePaciente &&
            sexo && (
              <HomeHeader
                nombre={nombrePaciente}
                sexo={sexo}
                onLogout={() => setModalVisible(true)}
              />
            )
          ))}

        <Carousel />

        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item) => {
              const isAutocuidado = item.name === "Autocuidado";
              const disabled = isAutocuidado && sinProgramas;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    disabled && styles.disabledItem,
                    disabled && { opacity: 0.6 },
                  ]}
                  disabled={disabled}
                  onPress={() =>
                    item.screen && navigation.navigate(item.screen as any)
                  }
                >
                  <MaterialIcons
                    name={item.icon as keyof typeof MaterialIcons.glyphMap}
                    size={35}
                    color={disabled ? colors.lightGray : colors.preto}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      disabled && { color: colors.lightGray },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Modal de Cerrar Sesión */}
          <LogOutModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  disabledItem: {
    backgroundColor: "#f0f0f0", // un gris claro de fondo
    borderColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  menuItem: {
    width: screenWidth / 2 - 60,
    height: screenWidth / 2 - 55,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginBottom: 5,
  },
  menuText: {
    fontSize: 16,
    color: colors.preto,
    textAlign: "center",
    fontFamily: fonts.subtitle,
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
});

export default HomeScreen;
