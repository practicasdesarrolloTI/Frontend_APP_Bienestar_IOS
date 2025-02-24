import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import colors from "../themes/colors";

const RegisterScreen = ({ navigation }: any) => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Paciente</Text>

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
        placeholder="Tipo de documento"
        placeholderTextColor={colors.accent}
        value={documentType}
        onChangeText={setDocumentType}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.accent}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        placeholderTextColor={colors.accent}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Departamento"
        placeholderTextColor={colors.accent}
        value={department}
        onChangeText={setDepartment}
      />

      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        placeholderTextColor={colors.accent}
        value={city}
        onChangeText={setCity}
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

      <CustomButton title="Registrarse" onPress={() => console.log("Registro realizado")} />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
  },
  loginText: {
    marginTop: 15,
    color: colors.secondary,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
