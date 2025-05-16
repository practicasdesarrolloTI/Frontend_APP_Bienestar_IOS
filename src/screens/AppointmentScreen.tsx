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
  ImageBackground,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../themes/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchCitas } from "../services/appointmentService";
import LoadingScreen from "../components/LoadingScreen";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import EmptyState from "../components/EmptyState";
import CustomDateRangeFilter from "../components/CustomDateRangeFilter";
import CustomHeader from "../components/CustomHeader";
import LogOutModal from "../components/LogOutModal";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const tipoDocumento =
          (await AsyncStorage.getItem("tipoDocumento")) ?? "";
        const numeroDocumento = (await AsyncStorage.getItem("documento")) ?? "";

        const data = await fetchCitas(tipoDocumento, numeroDocumento);

        // Formateamos los datos según el tipo `Cita`
        if (data.length === 0) {
          Toast.show({
            type: "info",
            text1: "No tienes citas agendadas por el momento.",
          });
        }
        const citasFormateadas = data.map((item: any, index: number) => ({
          id: index.toString(),
          fecha: item.fecha_cita?.split(" ")[0] || "",
          hora: item.hora_cita?.slice(0, 8) || "",
          especialidad: item.especialidad || "",
          programa: item.programa || "—",
          medico: item.nombre_medico || "",
          estado: item.estado || "",
        }));

        setCitas(citasFormateadas);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const citasFiltradas = citas.filter((cita) => cita.estado === "AUTORIZADO");
  const citasOrdenadas = citasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaA.getTime() - fechaB.getTime();
  });

  const citasFiltradasPorFecha = citasOrdenadas.filter((c) => {
    const fecha = new Date(c.fecha);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    return true;
  });

  /* Función para formatear la hora */
  const formatHora = (hora: string) => {
    if (!hora) return "";
    const [hours, minutes] = hora.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
  const capitalizeSentence = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/(^\w{1}|\.\s*\w{1})/g, (match) => match.toUpperCase());
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
        source={require("../../assets/fondo_preuba_app2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
         {/* Header transparente */}
        <CustomHeader
          title="Citas"
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
          {/* Lista de Citas */}
          {citasFiltradasPorFecha.length === 0 ? (
            <EmptyState message="No tienes citas agendadas por el momento." />
          ) : (
            <FlatList
              data={citasFiltradasPorFecha}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    {/* Columna izquierda: Fecha */}
                    <View style={styles.leftColumn}>
                      <Text style={styles.dateDay}>
                        {new Date(item.fecha).getDate()}
                      </Text>
                      <Text style={styles.dateMonth}>
                        {new Date(item.fecha).toLocaleDateString("es-CO", {
                          month: "long",
                        })}
                      </Text>
                      <Text style={styles.dateYear}>
                        {new Date(item.fecha).getFullYear()}
                      </Text>
                    </View>
                    {/* Columna derecha: Detalles */}
                    <View style={styles.rightColumn}>
                      <Text style={styles.text}>
                        <Text style={styles.label}>Hora: </Text>
                        {formatHora(item.hora)}
                      </Text>
                      <Text style={styles.text}>
                        <Text style={styles.label}>Médico: </Text>{" "}
                        {capitalizeName(item.medico)}
                      </Text>
                      <Text style={styles.text}>
                        <Text style={styles.label}>Especialidad: </Text>
                        {capitalizeSentence(item.especialidad)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
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
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    height: 140,
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
  leftColumn: {
    width: "20%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
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

export default AppointmentScreen;
