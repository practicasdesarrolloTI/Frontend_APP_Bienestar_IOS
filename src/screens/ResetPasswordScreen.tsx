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
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { resetPassword } from "../services/authService";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import { checkPatient, getPatientByDocument } from "../services/patientService";
import { registerUser } from "../services/authService";
import CustomHeader from "../components/CustomHeader";

type RootStackParamList = {
  ResetPassword: {
    document: string;
    documentType: DocumentType;
    mail: string;
    value: string;
  };
  Login: undefined;
};

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

type Props = StackScreenProps<RootStackParamList, "ResetPassword">;

const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const { document, documentType, mail, value } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNewPassword = async () => {
    const patient = await getPatientByDocument(document);
    const patientExists = await checkPatient(Number(document));

    if (patientExists === null) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
        });
        return;
      } else if (password !== confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Las contraseñas no coinciden.",
        });
        return;
      }
      if (documentType) {
        await registerUser(documentType, Number(document), mail, password);
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Usuario registrado correctamente.",
        });
        navigation.replace("Login");
      }
    } else {
      if (!patient) {
        return Alert.alert("Error", "El documento no existe.");
      }
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/fondo_preuba_app2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title=""
          showBack={true}
          transparent={true}
          rightComponent={""}
        />
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.subheaderContainer}>
              <Text style={styles.title}>Nueva Contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa tu nueva contraseña para continuar.
              </Text>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputPasword, { flex: 1 }]}
                placeholder="Nueva contraseña"
                placeholderTextColor={colors.preto}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  const regex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
                  setPasswordValid(regex.test(text));
                  setPasswordsMatch(text === confirmPassword);
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color={colors.preto}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputPasword, { flex: 1 }]}
                placeholder="Confirmar contraseña"
                placeholderTextColor={colors.preto}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordsMatch(password === text);
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color={colors.preto}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.warning}>
              <Text
                style={[
                  styles.warningText,
                  { opacity: !passwordValid && password.length > 0 ? 1 : 0 },
                ]}
              >
                La contraseña debe tener mínimo 8 caracteres, una mayúscula, una
                minúscula y un número.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleNewPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textAlign: "center",
  },
  subheaderContainer: {
    marginBottom: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.title,
    color: colors.preto,
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  inputPasword: {
    width: "100%",
    height: 55,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 15,
    color: "#333",
    fontSize: 16,
    fontFamily: fonts.body,
  },
  warning: {
    marginBottom: 10,
    alignItems: "center",
  },
  warningText: {
    color: colors.secondary,
    fontSize: 14,
    fontFamily: fonts.body,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.title,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default ResetPasswordScreen;
