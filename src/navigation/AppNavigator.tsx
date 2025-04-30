import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import PatientInfoScreen from "../screens/PatientInfoScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import ProgramsScreen from "../screens/ProgramsScreen";
import ResultsScreen from "../screens/ResultsScreen";
import PrescriptionsScreen from "../screens/PrescriptionsScreen";
import SelfCareScreen from "../screens/SelfCareScreen";
import SurveyScreen from "../components/SurveyScreen";
import SurveySummary from "../components/SurveySummary";
import LandingScreen from "../screens/LandingScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import Header from "../components/Header";


type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS";

export type RootStackParamList = {

  Login: undefined;
  Register: undefined;
  Home: undefined;
  Header : { title: string; goTo?: keyof RootStackParamList };
  Informacion: undefined;
  TusCitas: undefined;
  TusProgramas: undefined;
  Resultados: undefined;
  Medicamentos: undefined;
  ForgotPassword: undefined;
  VerifyCode: { document: string, documentType: DocumentType, mail: string };
  ResetPassword: { document: string; documentType: DocumentType, mail:string; value: string };
  Autocuidado: {
    navigation: any;
    route: any;
  };
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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
