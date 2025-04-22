//Dejar solo las pendientes
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
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchAppointments } from "../services/appointmentService";
import LoadingScreen from "../components/LoadingScreen";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import EmptyState from "../components/EmptyState";

type Props = NativeStackScreenProps<RootStackParamList, "TusCitas">;

type Cita = {
  id: string;
  fecha: string;
  hora: string;
  especialidad: string;
  programa: string;
  medico: string;
  estado: string;
};

const AppointmentScreen: React.FC<Props> = ({ navigation }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tipoDocumento =
          (await AsyncStorage.getItem("tipoDocumento")) ?? "";
        const numeroDocumento = (await AsyncStorage.getItem("documento")) ?? "";

        const data = await fetchAppointments(tipoDocumento, numeroDocumento);

        // Formateamos los datos según el tipo `Cita`
        const citasFormateadas = data.map((item: any, index: number) => ({
          id: index.toString(),
          fecha: item.fecha_cita?.split(" ")[0] || "",
          hora: item.fecha_cita?.split(" ")[1]?.slice(0, 5) || "",
          especialidad: item.Especialidad || "",
          programa: item.programa || "—",
          medico: item.nombre_medico || "",
          estado: item.estado || "",
        }));

        setCitas(citasFormateadas);
      } catch (error) {
       console.error("Error al cargar citas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const citasFiltradas = citas.filter((cita) => cita.estado === "Pendiente");
  const citasOrdenadas = citasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaA.getTime() - fechaB.getTime();
  });

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
        <Text style={styles.title}>Citas</Text>
      </View>

      <View style={styles.container}>
        {/* Lista de Citas */}
        {citasOrdenadas.length === 0 ? (
          <EmptyState message="No tienes citas agendadas por el momento." />
        ) : (
          <FlatList
            data={citasOrdenadas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Fecha: </Text>
                  {item.fecha} {item.hora}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Médico: </Text> {item.medico}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Especialidad: </Text>{" "}
                  {item.especialidad}
                </Text>
                <Text
                  style={[
                    styles.status,
                    item.estado === "Pendiente"
                      ? styles.pending
                      : styles.completed,
                  ]}
                >
                  {item.estado}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: colors.background,
  },
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
  backButton: {
    top: 30,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
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
  status: {
    fontSize: 18,

    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    fontFamily: fonts.subtitle,
  },
  pending: {
    backgroundColor: colors.secondary,
    color: "#fff",
  },
  completed: {
    backgroundColor: colors.primary,
    color: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.primary,
    fontFamily: fonts.subtitle,
  },
  errorText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default AppointmentScreen;
