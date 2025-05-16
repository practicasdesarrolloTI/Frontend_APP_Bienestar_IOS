import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import colors from "../themes/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  fetchMedicamentos,
  fetchMedicamentsVigentes,
} from "../services/medicamentService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";
import { getPatientByDocument } from "../services/patientService";
import Toast from "react-native-toast-message";
import CustomDateRangeFilter from "../components/CustomDateRangeFilter";
import CustomHeader from "../components/CustomHeader";
import LogOutModal
 from "../components/LogOutModal";
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
  cantidad: number;
  dosificacion: number;
  presentacion: string;
  fechaVencimiento: string;
};

const MedicamentScreen: React.FC<Props> = ({ navigation }) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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


  const loadData = async () => {
    try {
      const tipo = await AsyncStorage.getItem("tipoDocumento");
      const doc = await AsyncStorage.getItem("documento");
      if (!tipo || !doc) throw new Error("Faltan datos del paciente");

      const data = await fetchMedicamentos(tipo, doc);

      // const tipoDoc = "CC";
      // const documento = "9010000560"; //9010000560  9010000322

      // const dataPANA = await fetchMedicamentsVigentes(tipoDoc, documento);

      // const medicamentosData = dataPANA.flatMap((orden: any) =>
      //   orden.medicamentos.map((med: any, idx: number) => ({
      //     id: `${orden.no_autorizacion}-${idx}`,
      //     nombre: med.nombre_medicamento,
      //     cantidad: med.cant_presentacion,
      //     dosificacion: med.dosificacion,
      //     presentacion: med.presentacion,
      //     fechaVencimiento: orden.fecha_vencimiento,
      //   }))
      // );

      setMedicamentos(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar la información de los medicamentos.",
        visibilityTime: 4000,
      });
      return;
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
      return;
    }
  };

  const medicamentosFiltrados = medicamentos.filter((m) => {
    if (!fechaInicio && !fechaFin) return true;

    const fecha = new Date(m.fechaVencimiento);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    return true;
  });

  useEffect(() => {
    const loadEverything = async () => {
      try {
        await Promise.all([loadPatient(), loadData()]);
      } finally {
        setLoading(false);
      }
    };

    loadEverything();
  }, []);

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

  /* Función para capitalizar la primera letra de cada oración */
  const capitalizeSentence = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/(^\w{1}|\.\s*\w{1})/g, (match) => match.toUpperCase());
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
          title="Medicamentos"
          showBack
          transparent
          showProfileIcon
          onLogout={() => setModalVisible(true)}
        />

        <View style={styles.container}>
          <CustomDateRangeFilter
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onChangeInicio={setFechaInicio}
            onChangeFin={setFechaFin}
          />

          <FlatList
            data={medicamentosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent:
                medicamentos.length === 0 ? "center" : "flex-start",
              paddingBottom: 100,
            }}
            ListEmptyComponent={
              <EmptyState message="Aún no tienes medicamentos registrados." />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  {/* Columna izquierda: Fecha */}
                  <View style={styles.leftColumn}>
                    <Text style={styles.dateText}>Fecha de Vencimiento: </Text>
                    <Text style={styles.dateDay}>
                      {new Date(item.fechaVencimiento).getDate()}
                    </Text>
                    <Text style={styles.dateMonth}>
                      {new Date(item.fechaVencimiento).toLocaleDateString(
                        "es-CO",
                        {
                          month: "long",
                        }
                      )}
                    </Text>
                    <Text style={styles.dateYear}>
                      {new Date(item.fechaVencimiento).getFullYear()}
                    </Text>
                  </View>

                  {/* Columna derecha: Detalles */}
                  <View style={styles.rightColumn}>
                    <Text style={styles.text}>
                      <Text style={styles.label}>
                        {formatName(item.nombre)}
                      </Text>
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.label}>Cantidad: </Text>{" "}
                      {item.cantidad}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.label}>Dosis: </Text>
                      {item.dosificacion ?? "No disponible"}
                    </Text>
                    {item.presentacion && item.presentacion !== "NINGUNO" && (
                      <Text style={styles.text}>
                        <Text style={styles.label}>Presentación: </Text>
                        {capitalizeSentence(item.presentacion)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          />
          {/* Modal de Cerrar Sesión */}
          <LogOutModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
          />
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    height: 150,
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  text: {
    fontSize: 17,
    marginBottom: 2,
    color: "#333",
    fontFamily: fonts.body,
  },
  label: {
    fontSize: 17,
    color: colors.primary,
    fontFamily: fonts.subtitle,
  },

  leftColumn: {
    width: "24%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 10,
    color: "white",
    fontFamily: fonts.body,
    marginBottom: 2,
  },
  dateDay: {
    fontSize: 22,
    color: "white",
    fontFamily: fonts.title,
  },
  dateMonth: {
    fontSize: 16,
    color: "white",
    fontFamily: fonts.body,
    textTransform: "capitalize",
  },
  dateYear: {
    fontSize: 18,
    color: "white",
    fontFamily: fonts.subtitle,
    borderTopWidth: 1,
    borderTopColor: "white",
  },
  rightColumn: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default MedicamentScreen;
