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
} from "react-native";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { checkPatient, getPatientByDocument } from "../services/patientService";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../themes/fonts";
import DocumentPicker from "../components/DocumentPicker";
import Toast from "react-native-toast-message";
import { sendRecoveryCode } from "../services/authService";
import PasswordRecoveryModal from "../components/PasswordRecoveryModal";

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleRegister = async () => {
    const paciente = await getPatientByDocument(documentNumber);
    const docPaciente = paciente?.documento || null;
    const docType = paciente?.tipo_documento_abreviado || null;
    const correoPaciente = paciente?.correo;

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
    if (!/^\d+$/.test(docPaciente || "")) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El número de documento debe ser numérico.",
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
      const patientExits = await checkPatient(Number(documentNumber));
      if (patientExits) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Usuario ya registrado",
        });
        return;
      } else {
        const correo = "christiandj456@outlook.com"; // este debería venir del paciente
        setEmail(correo);
        const result = await sendRecoveryCode(Number(docPaciente), correo);

        if (result.success) {
          const [user, domain] = (correoPaciente || "").split("@");
          const masked = `${user.substring(0, 4)}*****@${domain}`;
          setMaskedEmail(masked);
          setShowRecoveryModal(true);
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
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Landing")}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Registro</Text>
      </View>

      <View style={styles.container}>
        {/* Documento */}
        <DocumentPicker selected={documentType} onSelect={setDocumentType} />

        {/*  Número de Documento */}
        <TextInput
          style={styles.input}
          placeholder="Número de documento"
          placeholderTextColor={colors.primary}
          keyboardType="numeric"
          value={documentNumber}
          onChangeText={setDocumentNumber}
        />

        {/*  Botón de Registro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading} >
          {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginText}>Iniciar sesión</Text>
                    )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
        <PasswordRecoveryModal
          visible={showRecoveryModal}
          maskedEmail={maskedEmail}
          onClose={() => {
            setShowRecoveryModal(false);
            if (documentType) {
              navigation.navigate("VerifyCode", {
                document: documentNumber,
                documentType: documentType as DocumentType,
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Seleccione un tipo de documento válido.",
              });
            }
          }}
        />
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
    fontWeight: "bold",
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
  button: {
    marginTop: 50,
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
    color: colors.secondary,
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: fonts.subtitle,
  },
});

export default RegisterScreen;
