import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
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

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const storedDoc = await AsyncStorage.getItem("documento");
        if (!storedDoc) {
          Alert.alert("Error", "No se encontró el documento del paciente.");
          return;
        }
        const dataregistro = await getPatientAPP(Number(storedDoc));
        const data = await getPatientByDocument(storedDoc);
        setPaciente(data as unknown as Paciente);
        setPacienteRegistro(dataregistro as unknown as PacienteRegistro);
      } catch (error) {
        Alert.alert("Error", "Error al obtener información del paciente.");
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
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Home")}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Información</Text>
      </View>
      <View style={styles.container}>
        {/* Icono de perfil centrado */}
        <View style={styles.profileIconContainer}>
          <MaterialIcons
            name="account-circle"
            size={100}
            color={colors.primary}
          />
        </View>

        {/* Información del Paciente */}
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.label}>
              <Text style={styles.bold}>Nombre: </Text>{" "}
              {paciente?.primer_nombre} {paciente?.segundo_nombre}{" "}
              {paciente?.primer_apellido} {paciente?.segundo_apellido}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Documento: </Text>{" "}
              {paciente?.tipo_documento_abreviado} {paciente?.documento}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Sexo: </Text>{" "}
              {paciente?.sexo === "M" ? "Masculino" : "Femenino"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Fecha de Nacimiento: </Text>{" "}
              {paciente?.fecha_nacimiento}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Edad: </Text>{" "}
              {paciente ? calcularEdad(paciente.fecha_nacimiento) : "N/A"}{" "}
              {"años"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Correo: </Text>{" "}
              {pacienteRegistro?.mail || "No tiene correo registrado"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Teléfono: </Text>{" "}
              {paciente?.celular ||
                paciente?.telefono ||
                "No tiene número teléfonico registrado"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>EPS:</Text> {paciente?.eps}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    width: "100%",
    height: 70,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    gap: 16,
  },
  backButton: {
    top: 30,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 15,
  },

  profileIconContainer: {
    alignItems: "center",
    marginVertical: 50,
  },
  infoContainer: {
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 10,
    width: "95%",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    fontFamily: fonts.subtitle,
  },
  bold: {
    fontWeight: "bold",
    color: colors.primary,
  },
});

export default PatientInfoScreen;
