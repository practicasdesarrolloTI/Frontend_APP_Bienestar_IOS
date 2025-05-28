import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
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
import LogOutModal from "../components/WarningModal";
import Carousel from "../components/Carousel";
import CustomHeader from "../components/CustomHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/** Datos del menú con íconos de MaterialIcons y pantallas asociadas */
const menuItems = [
  {
    id: "1",
    name: "Información",
    image: require("../../assets/icons/informacion_b.png"),
    screen: "Informacion",
  },
  {
    id: "2",
    name: "Citas",
    image: require("../../assets/icons/citas_b.png"),
    screen: "TusCitas",
  },
  {
    id: "3",
    name: "Programas",
    image: require("../../assets/icons/programas_b.png"),
    screen: "TusProgramas",
  },
  {
    id: "4",
    name: "Resultados",
    image: require("../../assets/icons/resultados_b.png"),
    screen: "Resultados",
  },
  {
    id: "5",
    name: "Medicamentos",
    image: require("../../assets/icons/medicamentos_b.png"),
    screen: "Medicamentos",
  },
  {
    id: "6",
    name: "Autocuidado",
    image: require("../../assets/icons/autocuidado_b.png"),
    screen: "Autocuidado",
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [nombrePaciente, setNombrePaciente] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text2: "Has cerrado sesión correctamente.",
      position: "bottom",
    });
    navigation.replace("Login");
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

  /** Cargar el nombre del paciente y el sexo */
  useEffect(() => {
    const loadPaciente = async () => {
      try {
        const documento = await AsyncStorage.getItem("documento");
        if (!documento) throw new Error("No hay documento");
        const paciente = await getPatientByDocument(documento);

        const nombreCompleto = `${paciente?.primer_nombre} ${
          paciente?.segundo_nombre ?? ""
        } ${paciente?.primer_apellido}`;
        setNombrePaciente(nombreCompleto);
        setSexo(paciente?.sexo ?? null);
      } catch (error) {
        console.error("Error al cargar paciente", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();
  }, []);

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
        source={require("../../assets/Fondos/Inicio.png")}
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
              showProfileIcon={true}
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
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem]}
                  onPress={() =>
                    item.screen && navigation.navigate(item.screen as any)
                  }
                >
                  <Image
                    source={item.image}
                    style={styles.menuImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {/* Modal de Cerrar Sesión */}
          <LogOutModal
            text="¿Estás seguro de que deseas cerrar sesión?"
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
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  menuItem: {
    width: screenWidth / 2 - 40,
    height: screenWidth / 2 - 45,
    borderRadius: 12,
    overflow: "hidden",
    margin: 8,
  },

  menuImage: {
    width: "100%",
    height: "100%",
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
