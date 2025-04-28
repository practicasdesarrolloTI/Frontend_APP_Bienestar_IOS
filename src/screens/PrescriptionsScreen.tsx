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
} from "react-native";
import colors from "../themes/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchMedicaments, getOrdenMedicamentos } from "../services/medicamentService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";
import {
  agruparMedicamentosPorFecha,
  generarPDFMedicamentos,
} from "../services/pdfServices";
import { getPatientByDocument } from "../services/patientService";
import { calcularEdad } from "../utils/dateUtils";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, "Medicamentos">;

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
  tipo_documento_abreviado: string;
};

type Medicamento = {
  id: string;
  nombre: string;
  fechaOrden: string;
  cantidad: number;
  estado: "Pendiente" | "Reformulado" | "Descargado";
};


const MedicamentScreen: React.FC<Props> = ({ navigation }) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  const loadData = async () => {
    try {
      const tipo = await AsyncStorage.getItem("tipoDocumento");
      const doc = await AsyncStorage.getItem("documento");
      if (!tipo || !doc) throw new Error("Faltan datos del paciente");

      const data = await fetchMedicaments(tipo, doc);

      const tipoDoc = "CC";
      const documento = "9010000322";

      const dataAPI = (await getOrdenMedicamentos(tipoDoc, documento)) as Array<{
        no_autorizacion: string;
        fecha_autorizacion: string;
        medicamentos: Array<{
          nombre_medicamento: string;
          cant_presentacion: number;
        }>;
      }>;
      const medicamentosExternos = dataAPI.flatMap((orden: any) =>
        orden.medicamentos.map((med: any, idx: number) => ({
          id: `${orden.no_autorizacion}-${idx}`,
          nombre: med.nombre_medicamento,
          presentacion: med.presentacion,
          dosificacion: med.dosificacion,
          dias_tratamiento: med.dias_tratamiento,
          cantidad: med.cant_presentacion,
          via: med.via,
          indicaciones: med.indicaciones,
          fechaOrden: orden.fecha_autorizacion,
          ordenCompleta: orden,
        }))
      );

      
      setMedicamentos(data);
      setOrdenes(medicamentosExternos);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar la información de los medicamentos.",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPatient = async () => {
    try {
      const storedDoc = await AsyncStorage.getItem("documento");
      if (!storedDoc) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se encontró el documento del paciente.",
        });
        return;
      }

      const data = await getPatientByDocument(storedDoc);
      setPaciente(data as unknown as Paciente);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar la información del paciente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatient();
    loadData();
  }, []);

  const handleDownload = async () => {
    try {
      const tipo = await AsyncStorage.getItem("tipoDocumento");
      const doc = await AsyncStorage.getItem("documento");
      const edad = paciente?.fecha_nacimiento
        ? calcularEdad(paciente.fecha_nacimiento)
        : 0;

      if (!tipo || !doc) throw new Error("Faltan datos del paciente");

      const agrupados = agruparMedicamentosPorFecha(ordenes);


      const fechasOrden = Object.keys(agrupados);
      // if (fechasOrden.length === 0) return;
      // Toast.show({
      //   type: "error",
      //   text1: "Sin medicamentos recientes",
      //   text2: "No hay medicamentos en los últimos 3 meses.",
      // });

      // Seleccionar la primera fecha (o podrías mostrar un Picker)
      const fechaSeleccionada = fechasOrden[0];
      await generarPDFMedicamentos(
        {
          nombre: paciente?.primer_nombre,
          tipoDocumento: paciente?.tipo_documento_abreviado,
          Documento: paciente?.documento,
          edad: edad,
        },
        agrupados[fechaSeleccionada],
        fechaSeleccionada
      );
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2:
          "La orden fue generada y está lista para visualizar o compartir.",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo generar la orden.",
      });
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
                <Text style={styles.label}>Cantidad: </Text> {item.cantidad}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha de vigencia: </Text> {item.fechaOrden}
              </Text>
              {/* <Text
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
              </Text> */}
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
