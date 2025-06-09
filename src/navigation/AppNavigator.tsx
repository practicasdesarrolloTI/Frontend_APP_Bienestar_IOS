import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { decode as atob } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import PatientInfoScreen from "../screens/PatientInfoScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import ProgramsScreen from "../screens/ProgramsScreen";
import ResultsScreen from "../screens/ResultsScreen";
import PrescriptionsScreen from "../screens/PrescriptionsScreen";
import SelfCareScreen from "../screens/SelfCareScreen";
import SurveyScreen from "../screens/SurveyScreen";
import SurveySummary from "../screens/SurveySummary";
import LandingScreen from "../screens/LandingScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import { getToken } from "../services/authService";
import LoadingScreen from "../components/LoadingScreen";

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

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CustomHeader: {
    title?: string;
    rightComponent?: React.ReactNode;
    backgroundColor?: string;
    transparent?: boolean;
    showBack?: boolean;
  };
  Informacion: undefined;
  TusCitas: undefined;
  TusProgramas: undefined;
  Resultados: undefined;
  Medicamentos: undefined;
  ForgotPassword: undefined;
  VerifyCode: { document: string; documentType: DocumentType; mail: string, eps: string, fechaNacimiento: string };
  ResetPassword: {
    document: string;
    documentType: DocumentType;
    mail: string;
    value: string;
    eps: string;
    fechaNacimiento: string;
  };
  Autocuidado: {
    navigation: any;
    route: any;
  };
  SelfCareScreen: undefined;
  Landing: undefined;
  SurveySummary: {
    surveyId: string;
    responses: string[];
    puntaje: number;
    edad: number;
    sexo: string;
    indicadores: any;
    imc: number;
    survey: {
      id: string;
      nombre: string;
      descripcion: string;
      requiereEdad: boolean;
      requiereSexo: boolean;
      preguntas: {
        omitida: boolean;
        pregunta: string;
        opciones: { texto: string; valor: number; sexo: string }[];
        recomendaciones?: string;
      }[];
      recomendaciones?: {
        min: number;
        max: number;
        texto: string;
        sexo: string | null;
      }[];
    };
  };
  SurveyScreen: {
    surveyId: string;
    preguntas: {
      omitida: boolean;
      pregunta: string;
      opciones: { texto: string; valor: number; sexo: string }[];
      recomendaciones?: string;
    }[];
    edad: number;
    sexo: string;
    survey: {
      [x: string]: any;
      id: string;
      nombre: string;
      descripcion: string;
      preguntas: {
        omitida: boolean;
        pregunta: string;
        opciones: { texto: string; valor: number; sexo: string }[];
        recomendaciones?: string;
      }[];
      requiereEdad: boolean;
      requiereSexo: boolean;
      requiredIMC?: boolean;
    };
    indicadores: any;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

// Interfaz para solo lo que necesitamos del payload
type JwtPayloadMinimal = { exp: number };

/** Decodifica a mano el JWT y extrae exp */
function parseJwt(token: string): JwtPayloadMinimal | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    // reponer padding y reemplazar url-safe
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<"Home" | "Landing" | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const token = await getToken(); // obtiene el JWT si existe :contentReference[oaicite:1]{index=1}

      if (token) {
        const payload = parseJwt(token);
        if (payload && payload.exp > Date.now() / 1000) {
          setInitialRoute("Home");
          return;
        }
        // si expiró o parseJwt devolvió null, limpiamos
        await AsyncStorage.removeItem("token");
      }
      setInitialRoute("Landing");
    })();
  }, []);

  // Mientras determinamos la ruta inicial, mostramos un loader
  if (!initialRoute) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {initialRoute === "Landing" ? (
          // Stack de autenticación
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Informacion" component={PatientInfoScreen} />
            <Stack.Screen name="TusCitas" component={AppointmentScreen} />
            <Stack.Screen name="TusProgramas" component={ProgramsScreen} />
            <Stack.Screen name="Resultados" component={ResultsScreen} />
            <Stack.Screen name="Medicamentos" component={PrescriptionsScreen} />
            <Stack.Screen name="Autocuidado" component={SelfCareScreen} />
            <Stack.Screen name="SurveyScreen" component={SurveyScreen} />
            <Stack.Screen name="SurveySummary" component={SurveySummary} />
            <Stack.Screen name="SelfCareScreen" component={SelfCareScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
          </>
        ) : (
          // Stack principal de la app
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Informacion" component={PatientInfoScreen} />
            <Stack.Screen name="TusCitas" component={AppointmentScreen} />
            <Stack.Screen name="TusProgramas" component={ProgramsScreen} />
            <Stack.Screen name="Resultados" component={ResultsScreen} />
            <Stack.Screen name="Medicamentos" component={PrescriptionsScreen} />
            <Stack.Screen name="Autocuidado" component={SelfCareScreen} />
            <Stack.Screen name="SurveyScreen" component={SurveyScreen} />
            <Stack.Screen name="SurveySummary" component={SurveySummary} />
            <Stack.Screen name="SelfCareScreen" component={SelfCareScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNavigator;
