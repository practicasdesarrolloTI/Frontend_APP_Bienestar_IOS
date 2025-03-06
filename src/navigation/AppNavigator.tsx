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
import SelfCareScreen from "../screens/SurveyScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Informacion" component={PatientInfoScreen} />
        <Stack.Screen name="TusCitas" component={AppointmentScreen} />
        <Stack.Screen name="TusProgramas" component={ProgramsScreen} />
        <Stack.Screen name="Resultados" component={ResultsScreen} />
        <Stack.Screen name="Medicamentos" component={PrescriptionsScreen} />
        <Stack.Screen name="Autocuidado" component={SelfCareScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
