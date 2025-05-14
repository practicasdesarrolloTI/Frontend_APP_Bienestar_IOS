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
  Keyboard,
  Pressable,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
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
import CustomHeader from "../components/CustomHeader";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    const paciente = await getPatientByDocument(document);
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
      setIsLoading(true);
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
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.subheaderContainer}>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa tu información para continuar.
              </Text>
            </View>
            <DocumentPicker
              selected={documentType}
              onSelect={setDocumentType}
            />

            <TextInput
              placeholder="Número de documento"
              placeholderTextColor={colors.preto}
              keyboardType="numeric"
              style={styles.input}
              value={document}
              onChangeText={setDocument}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>ENVIAR CÓDIGO</Text>
              )}{" "}
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
        {/* Modal de recuperación de contraseña */}
        <PasswordRecoveryModal
          visible={showRecoveryModal}
          maskedEmail={maskedEmail}
          onClose={() => {
            if (documentType) {
              setShowRecoveryModal(false);
              navigation.navigate("VerifyCode", {
                document,
                documentType: documentType as DocumentType,
                mail: email,
              });
            }
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
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
  label: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    marginBottom: 15,
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
    width: "100%",
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
