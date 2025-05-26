import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  getPatientByDocument,
  getPatientAPP,
} from "../services/patientService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/LoadingScreen";
import { fonts } from "../themes/fonts";
import { calcularEdad } from "../utils/dateUtils";
import CustomHeader from "../components/CustomHeader";
import LogOutModal from "../components/LogOutModal";
import Toast from "react-native-toast-message";
import { Scroll } from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Informacion">;

type Paciente = {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_documento: string;
  documento: string;
  fecha_nacimiento: string;
  sexo: string;
  celular: number;
  telefono: number;
  correo: string;
  eps: string;
  iat: number;
  tipo_documento_abreviado: string;
};
type PacienteRegistro = {
  _id: string;
  documentType: string;
  document: number;
  mail?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

const PatientInfoScreen: React.FC<Props> = ({ navigation }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [pacienteRegistro, setPacienteRegistro] =
    useState<PacienteRegistro | null>(null);
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
    navigation.navigate("Login");
  };

  /** Función para formatear el nombre */
  const formatName = (text: string): string => {
    const clear = text.replace(/\s*[\(\[].*?[\)\]]\s*/g, " ").trim();
    return clear
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };

  /** Función para validar fecha de nacimiento */
  const esFechaValida = (fecha: string | undefined) => {
    if (!fecha || fecha.includes("NaN")) return false;
    return true;
  };

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const storedDoc = await AsyncStorage.getItem("documento");
        const storedDocType = await AsyncStorage.getItem("tipoDocumento");
        if (!storedDoc || !storedDocType) {
          Toast.show({
            type: "error",
            text2: "No se encontró el documento del paciente.",
            position: "bottom",
          });
          return;
        }
        const dataregistro = await getPatientAPP(storedDocType, Number(storedDoc));
        const data = await getPatientByDocument(storedDoc);

        setPaciente(data as unknown as Paciente);
        setPacienteRegistro(dataregistro as unknown as PacienteRegistro);

      } catch (error) {
        Toast.show({
          type: "error",
          text2: "Error al obtener información del paciente.",
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
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
        source={require("../../assets/Fondos/Informacion.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title="Mi Perfil"
          showBack
          transparent
          showProfileIcon
          onLogout={() => setModalVisible(true)}
        />

        <View style={styles.container}>
          <ScrollView>
            {/* Información del Paciente */}
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.label}>Nombre completo</Text>
                <Text style={styles.labelinfo}>
                  {formatName(paciente?.primer_nombre ?? "Información no disponible")}{" "}
                  {formatName(paciente?.segundo_nombre ?? " ")}{" "}
                  {formatName(paciente?.primer_apellido ?? " ")}{" "}
                  {formatName(paciente?.segundo_apellido ?? " ")}
                </Text>
                <Text style={styles.label}>Documento</Text>
                <Text style={styles.labelinfo}>
                  {paciente?.tipo_documento_abreviado || "Información no disponible"} {paciente?.documento || ""} 
                </Text>
                <Text style={styles.label}>Sexo</Text>
                <Text style={styles.labelinfo}>
                  {paciente?.sexo === "M"
                    ? "Masculino"
                    : paciente?.sexo === "F"
                    ? "Femenino"
                    : "Información no disponible"}
                </Text>
                <Text style={styles.label}>Fecha de Nacimiento</Text>
                <Text style={styles.labelinfo}>
                  {paciente?.fecha_nacimiento &&
                  esFechaValida(paciente.fecha_nacimiento)
                    ? paciente.fecha_nacimiento
                    : "Información no disponible"}
                </Text>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.labelinfo}>
                  {paciente?.fecha_nacimiento &&
                  esFechaValida(paciente.fecha_nacimiento)
                    ? `${calcularEdad(paciente.fecha_nacimiento)} años`
                    : "Información no disponible"}
                </Text>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.labelinfo}>
                  {pacienteRegistro?.mail || "No tiene correo registrado"}
                </Text>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.labelinfo}>
                  {paciente?.celular ||
                    paciente?.telefono ||
                    "No tiene número teléfonico registrado"}
                </Text>
                <Text style={styles.label}>EPS</Text>
                <Text style={styles.labelinfo}>
                  {formatName(paciente?.eps ?? "Información no disponible")}
                </Text>
              </View>
            </View>
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
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  infoContainer: {
    alignSelf: "center",
    backgroundColor: colors.white,
    marginTop: screenHeight * 0.15,
    width: screenWidth * 0.75,
  },
  label: {
    fontSize: 16,
    marginBottom: 1,
    color: colors.lightGray,
    fontFamily: fonts.body,
  },
  labelinfo: {
    fontSize: 17,
    marginBottom: 18,
    color: colors.preto,
    fontFamily: fonts.body,
  },
});

export default PatientInfoScreen;
