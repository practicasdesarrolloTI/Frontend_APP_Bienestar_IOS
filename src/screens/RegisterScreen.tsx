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
  Linking,
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
        source={require("../../assets/Fondos/Registro.png")}
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
          {/* Subheader */}
          <View style={styles.subheaderContainer}>
            <Image
              source={require("../../assets/logo_zentria_sinfondo.png")}
              style={{ marginBottom: 10 }}
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
                    onPress={() =>
                      Linking.openURL(
                        "https://bienestarips.com/wp-content/uploads/2024/08/MA-GJ-002-Manual-de-Tratamiento-de-Datos-Personales.pdf"
                      )
                    }
                  >
                    <Text style={styles.termsText}>términos y condiciones</Text>
                  </TouchableOpacity>
                </View>
              </View>

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
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
  },
  termsContainer: {
    marginTop: 20,
  },
  subheaderContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  termsText: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.title,
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
    height: 65,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingLeft: 25,
    marginBottom: 15,
    color: colors.preto,
    fontSize: 18,
    fontFamily: fonts.body,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  registerText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.title,
  },
  loginText: {
    marginTop: 15,
    color: colors.accent,
    fontFamily: fonts.subtitle,
    fontSize: 16,
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
