import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ImageBackground,
} from "react-native";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchResults } from "../services/resultService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";
import CustomDateRangeFilter from "../components/CustomDateRangeFilter";
import CustomHeader from "../components/CustomHeader";
import Toast from "react-native-toast-message";
import LogOutModal from "../components/WarningModal";
import Buscador from "../components/Buscador";

type Props = NativeStackScreenProps<RootStackParamList, "Resultados">;

type Resultado = {
  id: string;
  fechaRealizacion: string;
  examen: string;
  programa: string;
  medico_remisor: string;
};

const ResultsScreen: React.FC<Props> = ({ navigation }) => {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState<Resultado[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const noHayResultados =
    resultados.length === 0 || resultadosFiltrados.length === 0;
  const [searchQuery, setSearchQuery] = useState("");

  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text1: "Sesión cerrada",
      text2: "Has cerrado sesión correctamente.",
    });
    navigation.navigate("Login");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tipo = await AsyncStorage.getItem("tipoDocumento");
        const doc = await AsyncStorage.getItem("documento");
        if (!tipo || !doc) throw new Error("Faltan datos del paciente");
        const data = await fetchResults(tipo, doc);
        setResultados(data);
        setResultadosFiltrados(data);
      } catch (error) {
        console.error("Error al cargar resultados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const openLabResultsWeb = async () => {
    const url =
      "https://resultadoslaboratorio.bienestarips.com:8443/resultados/#nbb";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show({
        type: "error",
        text2: "No se pudo abrir el enlace.",
      });
    }
  };

  /* Función para capitalizar el nombre */
  const capitalizeName = (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };

  /* Función para capitalizar la primera letra de cada oración */
  const formatName = (text: string): string => {
    const clear = text.replace(/\s*[\(\[].*?[\)\]]\s*/g, " ").trim();
    return clear
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };
  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/fondo_preuba_app2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title="Resultados"
          showBack
          transparent
          showProfileIcon
          onLogout={() => setModalVisible(true)}
        />

        <View style={styles.contentContainer}>
          {/* Buscador */}
          <Buscador
            value={searchQuery}
            onChange={(text) => {
              setSearchQuery(text);
              const lowerText = text.toLowerCase();
              const filtered = resultados.filter((resultado) =>
                [resultado.examen, resultado.programa, resultado.medico_remisor]
                  .join(" ")
                  .toLowerCase()
                  .includes(lowerText)
              );
              setResultadosFiltrados(filtered);
            }}
            placeholder="Buscar resultados"
          />

          <FlatList
            data={resultadosFiltrados}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <EmptyState message="No se encontraron resultados de momento" />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  {/* Columna izquierda: Fecha */}
                  <View style={styles.leftColumn}>
                    {item.fechaRealizacion &&
                    !isNaN(new Date(item.fechaRealizacion).getTime()) ? (
                      <>
                        <Text style={styles.dateDay}>
                          {new Date(item.fechaRealizacion).getDate()}
                        </Text>
                        <Text style={styles.dateMonth}>
                          {new Date(item.fechaRealizacion).toLocaleDateString(
                            "es-CO",
                            {
                              month: "long",
                            }
                          )}
                        </Text>
                        <Text style={styles.dateYear}>
                          {new Date(item.fechaRealizacion).getFullYear()}
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontFamily: fonts.body,
                        }}
                      >
                        No{"\n"}Disponible
                      </Text>
                    )}
                  </View>

                  {/* Columna derecha: Detalles */}
                  <View style={styles.rightColumn}>
                    <Text style={styles.text}>
                      <Text style={styles.label}>
                        {formatName(item.examen)}
                      </Text>
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.label}>Médico Remisor: </Text>
                      {capitalizeName(item.medico_remisor)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          {/* Modal de Cerrar Sesión */}
          <LogOutModal
            text="¿Estás seguro de que deseas cerrar sesión?"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
          />
        </View>

        {/* Botón fijo abajo */}
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              noHayResultados && styles.footerButtonDisabled,
            ]}
            onPress={openLabResultsWeb}
            disabled={noHayResultados}
          >
            <Text style={styles.footerButtonText}>
              Consultar Resultados en la Web
            </Text>
          </TouchableOpacity>
        </View>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardContent: {
    height: 140,
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.preto,
    fontFamily: fonts.body,
  },
  label: {
    fontSize: 16,
    color: colors.preto,
    fontFamily: fonts.title,
  },
  leftColumn: {
    width: "25%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  dateDay: {
    fontSize: 36,
    color: colors.white,
    fontFamily: fonts.title,
  },
  dateMonth: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.title,
    textTransform: "capitalize",
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  dateYear: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  rightColumn: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  footerButtonContainer: {
    marginTop: 10,
    paddingHorizontal: 30,
  },
  footerButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  footerButtonText: {
    color: "white",
    fontFamily: fonts.title,
    fontSize: 18,
  },
  footerButtonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default ResultsScreen;
