import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { submitSurvey } from "../services/surveyService";
import colors from "../themes/colors";
import { MaterialIcons } from "@expo/vector-icons";

type SurveySummaryProps = NativeStackScreenProps<
  RootStackParamList,
  "SurveySummary"
>;

const SurveySummary: React.FC<SurveySummaryProps> = ({ route, navigation }) => {
  const { surveyId, responses } = route.params;

  const handleSubmit = async () => {
    const result = await submitSurvey(surveyId, responses);
    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Éxito", "Encuesta enviada correctamente");
      navigation.navigate("Home");
    }
  };

  // 🔍 Procesar respuestas
  const edad = responses[0];
  const sexo = responses[1];
  const estatura = parseFloat(responses[2]);
  const peso = parseFloat(responses[3]);
  const imc = peso && estatura ? peso / (estatura * estatura) : NaN;

  const otrasRespuestas = responses.slice(4); // Resto de preguntas

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.title}>Resumen de Respuestas</Text>

        <View style={styles.summaryInfo}>
          <Text style={styles.response}>
            <Text style={styles.bold}>Edad:</Text> {edad}
          </Text>
          <Text style={styles.response}>
            <Text style={styles.bold}>Sexo:</Text> {sexo}
          </Text>
          <Text style={styles.response}>
            <Text style={styles.bold}>Estatura:</Text> {estatura} m
          </Text>
          <Text style={styles.response}>
            <Text style={styles.bold}>Peso:</Text> {peso} kg
          </Text>
          <Text style={styles.response}>
            <Text style={styles.bold}>IMC Calculado:</Text>{" "}
            {isNaN(imc) ? "N/A" : imc.toFixed(2)}
          </Text>

          {otrasRespuestas.map((res, i) => (
            <Text key={i} style={styles.response}>
              <Text style={styles.bold}>Pregunta {i + 1}:</Text> {res}
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Encuesta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "flex-start",
    padding: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    top: 30,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryInfo: {
    alignSelf: "center",
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    width: "95%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  response: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SurveySummary;
