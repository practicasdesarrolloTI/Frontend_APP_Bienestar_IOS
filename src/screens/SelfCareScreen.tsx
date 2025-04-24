import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { findriscSurvey } from "../data/findriscSurvey";
import { lawtonBrodySurvey } from "../data/lawtonBrodySurvey";
import { framinghamSurvey } from "../data/fragmiganSurvey";
import { getPatientByDocument } from "../services/patientService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calcularEdad } from "../utils/dateUtils";
import { fonts } from "../themes/fonts";
import { getSurveyResultsByDocument } from "../services/surveyResultService";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import SurveyCard from "../components/SurveyCard";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native-paper";
import { getRemainingTime } from "../utils/getRemainingTimeUtils";
import LoadingScreen from "../components/LoadingScreen";
import SkeletonSurveyCard from "../components/SurveySkeleton";
import { getPatientIndicators } from "../services/surveyService";

type ResultadoEncuesta = {
  surveyId: string;
  createdAt: string;
  updatedAt: string;
};

type Survey = {
  id: string;
  nombre: string;
  descripcion: string;
  preguntas: (
    | {
        omitida: any;
        pregunta: string;
        opciones: { texto: string; valor: number; sexo: any }[];
        recomendaciones?: string;
      }
    | {
        omitida: any;
        pregunta: string;
        opciones: { texto: string; valor: number; sexo: any }[];
        recomendaciones?: string;
      }
  )[];
  requiereEdad: boolean;
  requiereSexo: boolean;
  requiredIMC: boolean;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Autocuidado"
>;
type Paciente = {
  fecha_nacimiento: string;
  edad: number;
  sexo: string;
};

const SelfCareScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [resultados, setResultados] = useState<ResultadoEncuesta[]>([]);
  const [indicadores, setIndicadores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estadoEncuestas, setEstadoEncuestas] = useState<
    Record<
      string,
      { bloqueada?: boolean; disponibleEn?: any; cargando?: boolean }
    >
  >({});

  const loadResultados = async () => {
    const storedDoc = await AsyncStorage.getItem("documento");
    const initialState: Record<string, any> = {};
    encuestas.forEach((encuesta) => {
      initialState[encuesta.id] = { cargando: true };
    });
    setEstadoEncuestas(initialState);
    if (!storedDoc) return;
    try {
      const data = await getSurveyResultsByDocument(storedDoc);

      setResultados(data as ResultadoEncuesta[]);
    } catch (error) {
      console.log("Error al obtener resultados previos:", error);
    } finally {
      setLoading(false);
    }
  };

  const [Paciente, setPatient] = useState<Paciente | null>(null);
  const loadPatient = async () => {
    try {
      const storedDoc = await AsyncStorage.getItem("documento");
      const storedTipo = await AsyncStorage.getItem('tipoDocumento');
      if (!storedDoc || !storedTipo) {
        Alert.alert("Error", "No se encontró el documento del paciente.");
        return;
      }

      const data = await getPatientByDocument(storedDoc);
      setPatient(data as unknown as Paciente);

      const indicadoresData = await getPatientIndicators(storedTipo, storedDoc);
      setIndicadores(indicadoresData);
      
    } catch (error) {
      Alert.alert("Error", "Error al obtener información del paciente.");
    }
  };

  useEffect(() => {
    loadPatient();
    loadResultados();
  }, []);
  const [encuestas] = useState<Survey[]>([
    {
      ...findriscSurvey,
      requiereEdad: true,
      requiereSexo: true,
      requiredIMC: true,
    },
    {
      ...lawtonBrodySurvey,
      requiereEdad: false,
      requiereSexo: false,
      requiredIMC: false,
    },
    {
      ...framinghamSurvey,
      requiereEdad: true,
      requiereSexo: true,
      requiredIMC: false,
    },
  ]);

  useEffect(() => {

    if (!encuestas.length) return;

    const intervalo = setInterval(() => {
      const nuevosEstados: Record<string, any> = { ...estadoEncuestas };
      encuestas.forEach((encuesta) => {
        const resultado = resultados.find((r) => r.surveyId === encuesta.id);

        if (!resultado) {
          nuevosEstados[encuesta.id] = { bloqueada: false, cargando: false };
        } else {
          const fechaEncuesta = resultado.createdAt;
          if (!fechaEncuesta) return;
          const tiempoRestante = getRemainingTime(fechaEncuesta);

          const completado = tiempoRestante.completado;

          nuevosEstados[encuesta.id] = {
            bloqueada: !completado,
            disponibleEn: tiempoRestante,
            cargando: false,
          };
        }
      });

      setEstadoEncuestas(nuevosEstados);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [encuestas, resultados]);

  const handleOpenSurvey = (survey: Survey) => {
    if (!Paciente) return;

    const resultado = resultados.find((r) => r.surveyId === survey.id);
    const estado = estadoEncuestas[survey.id];

    if (estado?.bloqueada) {
      const { meses, dias, horas } = estado?.disponibleEn || {};
      const partes: string[] = [];
      if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
      if (dias > 0) partes.push(`${dias} día${dias > 1 ? "s" : ""}`);
      if (horas > 0) partes.push(`${horas} hora${horas > 1 ? "s" : ""}`);

      Toast.show({
        type: "error",
        text1: "Encuesta realizada",
        text2: `Podrás volver a realizar esta encuesta en ${partes.join(
          " y "
        )}.`,
        position: "bottom",
      });
      return;
    }

    const edad = calcularEdad(Paciente.fecha_nacimiento);
    const sexo = Paciente.sexo === "M" ? "Masculino" : "Femenino";

    navigation.navigate("SurveyScreen", {
      surveyId: survey.id,
      preguntas: survey.preguntas,
      edad,
      sexo,
      survey,
      indicadores,
    });
  };

  const renderSurvey = (survey: Survey) => {
    const estado = estadoEncuestas[survey.id] || { bloqueada: false, cargando: true };
    if (estado.cargando) {
      return <SkeletonSurveyCard />;
    }
    return (
      <SurveyCard
        key={survey.id}
        survey={{
          nombre: survey.nombre,
          descripcion: survey.descripcion,
          bloqueada: estado.bloqueada,
        }}
        tiempoRestante={estado.disponibleEn}
        cargando={estado.cargando}
        onPress={() => handleOpenSurvey(survey)}
      />
    );
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Home")}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Autocuidado</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={styles.title.color} />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={encuestas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderSurvey(item)}
          />
        </View>
      )}
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
    padding: 30,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    fontFamily: fonts.body,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    color: colors.primary,
    fontFamily: fonts.title,
  },
});

export default SelfCareScreen;
