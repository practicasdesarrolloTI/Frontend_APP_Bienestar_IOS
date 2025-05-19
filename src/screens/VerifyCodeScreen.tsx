import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Keyboard,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import { verifyRecoveryCode } from "../services/authService";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { sendRecoveryCode } from "../services/authService";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Toast from "react-native-toast-message";
import CustomHeader from "../components/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";




type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";




type Props = NativeStackScreenProps<RootStackParamList, "VerifyCode">;
const CELL_COUNT = 6;


const VerifyCodeScreen = ({ route, navigation }: Props) => {
  const { document, documentType, mail } = route.params;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const [resendAttempts, setResendAttempts] = useState(1);
  const maxAttempts = 3;

  useEffect(() => {
    if (timer === 0 && resendAttempts == maxAttempts) {
      Toast.show({
        type: "error",
        text1: "Límite alcanzado",
        text2:
          "Has alcanzado el número máximo de intentos para reenviar el código.",
      });
    }
  }, [timer, resendAttempts]);

  const handleVerify = async () => {
    console.log("tipo de documento", documentType);
    console.log("correo", mail);
    try {
      await verifyRecoveryCode(Number(document), value);
      navigation.navigate("ResetPassword", {
        document,
        documentType,
        mail,
        value,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Código inválido. Intenta nuevamente.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const handleResendCode = async () => {
    try {
      await sendRecoveryCode(Number(document), mail);
      setResendAttempts((prev) => prev + 1);
      setTimer(120);
      console.log("Resend code attempts:", resendAttempts, " of ", maxAttempts);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: String(error),
        text2: "No se pudo reenviar el código. Intenta nuevamente.",
      });
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
        
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.subheaderContainer}>
              <Text style={styles.title}>Verificar código</Text>
              <Text style={styles.subtitle}>
                Ingrese el código de verificación que hemos enviado a tu correo
                electrónico.
              </Text>
            </View>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.cellFocused]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            <Text style={styles.timerText}>
              {timer > 0
                ? `Código válido por ${formatTime(timer)}`
                : "Código expirado"}
            </Text>
            <Text style={styles.instructions}>
              Intento número {resendAttempts} de {maxAttempts}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerify}
              disabled={value.length !== 6}
            >
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonReenviar,
                (timer > 0 || resendAttempts == maxAttempts) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleResendCode}
              disabled={timer > 0 || resendAttempts >= maxAttempts}
            >
              <Text style={styles.buttonReenviarText}>Reenviar código</Text>
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
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    marginBottom: 10,
    marginTop: 10,
    color: colors.primary,
    textAlign: "center",
  },
  codeFieldRoot: {
    marginBottom: 20,
    justifyContent: "center",
  },
  cell: {
    width: 55,
    height: 55,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cellFocused: {
    borderColor: colors.primary,
  },
  cellText: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: "#333",
  },
  timerText: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.title,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    borderColor: "#cccccc",
  },
  buttonReenviar: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonReenviarText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.title,
  },
});

export default VerifyCodeScreen;
