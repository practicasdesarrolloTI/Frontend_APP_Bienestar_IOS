import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../components/CustomButton";
import colors from "../themes/colors";

/** Pantalla de inicio de sesión de la app */
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo de la app */}
      <Image source={require("../../assets/logo1.jpg")} style={styles.logo} />
      <Text style={styles.title}>Bienestar IPS</Text>

      {/* Inputs de correo y contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.accent}
        value={email}
        onChangeText={setEmail}
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
      <CustomButton
        title="Iniciar Sesión"
        onPress={() => navigation.navigate("Home")}
      />
      {/* Navegación a la pantalla de registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
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
  logo: {
    width: 100,
    height: 100,
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
});

export default LoginScreen;
