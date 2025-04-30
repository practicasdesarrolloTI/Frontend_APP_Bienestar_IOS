import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { sendRecoveryCode } from "../services/authService";
import { getPatientByDocument } from "../services/patientService"; // ya lo tienes
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import DocumentPicker from "../components/DocumentPicker";
import PasswordRecoveryModal from "../components/PasswordRecoveryModal";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;
type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

const ForgotPasswordScreen = ({
  navigation,
}: {
  navigation: ForgotPasswordScreenNavigationProp;
}) => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleSendCode = async () => {
    const paciente = await getPatientByDocument(document);
    const docPaciente = paciente?.documento || null;
    const docType = paciente?.tipo_documento_abreviado || null;
    const correoPaciente = paciente?.correo ;

    if (!documentType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Seleccione un tipo de documento.",
      });
      return;
    }

    if (!document) {
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
      const correo = "christiandj456@outlook.com"; // este debería venir del paciente
      setEmail(correo);
      const result = await sendRecoveryCode(Number(document), correo);
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
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo enviar el código. Intenta nuevamente.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Recuperar Contraseña</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Ingresa tu número y tipo de documento:</Text>
        <DocumentPicker selected={documentType} onSelect={setDocumentType} />

        <TextInput
          placeholder="Número de documento"
          placeholderTextColor={colors.primary}
          keyboardType="numeric"
          style={styles.input}
          value={document}
          onChangeText={setDocument}
        />

        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>Enviar código</Text>
        </TouchableOpacity>
      </View>
      <PasswordRecoveryModal
        visible={showRecoveryModal}
        maskedEmail={maskedEmail}
        onClose={() => { 
          if (documentType) {
            setShowRecoveryModal(false); 
            navigation.navigate("VerifyCode", { document, documentType: documentType as DocumentType, mail: email }); 
          }
        }}
        
      />
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
  label: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    marginBottom: 10,
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

export default ForgotPasswordScreen;
