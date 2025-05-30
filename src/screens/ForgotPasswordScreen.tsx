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
import { checkPatient } from "../services/patientService"; // ya lo tienes
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import Toast from "react-native-toast-message";
import DocumentPicker from "../components/DocumentPicker";
import CustomHeader from "../components/CustomHeader";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;
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

const ForgotPasswordScreen = ({
  navigation,
}: {
  navigation: ForgotPasswordScreenNavigationProp;
}) => {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    const paciente = await checkPatient(
      documentType as DocumentType,
      Number(document)
    );
    const docPaciente = paciente?.document || null;
    const docType = paciente?.documentType || null;
    const correoPaciente = paciente?.mail;

    console.log("paciente", paciente);

    if (documentType === null) {
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
    if (!/^\d+$/.test(String(docPaciente ?? ""))) {
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
      setEmail(correoPaciente || "");
      const result = await sendRecoveryCode(
        Number(document),
        correoPaciente || ""
      );
      if (result.success) {
        console.log("Código enviado a:", correoPaciente);
        navigation.navigate("VerifyCode", {
          document: document,
          documentType: documentType as DocumentType,
          mail: correoPaciente || "",
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
        source={require("../../assets/backgrounds/Pregunta_cuestionario.png")}
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.subheaderContainer}>
            <Text style={styles.title}>Recuperar contraseña</Text>
            <Text style={styles.subtitle}>
              Ingrese esta información para verificar la autenticidad de la
              cuenta
            </Text>
          </View>
          <DocumentPicker selected={documentType} onSelect={setDocumentType} />

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
              <Text style={styles.buttonText}>Enviar Código</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  title: {
    fontSize: 30,
    fontFamily: fonts.title,
    color: colors.preto,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 50,
  },
  subheaderContainer: {
    marginBottom: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.primary,
    marginBottom: 15,
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
    marginTop: 40,
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.title,
  },
});

export default ForgotPasswordScreen;
