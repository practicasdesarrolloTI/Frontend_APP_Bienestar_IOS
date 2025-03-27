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

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Informacion: undefined;
  TusCitas: undefined;
  TusProgramas: undefined;
  Resultados: undefined;
  Medicamentos: undefined;
  Autocuidado: undefined;
  SurveySummary: {
    surveyId: string;
    responses: string[];
  };
  SurveyScreen: {
    surveyId: string;
    preguntas: (
      | string
      | {
          pregunta: string;
          opciones: {
            sexo: any; texto: string; valor: number 
}[];
        }
    )[];
    edad: number;
    sexo: string;
    survey: { requiereEdad: boolean; requiereSexo: boolean };
  };
  Landing: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
