import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../components/CustomButton";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../services/authService";
import { getPatientByDocument } from '../services/patientService';


type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    if (!documentType || !documentNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

  try {
    const patient = await getPatientByDocument(documentNumber);

    if (!patient) {
      Alert.alert("Error", "Este número de documento no está inscrito en la EPS.");
      return;
    }

    if (patient.tipo_documento !== (documentType as unknown as string)) {
      Alert.alert("Error", `El tipo de documento no coincide`);
      return;
    }

  
    await registerUser(documentType, Number(documentNumber), password);

    Alert.alert("Registro exitoso", "Ya puedes iniciar sesión.");
    navigation.replace('Login');

  } catch (error) {
    Alert.alert("Error", "Ocurrió un error durante el registro.");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Paciente</Text>

      {/* Selector para Tipo de Identificación */}
      <Picker
        selectedValue={documentType}
        onValueChange={(itemValue) => setDocumentType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione Tipo de Documento" value="" />
        <Picker.Item label="Cédula de Ciudadanía" value="CC" />
        <Picker.Item label="Cédula de Extranjería" value="CE" />
        <Picker.Item label="Pasaporte" value="PAS" />
        <Picker.Item label="Tarjeta de Identidad" value="TI" />
        <Picker.Item label="Registro Civil" value="RC" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Número de documento"
        placeholderTextColor={colors.accent}
        keyboardType="numeric"
        value={documentNumber}
        onChangeText={setDocumentNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor={colors.accent}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor={colors.accent}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* <CustomButton title="Registrarse" onPress={() => console.log("Registro realizado")} /> */}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

      {/* 📌 Botón de Registro */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.loginText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: colors.primary,
    fontSize: 16,
  },
  loginText: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 15,
  },
  picker: {
    width: "100%",
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default RegisterScreen;
