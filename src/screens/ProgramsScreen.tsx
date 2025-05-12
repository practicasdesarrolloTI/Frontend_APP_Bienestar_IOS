// Dejar pendientes
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
import { fetchPrograms } from "../services/programService";
import LoadingScreen from "../components/LoadingScreen";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "TusProgramas">;

type Programa = {
  id: string;
  fecha_cita: string;
  programa: string;
  hora: string;
  medico: string;
  especialidad: string;
  estado: string;
};

const ProgramsScreen: React.FC<Props> = ({ navigation }) => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const tipo = await AsyncStorage.getItem("tipoDocumento");
        const doc = await AsyncStorage.getItem("documento");
        if (!tipo || !doc) throw new Error("Datos incompletos");

        const data = await fetchPrograms(tipo, doc);

        const formateados = data.map((item: any, index: number) => ({
          id: index.toString(),
          fecha_cita:
            item.fecha_cita?.split(" ")[0] ?? "No tienes citas agendadas",
          hora: item.hora_cita?.slice(0, 8) ?? " ",
          programa: item.Programa ?? "",
          medico: item.nombre_medico ?? "",
          especialidad: item.Especialidad ?? "",
          estado: item.estado_cita ?? "Pendiente",
        }));

        setProgramas(formateados);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "No se pudieron cargar los programas");
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // const programasFiltrados = programas.filter(
  //   (programa) => programa.estado === "Pendiente"
  // );
  const programasOrdenados = programas.sort((a, b) => {
    const fechaA = new Date(a.fecha_cita);
    const fechaB = new Date(b.fecha_cita);
    return fechaA.getTime() - fechaB.getTime();
  });

  {
    /* Función para formatear la hora */
  }
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
  {
    /* Función para capitalizar el nombre */
  }
  const capitalizeName = (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };
  {
    /* Función para capitalizar la primera letra de cada oración */
  }
  const capitalizeSentence = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/(^\w{1}|\.\s*\w{1})/g, (match) => match.toUpperCase());
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
        <Text style={styles.title}>Programas</Text>
      </View>

      <View style={styles.container}>
        {/* Lista de Programas */}
        <FlatList
          data={programasOrdenados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  {/* <Text style={styles.text}>
                <MaterialIcons name="calendar-today" size={16} /> Fecha de
                inscripción: {item.fechaInscripcion}
              </Text> */}
                </View>
                {/* Columna izquierda: Fecha */}
                <View style={styles.leftColumn}>
                  <Text style={styles.dateDay}>
                    {new Date(item.fecha_cita).getDate()}
                  </Text>
                  <Text style={styles.dateMonth}>
                    {new Date(item.fecha_cita).toLocaleDateString("es-CO", {
                      month: "long",
                    })}
                  </Text>
                  <Text style={styles.dateYear}>
                    {new Date(item.fecha_cita).getFullYear()}
                  </Text>
                </View>

                {/* Columna derecha: Detalles */}
                <View style={styles.rightColumn}>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Hora: </Text>
                    {formatHora(item.hora)}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Programa: </Text>
                    {item.programa}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Médico: </Text>
                    {capitalizeName(item.medico)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
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
    fontSize: 17,
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: fonts.subtitle,
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

export default ProgramsScreen;
