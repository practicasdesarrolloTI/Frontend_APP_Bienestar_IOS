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
  const [loading, setLoading] = useState(false);
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

    // if (!documentType || !documentNumber || !password || !confirmPassword) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Todos los campos son obligatorios.",
    //   });
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Las contraseñas no coinciden.",
    //   });
    //   return;
    // }
    // const passwordRegex = /^[a-zA-Z0-9]{2,12}$/;
    // if (!passwordRegex.test(password)) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2:
    //       "La contraseña debe ser alfanumérica y tener entre 4 y 12 caracteres.",
    //   });
    //   return;
    // }
    // setLoading(true);
   ;
    try {
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
      }}
      //
      // if (!patient) {
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: "Este número de documento no está inscrito en la EPS.",
      //   });
      //   return;
      // }

      // if (patient.tipo_documento !== (documentType as string)) {
      //   Toast.show({
      //     type: "error",
      //     text1: "¡Registro fallido!",
      //     text2: "El tipo de documento no coincide.",
      //   });
      //   return;
      // }

      // await registerUser(documentType, Number(documentNumber), password);

      // Toast.show({
      //   type: "success",
      //   text1: "¡Registro exitoso!",
      //   text2: "Ahora puedes iniciar sesión.",
      // });
      // navigation.replace("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo enviar el código. Intenta nuevamente.",
      });
    }
  };
  //   catch (error) {
  //     Toast.show({
  //       type: "error",
  //       text1: "¡Registro fallido!",
  //       text2: "Error al registrar, intenta nuevamente.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

        {/*  Contraseña */}
        {/* <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor={colors.primary}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            // const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/;
            const regex = /^[a-zA-Z0-9]{2,12}$/; //debe contener al menos una letra y un número
            setPasswordValid(regex.test(text));
            setPasswordsMatch(text === confirmPassword);
          }}
        />
        {!passwordValid && password.length > 0 && (
        <Text style={{ color: 'red', marginBottom: 8 }}>
          La contraseña debe tener entre 4 y 12 caracteres, incluir al menos una letra y un número, y no contener símbolos.
        </Text>
      )} */}

        {/* Confirmar Contraseña */}

        {/* <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor={colors.primary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setPasswordsMatch(password === text);
          }}
        />
        {!passwordsMatch && confirmPassword.length > 0 && (
        <Text style={{ color: 'red', marginBottom: 8 }}>
          Las contraseñas no coinciden.
        </Text>
      )} */}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.registerText}>Registrarse</Text>
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
              navigation.navigate("VerifyCode", { document: documentNumber, documentType: documentType as DocumentType });
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
