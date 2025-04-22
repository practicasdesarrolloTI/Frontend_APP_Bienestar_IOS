import React from "react";
import { useState } from "react";
import RecommendationModal from "../components/RecommendationModal";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { submitSurvey } from "../services/surveyService";
import colors from "../themes/colors";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { submitSurveyResult } from "../services/surveyResultService";
import { useNavigation } from "@react-navigation/native";
import { getPatientByDocument } from "../services/patientService";

type SurveySummaryProps = NativeStackScreenProps<
  RootStackParamList,
  "SurveySummary"
>;

type Respuesta =
  | string
  | number
  | {
      texto: string;
      valor: number;
    };

type Paciente = {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_documento: string;
  documento: string;
  fecha_nacimiento: string;
  codigo_ips: number;
  sexo: string;
  celular: number;
  telefono: number;
  correo: string;
  eps: string;
  iat: number;
};

const SurveySummary: React.FC<SurveySummaryProps> = ({ route, navigation }) => {
  const { surveyId, puntaje, edad, sexo, survey, imc } = route.params;
  const { responses } = route.params as unknown as { responses: Respuesta[] };
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const otrasRespuestas = responses.slice(2); // después de estatura/peso

  const obtenerRecomendacion = (): string => {
    if (!survey?.recomendaciones) return "";
    const recomendacion = survey.recomendaciones.find((rec: any) => {
      const sexoMatch =
        rec.sexo === null || rec.sexo?.toLowerCase() === sexo.toLowerCase();
      return rec.min <= puntaje && puntaje <= rec.max && sexoMatch;
    });
    return recomendacion?.texto || "No se encontró recomendación.";
  };
  const [modalVisible, setModalVisible] = useState(false);

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    const result = await submitSurvey(
      surveyId,
      responses.map((r) =>
        typeof r === "object" && "texto" in r ? r.texto : String(r)
      )
    );
    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Éxito", "Encuesta enviada correctamente");
      navigation.navigate("Home");
    }
  };

  const handleSubmit = async () => {
    try {
      const loadPatient = async () => {
        const storedTipo = await AsyncStorage.getItem('tipoDocumento');
        const storedDoc = await AsyncStorage.getItem("documento");
        if  (!storedDoc || !storedTipo) {
          Alert.alert("Error", "No se encontró el documento del paciente.");
          return null;
        }

        const data = await getPatientByDocument(storedDoc);
        setPaciente(data as unknown as Paciente);
        return data;
      };

      const storedDoc = await loadPatient();
      const storedTipo = await AsyncStorage.getItem('tipoDocumento');
      if (!storedDoc) return;

      const recomendacion = obtenerRecomendacion();

      const result = await submitSurveyResult({
        surveyId,
        patientTypeId: storedTipo ?? "",
        patientId: storedDoc.documento,
        patientName: `${storedDoc.primer_nombre} ${
          storedDoc.segundo_nombre || ""
        } ${storedDoc.primer_apellido} ${storedDoc.segundo_apellido || ""}`,
        surveyName: survey.nombre,
        responses: responses.map((r) =>
          typeof r === "object" && "texto" in r ? r.texto : String(r)
        ),
        puntaje,
        edad,
        sexo,
        recomendacion,
      });

      if (result.error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.error,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Resultado guardado correctamente",
          position: "bottom",
          visibilityTime: 5000,
        });
        navigation.navigate("Home");
      }
    } catch (e) {
      Alert.alert("Error", "Algo salió mal al guardar la encuesta.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Resumen de Respuestas</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryInfo}>
            <Text style={styles.response}>
              <Text style={styles.bold}>Edad:</Text> {edad}
            </Text>
            <Text style={styles.response}>
              <Text style={styles.bold}>Sexo:</Text> {sexo}
            </Text>

            {/* {!isNaN(estatura) && estatura > 0 && (
              <Text style={styles.response}>
                <Text style={styles.bold}>Estatura:</Text> {estatura} m
              </Text>
            )}

            {!isNaN(peso) && peso > 0 && (
              <Text style={styles.response}>
                <Text style={styles.bold}>Peso:</Text> {peso} kg
              </Text>
            )} */}

            {!isNaN(imc) && imc > 0 && (
              <Text style={styles.response}>
                <Text style={styles.bold}>IMC Calculado:</Text> {imc.toFixed(2)}{" "}
                kg/m²
              </Text>
            )}

            {otrasRespuestas.map((r, i) => (
              <Text key={i} style={styles.response}>
                <Text style={styles.bold}>Pregunta {i + 1}:</Text>{" "}
                {typeof r === "object" ? `${r.texto} (${r.valor})` : r}
              </Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleShowModal}>
          <Text style={styles.buttonText}>Enviar Encuesta</Text>
        </TouchableOpacity>
        <RecommendationModal
          visible={modalVisible}
          recomendacion={obtenerRecomendacion()}
          onClose={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            handleSubmit();
          }}
        />
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
    width: "100%",
    height: 70,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    gap: 16,
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
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
    padding: 20,
    width: "92%",
  },
  summaryInfo: {
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: "95%",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  response: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: fonts.body,
  },
  bold: {
    fontFamily: fonts.title,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    alignItems: "center",
    width: "90%",
    borderRadius: 25,
    marginBottom: 35,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: fonts.title,
  },
});

export default SurveySummary;
