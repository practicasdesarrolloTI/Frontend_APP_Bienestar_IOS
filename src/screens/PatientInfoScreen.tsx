import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
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
import WarningModal from "../components/WarningModal";
import BackgroundPerfil from "../components/Backgrounds/BackgroundPerfil";
import Toast from "react-native-toast-message";

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
  fechaNacimiento: string;
  eps: string;
  documentType: string;
  document: number;
  mail: string;
  password: string;
  firstName: string;
  middleName: string;
  firstSurname: string;
  middleLastName: string;
  createdAt: string;
  updatedAt: string;
  sexo: string;
};

const PatientInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [pacienteRegistro, setPacienteRegistro] =
    useState<PacienteRegistro | null>(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setModalVisible(false);
    }
  }, [isFocused]);

  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text1: "Sesión cerrada",
      text2: "Has cerrado sesión correctamente.",
    });
    // navigation.replace("Login");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
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
        const dataregistro = await getPatientAPP(
          storedDocType,
          Number(storedDoc)
        );
        setPacienteRegistro(dataregistro);

        const data = await getPatientByDocument(storedDoc);

        setPaciente(data as unknown as Paciente);
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <BackgroundPerfil>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          {/* Header transparente */}
          <CustomHeader
            title="Mi Perfil"
            color={colors.white}
            showBack
            transparent
            showProfileIcon
            onLogout={() => setModalVisible(true)}
          />
          <View style={{height:Math.max(54, Math.min(110, height * 0.08))}}></View>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, {height:Math.max(453, Math.min(928, height * 0.68))}] }
            showsVerticalScrollIndicator={false}
          >
            {/* Información del Paciente */}
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.label}>Nombre completo</Text>
                <Text style={styles.value}>
                  {formatName(
                    paciente?.primer_nombre ??
                      pacienteRegistro?.firstName ??
                      "Información no disponible"
                  )}{" "}
                  {formatName(
                    paciente?.segundo_nombre ??
                      pacienteRegistro?.middleName ??
                      " "
                  )}{" "}
                  {formatName(
                    paciente?.primer_apellido ??
                      pacienteRegistro?.firstSurname ??
                      " "
                  )}{" "}
                  {formatName(
                    paciente?.segundo_apellido ??
                      pacienteRegistro?.middleLastName ??
                      " "
                  )}
                </Text>
                <Text style={styles.label}>Documento</Text>
                <Text style={styles.value}>
                  {pacienteRegistro?.documentType ||
                    paciente?.tipo_documento ||
                    "Información no disponible"}{" "}
                  {pacienteRegistro?.document || paciente?.documento || ""}
                </Text>
                <Text style={styles.label}>Sexo</Text>
                <Text style={styles.value}>
                  {paciente?.sexo ||
                    pacienteRegistro?.sexo ||
                    "Información no disponible"}
                </Text>
                <Text style={styles.label}>Fecha de Nacimiento</Text>
                <Text style={styles.value}>
                  {paciente?.fecha_nacimiento &&
                  esFechaValida(paciente.fecha_nacimiento)
                    ? paciente.fecha_nacimiento
                    : pacienteRegistro?.fechaNacimiento}
                </Text>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.value}>
                  {paciente?.fecha_nacimiento &&
                  esFechaValida(paciente.fecha_nacimiento)
                    ? `${calcularEdad(paciente.fecha_nacimiento)} años`
                    : pacienteRegistro?.fechaNacimiento
                    ? `${calcularEdad(pacienteRegistro.fechaNacimiento)} años`
                    : "Información no disponible"}
                </Text>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>
                  {pacienteRegistro?.mail ||
                    paciente?.correo ||
                    "Información no disponible"}
                </Text>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>
                  {paciente?.celular ||
                    paciente?.telefono ||
                    "No tiene número teléfonico registrado"}
                </Text>
                <Text style={styles.label}>EPS</Text>
                <Text style={styles.value}>
                  {paciente?.eps
                    ? formatName(paciente.eps)
                    : formatName(
                        pacienteRegistro?.eps || "Información no disponible"
                      )}
                </Text>
              </View>
            </View>
          </ScrollView>
          {/* Modal de Cerrar Sesión */}
          <WarningModal
            text="¿Estás seguro de que deseas cerrar sesión?"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
          />
          <View style={{height:Math.max(65, Math.min(130, height * 0.10)),justifyContent:'flex-end'}}> 
            <Text style={{color: colors.lightGray}}>V1.0.0</Text>
          </View>
        </SafeAreaView>
      </BackgroundPerfil>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
  },
  infoContainer: {
    width: moderateScale(320),
    padding: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.lightGray,
    fontFamily: fonts.body,
    marginBottom: verticalScale(2),
  },
  value: {
    fontSize: moderateScale(16),
    color: colors.preto,
    fontFamily: fonts.body,
    marginBottom: verticalScale(10),
  },
});

export default PatientInfoScreen;
