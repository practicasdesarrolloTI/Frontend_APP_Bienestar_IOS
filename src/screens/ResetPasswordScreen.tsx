import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { resetPassword } from "../services/authService";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import { checkPatient, getPatientByDocument } from "../services/patientService";
import { registerUser } from "../services/authService";

type RootStackParamList = {
  ResetPassword: { document: string; documentType: DocumentType; value: string };
  Login: undefined;
};

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

type Props = StackScreenProps<RootStackParamList, "ResetPassword">;

const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const { document, documentType, value } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNewPassword = async () => {
    const patient = await getPatientByDocument(document);
    const patientExists = await checkPatient(Number(document));

    if (patientExists === null) {
      if (documentType) {
        await registerUser(documentType, Number(document), password);
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Usuario registrado correctamente.",
        });
        navigation.replace("Login");}
      } else {
        if (!patient) {
          return Alert.alert("Error", "El documento no existe.");
        } else {
          if (password !== confirmPassword) {
            return Alert.alert("Error", "Las contraseñas no coinciden.");
          }

          try {
            await resetPassword(Number(document), value, password);
            Toast.show({
              type: "success",
              text1: "Éxito",
              text2: "Tu contraseña ha sido restablecida.",
            });
            navigation.replace("Login");
          } catch (error) {
            Toast.show({
              type: "error",
              text1: value,
              text2: "No se pudo cambiar la contraseña.",
            });
          }
        }
      }
    
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Contraseña</Text>
      </View>

      <View style={styles.container}>
        <TextInput
          placeholder="Nueva contraseña"
          placeholderTextColor={colors.primary}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor={colors.primary}
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleNewPassword}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: fonts.body,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.title,
  },
});

export default ResetPasswordScreen;
