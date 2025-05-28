import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import colors from "../themes/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { findriscSurvey } from "../data/findriscSurvey";
import { lawtonBrodySurvey } from "../data/lawtonBrodySurvey";
import { framinghamSurvey } from "../data/fragmiganSurvey";
import { moriskyGreenSurvey } from "../data/moriskyGreenSurvey";
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
import { fetchAutocuidado } from "../services/surveyService";
import CustomHeader from "../components/CustomHeader";
import WarningModal from "../components/WarningModal";

type ResultadoEncuesta = {
  surveyId: string;
  createdAt: string;
  updatedAt: string;
};

type Survey = {
  id: string;
  nombre: string;
  image?: string;
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

  const [modalVisible, setModalVisible] = useState(false);
  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text2: "Has cerrado sesión correctamente.",
      position: "bottom",
    });
    navigation.navigate("Login");
  };

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
    } finally {
      setLoading(false);
    }
  };

  const [Paciente, setPatient] = useState<Paciente | null>(null);
  const loadPatient = async () => {
    try {
      const storedDoc = await AsyncStorage.getItem("documento");
      const storedTipo = await AsyncStorage.getItem("tipoDocumento");
      if (!storedDoc || !storedTipo) {
        Toast.show({
          type: "error",
          text2: "No se encontró el documento del paciente.",
          position: "bottom",
        });
        return;
      }

      const data = await getPatientByDocument(storedDoc);
      setPatient(data as unknown as Paciente);

      const indicadoresData = await fetchAutocuidado(storedTipo, storedDoc);
      setIndicadores(indicadoresData);
    } catch (error) {
      
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
      image: require("../../assets/icons/findrisc_b.png"),
    },
    {
      ...lawtonBrodySurvey,
      requiereEdad: false,
      requiereSexo: false,
      requiredIMC: false,
      image: require("../../assets/icons/lawton_b.png"),
    },
    {
      ...framinghamSurvey,
      requiereEdad: true,
      requiereSexo: true,
      requiredIMC: false,
      image: require("../../assets/icons/framingham_b.png"),
    },
    {
      ...moriskyGreenSurvey,
      requiereEdad: false,
      requiereSexo: false,
      requiredIMC: false,
      image: require("../../assets/icons/morisky_b.png"),
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
    const estado = estadoEncuestas[survey.id] || {
      bloqueada: false,
      cargando: true,
    };
    if (estado.cargando) {
      return <SkeletonSurveyCard />;
    }
    return (
      <SurveyCard
        key={survey.id}
        survey={{
          id: survey.id,
          nombre: survey.nombre,
          image: survey.image,
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
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/Fondos/Inicio.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title="Autocuidado"
          showBack
          transparent
          showProfileIcon
          onLogout={() => setModalVisible(true)}
          goBackTo="Home"
        />

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
        {/* Modal de Cerrar Sesión */}
        <WarningModal
          text="¿Estás seguro de que deseas cerrar sesión?"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onConfirm={handleLogout}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 30,
  },
});

export default SelfCareScreen;
