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
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log("Entro al try", documentType, documentNumber, email);

      const patientExits = await checkPatient(
        documentType,
        Number(documentNumber)
      );

      await AsyncStorage.setItem("documento", documentNumber);
      await AsyncStorage.setItem("tipoDocumento", String(documentType));
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
    } catch (error: any) {
      console.log(
        "Error en sendRecoveryCode:",
        error.response?.status,
        error.response?.data
      );

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Error desconocido",
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
        source={require("../../assets/backgrounds/Inicio_de_sesion2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          showBack={true}
          transparent={true}
          showProfileIcon={false}
          onLogout={() => {}}
          goBackTo="Landing"
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Subheader */}
          <View style={styles.subheaderContainer}>
            <Image
              source={require("../../assets/logos/LogoCuidarMe.png")}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>
              Ingresa tus datos para registrarse
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
                placeholderTextColor={colors.lightGray}
                keyboardType="numeric"
                value={documentNumber}
                onChangeText={setDocumentNumber}
              />

              {/*  Correo */}
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.lightGray}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar correo electrónico"
                placeholderTextColor={colors.lightGray}
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
                  <Text style={styles.buttonText}>Continuar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>
                  ¿Ya tienes cuenta?
                  <Text style={styles.loginLinkText}> Inicia sesión</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: scale(15),
  },
  subheaderContainer: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  logo: {
    width: scale(90),
    height: verticalScale(75),
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: fonts.title,
    color: colors.preto,
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontSize: moderateScale(15),
    fontFamily: fonts.subtitle,
    color: colors.gray,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: moderateScale(20),
  },
  input: {
    width: scale(300),
    height: verticalScale(45),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(10),
    color: colors.preto,
    fontSize: moderateScale(15),
    fontFamily: fonts.body,
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: scale(300),
    marginVertical: verticalScale(10),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: moderateScale(14),
    fontFamily: fonts.subtitle,
    color: colors.preto,
    marginLeft: scale(8),
  },
  termsText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: colors.primary,
    width: scale(310),
    paddingVertical: verticalScale(15),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
  },
  loginText: {
    color: colors.accent,
    fontSize: moderateScale(14),
    fontFamily: fonts.subtitle,
  },
  loginLinkText: {
    color: colors.purple,
    fontSize: moderateScale(14),
    fontFamily: fonts.subtitle,
  },
});
export default RegisterScreen;
