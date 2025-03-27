import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { findriscSurvey } from "../data/findriscSurvey";
import { lawtonBrodySurvey } from "../data/lawtonBrodySurvey";
import { fragmiganSurvey } from "../data/fragmiganSurvey";
import { fetchPatient } from "../services/patientService";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Autocuidado"
>;
type Paciente = {
  edad: number;
  sexo: string;
};
const SelfCareScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
 
    const [Paciente, setPatient] = useState<Paciente[]>([]);
    useEffect(() => {
      const loadPatient = async () => {
        try {
          const data = await fetchPatient();
          setPatient(data);
        } catch (error) {
          Alert.alert("Error", "No se pudo cargar la información del paciente");
        }
      };
      loadPatient();
    }, []);
  const [encuestas, setEncuestas] = useState([
    findriscSurvey,
    lawtonBrodySurvey,
    fragmiganSurvey,
  ]);

  

  const handleOpenSurvey = (survey: any) => {
    navigation.navigate("SurveyScreen", {
      surveyId: survey.id, // Ensure each survey has a unique ID
      preguntas: survey.preguntas,
      edad: Paciente[0].edad,
      sexo: Paciente[0].sexo,
      survey: {
        requiereEdad: survey.requiereEdad || false,
        requiereSexo: survey.requiereSexo || false,
      },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={encuestas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleOpenSurvey(item)}
          >
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.description}>{item.descripcion}</Text>
            <MaterialIcons
              name="arrow-forward"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});

export default SelfCareScreen;
