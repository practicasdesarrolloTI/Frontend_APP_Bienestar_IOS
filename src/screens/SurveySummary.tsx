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
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { submitSurvey } from "../services/surveyService";
import colors from "../themes/colors";
import Toast from "react-native-toast-message";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { submitSurveyResult } from "../services/surveyResultService";
import CustomHeader from "../components/CustomHeader";
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
  const otrasRespuestas = responses;

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
        const storedTipo = await AsyncStorage.getItem("tipoDocumento");
        const storedDoc = await AsyncStorage.getItem("documento");
        if (!storedDoc || !storedTipo) {
          Alert.alert("Error", "No se encontró el documento del paciente.");
          return null;
        }

        const data = await getPatientByDocument(storedDoc);
        setPaciente(data as unknown as Paciente);
        return data;
      };

      const storedDoc = await loadPatient();
      const storedTipo = await AsyncStorage.getItem("tipoDocumento");
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
        sexo,
        edad,
        recomendacion,
      });

      if (result.error) {
        Toast.show({
          type: "error",
          text2: result.error,
        });
      } else {
        Toast.show({
          type: "success",
          text2: "Resultado guardado correctamente",
          position: "bottom",
          visibilityTime: 5000,
        });
        navigation.navigate("Home");
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text2: "Error al guardar el resultado de la encuesta.",
        position: "bottom",
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
        source={require("../../assets/Fondos/Resumen_encuesta.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title="Resumen de encuesta"
          showBack
          transparent
          onLogout={() => setModalVisible(true)}
        />

        <View style={styles.container}>
          <ScrollView>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryInfo}>
              <View>
                <View style={styles.item}>
                  <Text style={styles.label}>Edad</Text>
                  <Text style={styles.value}>{edad} años</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Sexo</Text>
                  <Text style={styles.value}>{sexo}</Text>
                </View>

                {!isNaN(imc) && imc > 0 && (
                  <View style={styles.item}>
                    <Text style={styles.label}>IMC Calculado</Text>
                    <Text style={styles.value}>{imc.toFixed(2)} kg/m²</Text>
                  </View>
                )}

                <View style={styles.separator} />

                {otrasRespuestas.map((r, i) => (
                  <View key={i} style={styles.item}>
                    <Text style={styles.label}>Pregunta #{i + 1}</Text>
                    <Text style={styles.value}>
                      {typeof r === "object" ? r.texto : r}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={handleShowModal}>
            <Text style={styles.buttonText}>Enviar Encuesta</Text>
          </TouchableOpacity>
        </View>
        <RecommendationModal
          visible={modalVisible}
          recomendacion={obtenerRecomendacion()}
          onClose={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            handleSubmit();
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  summaryContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: screenWidth - 30,
  },
  summaryInfo: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    width: screenWidth - 110,
  },
  item: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: colors.lightGray,
    fontFamily: fonts.subtitle,
  },
  value: {
    fontSize: 16,
    color: colors.preto,
    fontFamily: fonts.body,
    marginTop: 4,
  },
  separator: {
    borderStyle: "dashed",
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 2,
    marginVertical: 15,
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
    width: screenWidth - 100,
    paddingVertical: 18,
    borderRadius: 50,
    marginBottom: 35,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.title,
  },
});

export default SurveySummary;
