import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getPatientByDocument } from "../services/patientService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
};
const PatientInfoScreen: React.FC<Props> = ({ navigation }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const storedDoc = await AsyncStorage.getItem('documento');
        if (!storedDoc) {
          Alert.alert("Error", "No se encontró el documento del paciente.");
          return;
        }
  
        const data = await getPatientByDocument(storedDoc);
        setPaciente(data as unknown as Paciente);
      } catch (error) {
        Alert.alert("Error", "Error al obtener información del paciente.");
      }
    };
  
    loadPatient();
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Botón para regresar al menú */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

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
            <Text style={styles.bold}>Nombre: </Text> {paciente?.primer_nombre}{" "}
            {paciente?.segundo_nombre} {paciente?.primer_apellido}{" "}
            {paciente?.segundo_apellido}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Documento: </Text>{" "}
            {paciente?.tipo_documento} {paciente?.documento}
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
            <Text style={styles.bold}>Correo: </Text> {paciente?.correo}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Celular: </Text> {paciente?.celular}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>EPS:</Text> {paciente?.eps}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: "flex-start",
    padding: 15,
    marginTop: 30,
    marginBottom: 20,
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
  profileIconContainer: {
    alignItems: "center",
    margin: 40,
  },
  infoContainer: {
    alignSelf: "center",
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    width: "95%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: colors.primary,
  },
});

export default PatientInfoScreen;
