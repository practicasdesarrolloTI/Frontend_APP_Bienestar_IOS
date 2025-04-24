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
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchResults } from "../services/resultService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";

type Props = NativeStackScreenProps<RootStackParamList, "Resultados">;

type Resultado = {
  id: string;
  fechaRealizacion: string;
  examen: string;
  estado: string;
  programa: string;
};

const ResultsScreen: React.FC<Props> = ({ navigation }) => {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const noHayResultados = resultados.length === 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tipo = await AsyncStorage.getItem("tipoDocumento");
        const doc = await AsyncStorage.getItem("documento");
        if (!tipo || !doc) throw new Error("Faltan datos del paciente");

        const data = await fetchResults(tipo, doc);
        setResultados(data);
      } catch (error) {
        console.error("Error al cargar resultados:", error);
        Alert.alert(
          "Error",
          "No se pudo cargar la información de los resultados"
        );
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
      Alert.alert("Error", "No se pudo abrir el enlace.");
    }
  };

  if (loading) return <LoadingScreen />;

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
        <Text style={styles.title}>Resultados</Text>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: resultados.length === 0 ? "center" : "flex-start",
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <EmptyState message="Aún no se han registrado resultados de exámenes para ti." />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha: </Text>
                {item?.fechaRealizacion || "Fecha no disponible"}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Examen: </Text>
                {item.examen}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Médico Remisor: </Text>
                {item.programa}
              </Text>
            </View>
          )}
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
    height: 70,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    marginTop: 15,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
    fontFamily: fonts.body,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.primary,
    fontFamily: fonts.subtitle,
  },
  status: {
    fontSize: 18,
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    fontFamily: fonts.subtitle,
  },
  available: {
    backgroundColor: "green",
    color: colors.white,
  },
  pending: {
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  footerButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
  },
  footerButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 25,
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
