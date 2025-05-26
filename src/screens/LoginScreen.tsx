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
  Linking,
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

type DocumentType =
  | "RC"
  | "TI"
  | "CC"
  | "CE"
  | "PAS"
  | "NIT"
  | "CD"
  | "SC"
  | "MSI"
  | "ASI"
  | "PEP"
  | "PTP";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
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
    if (!document || !password || documentType === null) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos.",
        position: "bottom",
      });
      return;
    }
    if (!acceptedTerms) {
      Toast.show({
        type: "error",
        text1: "Términos no aceptados",
        text2: "Debes aceptar los términos y condiciones para continuar.",
        position: "bottom",
      });
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9]{2,20}$/;
    if (!passwordRegex.test(password)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "La contraseña debe ser alfanumérica y tener entre 4 y 12 caracteres.",
        position: "bottom",
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
              position: "bottom",
              visibilityTime: 3000,
            });
          }
          return newCount;
        });
      } else {
        setTimeout(() => navigation.replace("Home"));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al iniciar sesión.",
        position: "bottom",
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
        source={require("../../assets/Fondos/Inicio_de_sesion.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          showBack={true}
          transparent={true}
          showProfileIcon={false}
          onLogout={() => {}}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.subheaderContainer}>
            <Image
              source={require("../../assets/logo_zentria_sinfondo.png")}
              style={{marginBottom: 10}}
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
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    style={{ marginRight: 15 }}
                    size={25}
                    color={"#bfbfbf"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotText}>
                    ¿Olvidó tu contraseña?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Terminos y condiciones */}
              <View style={styles.termsContainer}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={
                        acceptedTerms ? "check-box" : "check-box-outline-blank"
                      }
                      size={28}
                      color={colors.preto}
                    />
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Acepto los </Text>
                  <TouchableOpacity
                    onPress={
                      () => Linking.openURL("https://tusitio.com/terminos") // reemplaza por tu enlace real
                    }
                  >
                    <Text style={styles.termsText}>términos y condiciones</Text>
                  </TouchableOpacity>
                </View>
              </View>

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
                  ¿No tiene cuenta?{" "}
                  <Text style={styles.subtitle}>Regístrate</Text>
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
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.title,
    color: colors.preto,
  },
  termsText: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary, 
    textDecorationLine: "underline",
  },
  subtitle: {
    fontSize: 18,
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
    height: 65,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 25,
    marginBottom: 15,
    color: colors.preto,
    fontSize: 18,
    fontFamily: fonts.body,
  },
  inputPasword: {
    width: "100%",
    height: 65,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 25,
    color: colors.preto,
    fontSize: 18,
    fontFamily: fonts.body,
  },
  termsContainer: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.title,
  },
  forgotText: {
    marginTop: 15,
    color: colors.accent,
    fontFamily: fonts.subtitle,
    fontSize: 16,
  },
  registerText: {
    marginTop: 15,
    color: colors.accent,
    fontFamily: fonts.subtitle,
    fontSize: 16
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
    color: colors.preto,
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
