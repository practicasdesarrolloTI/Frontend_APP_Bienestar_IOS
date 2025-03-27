import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../services/authService";
import { Button, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/** Pantalla de inicio de sesión de la app */
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!document || !password) {
      setMessage("Todos los campos son obligatorios");
      setVisible(true);
      return;
    }

    const result = await loginUser(Number(document), password);
    await AsyncStorage.setItem("documento", document);

    if (!result.success) {
      setMessage(result.message);
      setVisible(true);
    } else {
      setMessage("Inicio de sesión exitoso");
      setVisible(true);
      setTimeout(() => navigation.replace("Home"), 1000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo de la app */}
      <Image
        source={require("../../assets/logomecuido2.png")}
        style={styles.logo}
      />

      <Picker
        selectedValue={documentType}
        onValueChange={(itemValue) => setDocumentType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione Tipo de Documento" value="" />
        <Picker.Item label="Registro Civil" value="RC" />
        <Picker.Item label="Tarjeta de Identidad" value="TI" />
        <Picker.Item label="Cédula de Ciudadanía" value="CC" />
        <Picker.Item label="Cédula de Extranjería" value="CE" />
        <Picker.Item label="Pasaporte" value="PAS" />
      </Picker>

      {/* Inputs de correo y contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Número de documento"
        placeholderTextColor={colors.accent}
        value={document}
        onChangeText={setDocument}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.accent}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón de inicio de sesión */}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar Sesión
      </Button>

      {/* Navegación a la pantalla de registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      {/* Mensaje de error/exito con Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
    borderColor: colors.accent,
    fontSize: 16,
  },
  registerText: {
    marginTop: 15,
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
    marginTop: 10,
    backgroundColor: colors.primary,
  },
});

export default LoginScreen;
