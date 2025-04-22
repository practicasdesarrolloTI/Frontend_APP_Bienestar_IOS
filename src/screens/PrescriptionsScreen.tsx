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
} from "react-native";
import colors from "../themes/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchMedicaments } from "../services/medicamentService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";

type Props = NativeStackScreenProps<RootStackParamList, "Medicamentos">;

type Medicamento = {
  id: string;
  nombre: string;
  fechaOrden: string;
  medico: string;
  estado: "Pendiente" | "Reformulado" | "Descargado";
};

const pdfAsset = require("../../assets/resultado.pdf");

const MedicamentScreen: React.FC<Props> = ({ navigation }) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tipo = await AsyncStorage.getItem("tipoDocumento");
        const doc = await AsyncStorage.getItem("documento");
        if (!tipo || !doc) throw new Error("Faltan datos del paciente");

        const data = await fetchMedicaments(tipo, doc);
        setMedicamentos(data);
      } catch (error) {
        Alert.alert(
          "Error",
          "No se pudo cargar la información de los medicamentos"
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDownload = async () => {
    try {
      const asset = Asset.fromModule(pdfAsset);
      await asset.downloadAsync();

      const localUri = asset.localUri || asset.uri;
      const fileName = "formula.pdf";
      const destinationUri = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: localUri,
        to: destinationUri,
      });

      await Sharing.shareAsync(destinationUri, {
        mimeType: "application/pdf",
        dialogTitle: "Ver fórmula médica",
      });
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      Alert.alert("Error", "No se pudo descargar el archivo.");
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
        <Text style={styles.title}>Medicamentos</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: medicamentos.length === 0 ? "center" : "flex-start",
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <EmptyState message="Aún no tienes medicamentos registrados." />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>
                <Text style={styles.label}>Nombre: </Text> {item.nombre}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha: </Text> {item.fechaOrden}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Médico: </Text> {item.medico}
              </Text>
              <Text
                style={[
                  styles.status,
                  item.estado === "Pendiente"
                    ? styles.pending
                    : item.estado === "Reformulado"
                    ? styles.reformulated
                    : styles.downloaded,
                ]}
              >
                {item.estado}
              </Text>
              {(item.estado === "Pendiente" ||
                item.estado === "Reformulado" ||
                item.estado === "Descargado") && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDownload}
                >
                  <Text style={styles.buttonText}>Descargar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  actionButton: {
    marginTop: 10,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fonts.subtitle,
  },
  status: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  pending: {
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  reformulated: {
    backgroundColor: "#ff9900",
    color: colors.white,
  },
  downloaded: {
    backgroundColor: colors.green,
    color: colors.white,
  },
});

export default MedicamentScreen;
