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
  Image,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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
  const { document, documentType, mail, eps, fechaNacimiento } = route.params;
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
        eps,
        fechaNacimiento,
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

        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* Subheader */}
            <View style={styles.subheaderContainer}>
              <Image
                source={require("../../assets/logos/LogoCuidarMe.png")}
                resizeMode="contain"
                style={styles.logo}
              />
              <Text style={styles.title}>Verificar código</Text>
              <Text style={styles.subtitle}>
                Ingresa el código de verificación{" "}
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

const CELL_SIZE = moderateScale(48);
const BUTTON_HEIGHT = verticalScale(48);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    fontSize: moderateScale(16),
    fontFamily: fonts.subtitle,
    color: colors.primary,
    textAlign: "center",
    marginBottom: verticalScale(40),
    lineHeight: verticalScale(22),
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: scale(15),
  },
  codeFieldRoot: {
    marginBottom: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    width: CELL_SIZE - moderateScale(2),
    height: CELL_SIZE ,
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cellFocused: {
    borderWidth: moderateScale(2),
    borderColor: colors.primary,
  },
  cellText: {
    fontFamily: fonts.title,
    fontSize: moderateScale(22),
    color: colors.preto,
    textAlign: "center",
  },
  timerText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.subtitle,
    color: colors.secondary,
    textAlign: "center",
    marginTop: verticalScale(10),
  },
  instructions: {
    fontSize: moderateScale(15),
    fontFamily: fonts.subtitle,
    marginBottom: verticalScale(10),
    marginTop: verticalScale(5),
    color: colors.primary,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    width: scale(310),
    paddingVertical: verticalScale(15),
    borderRadius: scale(50),
    marginTop: verticalScale(20),
    alignItems: "center",
    height: BUTTON_HEIGHT,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(17),
    fontFamily: fonts.title,
  },
  buttonReenviar: {
    marginTop: verticalScale(20),
    width: scale(310),
    paddingVertical: verticalScale(15),
    borderRadius: scale(50),
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderWidth: moderateScale(1),
    borderColor: colors.preto,
  },
  buttonDisabledOutline: {
    backgroundColor: colors.lightGray,
    borderColor: colors.lightGray,
  },
  buttonReenviarText: {
    color: colors.preto,
    fontSize: moderateScale(17),
    fontFamily: fonts.title,
  },
});

export default VerifyCodeScreen;
