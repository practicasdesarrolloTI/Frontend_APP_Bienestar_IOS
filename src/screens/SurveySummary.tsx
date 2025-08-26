import React from "react";
import { useState } from "react";
import RecommendationModal from "../components/RecommendationModal";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
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
  const [isSending, setIsSending] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setIsSending(true);
      const loadPatient = async () => {
        const storedTipo = await AsyncStorage.getItem("tipoDocumento");
        const storedDoc = await AsyncStorage.getItem("documento");
        if (!storedDoc || !storedTipo) {
          Toast.show({
            type: "error",
            text2: "No se encontró información del paciente.",
            position: "bottom",
          });
          setIsSending(false);
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
        edad,
        sexo,
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
        // navigation.navigate("Home");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text2: "Error al guardar el resultado de la encuesta.",
        position: "bottom",
      });
    } finally {
      setIsSending(false);
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
        source={require("../../assets/backgrounds/Resumen_encuesta.png")}
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

        <View style={styles.outerContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.summaryCard}>
              {/* Bloque de info general (edad, sexo, IMC) */}
              <View style={styles.section}>
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
              </View>

              <View style={styles.separator} />

              {/* Bloque de cada respuesta de pregunta */}
              <View style={styles.section}>
                {responses.map((r, i) => (
                  <View key={i} style={styles.item}>
                    <Text style={styles.label}>Pregunta #{i + 1}</Text>
                    <Text style={styles.value}>
                      {typeof r === "object" ? r.texto : r}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Botón fijo en la parte inferior */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            disabled={isSending} // deshabilita si ya está enviando
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar Encuesta</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* RecommendationModal recibe loading={isSending} */}
        <RecommendationModal
          visible={modalVisible}
          recomendacion={obtenerRecomendacion()}
          loading={isSending} // <--- pasamos el estado
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HORIZONTAL_MARGIN = scale(30);
const CONTAINER_WIDTH = SCREEN_WIDTH - HORIZONTAL_MARGIN * 2;
const CARD_VERTICAL_MARGIN = verticalScale(10);
const BUTTON_WIDTH = SCREEN_WIDTH - scale(80);
const BUTTON_HEIGHT = verticalScale(50);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  outerContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(10),
    paddingBottom: BUTTON_HEIGHT + verticalScale(10),
    alignItems: "center",
  },
  summaryCard: {
    width: CONTAINER_WIDTH,
    height: SCREEN_HEIGHT * 0.65,
    padding: verticalScale(15),
    marginVertical: CARD_VERTICAL_MARGIN,
  },
  section: {
    width: "100%",
  },
  item: {
    marginBottom: verticalScale(12),
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.lightGray,
    fontFamily: fonts.subtitle,
  },
  value: {
    fontSize: moderateScale(15),
    color: colors.preto,
    fontFamily: fonts.body,
    marginTop: verticalScale(4),
  },
  separator: {
    borderStyle: "dashed",
    width: "100%",
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    marginVertical: verticalScale(12),
  },
  button: {
    backgroundColor: colors.primary,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: moderateScale(50),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
  },
});

export default SurveySummary;
