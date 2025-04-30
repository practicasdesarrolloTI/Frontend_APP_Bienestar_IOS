import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { verifyRecoveryCode } from "../services/authService";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { sendRecoveryCode } from "../services/authService";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Toast from "react-native-toast-message";

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

type RootStackParamList = {
  VerifyCode: { document: string, documentType: DocumentType, mail: string };
  ResetPassword: { document: string; documentType: DocumentType, mail: string; value: string };
};

type VerifyCodeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VerifyCode"
>;
type VerifyCodeScreenRouteProp = RouteProp<RootStackParamList, "VerifyCode">;
const CELL_COUNT = 6;

const VerifyCodeScreen = ({
  route,
  navigation,
}: {
  route: VerifyCodeScreenRouteProp;
  navigation: VerifyCodeScreenNavigationProp;
}) => {
  const { document, documentType, mail } = route.params;
  
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [timer, setTimer] = useState(60);

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
      navigation.navigate("ResetPassword", { document, documentType, mail, value });
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
      const email = "christiandj456@outlook.com";
      await sendRecoveryCode(Number(document), email);
      setResendAttempts((prev) => prev + 1);
      setTimer(60);
      console.log("Resend code attempts:", resendAttempts, " of ", maxAttempts);
      // Aquí puedes mostrar un mensaje de éxito al usuario
      // Toast.show({
      //   type: "success",
      //   text1: "Código reenviado",
      //   text2: "Se ha enviado un nuevo código al correo registrado.",
      // });
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
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Verificar Código</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Ingresa el código de recuperación:</Text>
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
            styles.button,
            (timer > 0 || resendAttempts == maxAttempts) &&
              styles.buttonDisabled,
          ]}
          onPress={handleResendCode}
          disabled={timer > 0 || resendAttempts >= maxAttempts}
        >
          <Text style={styles.buttonText}>Reenviar código</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: colors.primary,
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
  instructions: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    marginBottom: 20,
    color: colors.primary,
    textAlign: "center",
  },
  codeFieldRoot: {
    marginBottom: 20,
    justifyContent: "center",
  },
  cell: {
    width: 45,
    height: 55,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 5,
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
    marginBottom: 15,
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
  },
});

export default VerifyCodeScreen;
