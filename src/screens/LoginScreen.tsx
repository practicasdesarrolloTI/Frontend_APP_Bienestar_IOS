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

  const handleLogin = async () => {
    if (!document || !password || !documentType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos.",
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
      const result = await loginUser(Number(document), password);
      
      await AsyncStorage.setItem('documento', document);
      await AsyncStorage.setItem('tipoDocumento', String(documentType));

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
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Landing")}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Inicio de sesión</Text>
      </View>

      <View style={styles.container}>
        <DocumentPicker selected={documentType} onSelect={setDocumentType} />

        {/*  Número de Documento */}
        <TextInput
          style={styles.input}
          placeholder="Número de documento"
          placeholderTextColor={colors.primary}
          value={document}
          onChangeText={setDocument}
          keyboardType="numeric"
        />

        {/*  Contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.primary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/*  Botón de Login */}
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

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={2000}
        >
          {message}
        </Snackbar>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    color: "#333",
    borderWidth: 2,
    borderColor: colors.primary,
    fontSize: 16,
    fontFamily: fonts.body,
  },
  loginButton: {
    marginTop: 50,
    backgroundColor: colors.primary,
    width: "98%",
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
    marginTop: 20,
    marginBottom: 15,
    color: colors.secondary,
    fontFamily: fonts.subtitle,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  registerText: {
    marginTop: 15,
    color: colors.secondary,
    fontFamily: fonts.subtitle,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
