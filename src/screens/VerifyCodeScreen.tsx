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
import { RootStackParamList } from "../navigation/AppNavigator";


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
      console.log("Código reenviado a:", mail);
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
        source={require("../../assets/backgrounds/Codigo.png")}
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
    paddingHorizontal: 20,
  },
  subheaderContainer: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  instructions: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    marginBottom: 10,
    marginTop: 15,
    color: colors.primary,
    textAlign: "center",
  },
  codeFieldRoot: {
    marginBottom: 20,
    justifyContent: "center",
  },
  cell: {
    width: 60,
    height: 60,
    lineHeight: 50,
    fontSize: 24,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cellFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cellText: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.preto,
  },
  timerText: {
    fontSize: 16,
    fontFamily: fonts.subtitle,
    color: colors.secondary,
    textAlign: "center",
    marginTop: 10,
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
    fontSize: 18,
    fontFamily: fonts.title,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    borderColor: "#cccccc",
  },
  buttonReenviar: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderColor: colors.preto,
    borderWidth: 2,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonReenviarText: {
    color: colors.preto,
    fontSize: 18,
    fontFamily: fonts.title,
  },
});

export default VerifyCodeScreen;
