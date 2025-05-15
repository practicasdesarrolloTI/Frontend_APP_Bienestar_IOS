import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Keyboard,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../services/authService";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../themes/fonts";
import DocumentPicker from "../components/DocumentPicker";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";
import CustomHeader from "../components/CustomHeader";

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!document || !password || !documentType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos.",
      });
      return;
    }
    if (!acceptedTerms) {
      Toast.show({
        type: "error",
        text1: "Términos no aceptados",
        text2: "Debes aceptar los términos y condiciones para continuar.",
      });
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9]{2,12}$/;
    if (!passwordRegex.test(password)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "La contraseña debe ser alfanumérica y tener entre 4 y 12 caracteres.",
      });
      setVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginUser(documentType, Number(document), password);

      await AsyncStorage.setItem("documento", document);
      await AsyncStorage.setItem("tipoDocumento", String(documentType));

      if (!result.success) {
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setIsBlocked(true);
            Toast.show({
              type: "error",
              text1: "Acceso bloqueado",
              text2: "Has superado el límite de intentos.",
              visibilityTime: 3000,
            });
          }
          return newCount;
        });
      } else {
        Toast.show({
          type: "success",
          text1: "¡Inicio de Sesión Exitoso!",
          text2: "Bienvenido!",
          visibilityTime: 1300,
        });
        setTimeout(() => navigation.replace("Home"));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al iniciar sesión.",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
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
        <View style={styles.subheaderContainer}>
          <Image
            source={require("../../assets/logo_zentria_sinfondo.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text style={styles.title}>Inicio de sesión</Text>
          <Text style={styles.subtitle}>
            Ingrese sus datos para inicar sesión
          </Text>
        </View>

        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <DocumentPicker
              selected={documentType}
              onSelect={setDocumentType}
            />

            {/* Documento */}
            <TextInput
              style={styles.input}
              placeholder="Número de documento"
              placeholderTextColor={colors.preto}
              value={document}
              onChangeText={setDocument}
              keyboardType="numeric"
            />

            {/* Contraseña */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputPasword, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={colors.preto}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  style={{ marginRight: 15 }}
                  size={20}
                  color={"#bfbfbf"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            {/* Terminos y condiciones */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={acceptedTerms ? "check-box" : "check-box-outline-blank"}
                size={26}
                color={colors.primary}
              />
              <Text style={styles.checkboxLabel}>
                Acepto Términos y Condiciones
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.checkboxLabel}>Regístrate</Text>
              </Text>
            </TouchableOpacity>

            <Snackbar
              visible={visible}
              onDismiss={() => setVisible(false)}
              duration={2000}
            >
              {message}
            </Snackbar>
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
  title: {
    fontSize: 28,
    fontFamily: fonts.title,
    color: colors.preto,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary,
  },
  subheaderContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 30,
    marginTop: 60,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    color: "#333",
    fontSize: 16,
    fontFamily: fonts.body,
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
  loginButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.title,
  },
  forgotText: {
    marginTop: 5,
    color: colors.accent,
    fontFamily: fonts.subtitle,
    fontSize: 14,
  },
  registerText: {
    marginTop: 15,
    color: colors.preto,
    fontFamily: fonts.subtitle,
    fontSize: 16,
  },
  checkboxContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },
});

export default LoginScreen;
