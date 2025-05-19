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
  ActivityIndicator,
  ScrollView,
  Pressable,
  Keyboard,
  ImageBackground,
  Image,
} from "react-native";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  checkPatient,
  checkPatientByMail,
  getPatientByDocument,
} from "../services/patientService";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../themes/fonts";
import DocumentPicker from "../components/DocumentPicker";
import Toast from "react-native-toast-message";
import { sendRecoveryCode } from "../services/authService";
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

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleRegister = async () => {
    const paciente = await getPatientByDocument(documentNumber);
    const docPaciente = paciente?.documento || null;
    const docType = paciente?.tipo_documento_abreviado || null;
    if (!documentType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Seleccione un tipo de documento.",
      });
      return;
    }

    if (!documentNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ingrese un número de documento.",
      });
      return;
    }
    if (!/^\d+$/.test(documentNumber || "")) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El número de documento debe ser numérico.",
      });
      return;
    }
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ingrese un correo electrónico.",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ingrese un correo electrónico válido.",
      });
      return;
    }
    if (email !== confirmEmail) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Los correos no coinciden.",
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

    if (documentType !== docType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "No se encontró el paciente con la información dada. Verifica los datos.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const patientExits = await checkPatient(
        documentType,
        Number(documentNumber)
      );
      const patientByMail = await checkPatientByMail(email);

      if (patientByMail) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Correo ya registrado",
        });
        return;
      }
      if (patientExits) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Usuario ya registrado",
        });
        return;
      } else {
        const result = await sendRecoveryCode(Number(docPaciente), email);

        if (result.success) {
          navigation.navigate("VerifyCode", {
            document: documentNumber,
            documentType: documentType as DocumentType,
            mail: email,
          });
        } else {
          if (result.retryAfterMinutes) {
            Toast.show({
              type: "error",
              text1: "Límite alcanzado",
              text2: `Intenta nuevamente en ${result.retryAfterMinutes} minuto(s)`,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: result.message,
            });
          }
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo enviar el código. Intenta nuevamente.",
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
          showBack={true}
          transparent={true}
          showProfileIcon={false}
          onLogout={() => {}}
        />

        {/* Subheader */}
        <View style={styles.subheaderContainer}>
          <Image
            source={require("../../assets/logo_zentria_sinfondo.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>
            Ingrese sus datos para registrarse
          </Text>
        </View>

        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* Documento */}
            <DocumentPicker
              selected={documentType}
              onSelect={setDocumentType}
            />

            {/*  Número de Documento */}
            <TextInput
              style={styles.input}
              placeholder="Número de documento"
              placeholderTextColor={colors.preto}
              keyboardType="numeric"
              value={documentNumber}
              onChangeText={setDocumentNumber}
            />

            {/*  Correo */}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.preto}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text.toLowerCase())}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar correo electrónico"
              placeholderTextColor={colors.preto}
              keyboardType="email-address"
              value={confirmEmail}
              onChangeText={(text) => setConfirmEmail(text.toLowerCase())}
            />

            {/*  Términos y Condiciones */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={acceptedTerms ? "check-box" : "check-box-outline-blank"}
                size={26}
                color={acceptedTerms ? colors.preto : colors.preto}
              />
              <Text style={styles.checkboxLabel}>
                Acepto Términos y Condiciones
              </Text>
            </TouchableOpacity>

            {/*  Botón de Registro */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerText}>Continuar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?
                <Text style={styles.subtitle}> Inicia sesión</Text>
              </Text>
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
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary,
  },
  subheaderContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.preto,
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
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    width: "98%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: fonts.body,
  },
  loginText: {
    color: colors.preto,
    fontSize: 16,
    fontFamily: fonts.subtitle,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.preto,
  },
});

export default RegisterScreen;
