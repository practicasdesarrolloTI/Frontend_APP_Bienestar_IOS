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
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, "TusProgramas">;

type Programa = {
  id: string;
  fecha_cita: string;
  programa: string;
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
        const tipo = await AsyncStorage.getItem('tipoDocumento');
        const doc = await AsyncStorage.getItem('documento');
        if (!tipo || !doc) throw new Error('Datos incompletos');

        const data = await fetchPrograms(tipo, doc);

        const formateados = data.map((item: any, index: number) => ({
          id: index.toString(),
          fecha_cita: item.fecha_cita?.split(' ')[0] ?? 'No tienes citas agendadas',
          programa: item.Programa ?? '',
          medico: item.nombre_medico ?? '',
          especialidad: item.Especialidad ?? '',
          estado: item.estado_cita ?? 'Pendiente',
        }));

        setProgramas(formateados);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudieron cargar los programas');
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
  }
  );

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
              <View > 
              {/* <Text style={styles.text}>
                <MaterialIcons name="calendar-today" size={16} /> Fecha de
                inscripción: {item.fechaInscripcion}
              </Text> */}
              </View>
              <Text style={styles.text}>
                <Text style={styles.label}>Programa:{" "}</Text>
                {item.programa}
              </Text>
              <Text style={styles.text}>
              <Text style={styles.label}>Médico:{" "}</Text>
                {item.medico}
              </Text>
              <Text style={styles.text}>
              <Text style={styles.label}>Fecha próxima cita:{" "}</Text>
                {item.fecha_cita}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
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
    fontWeight: "bold",
    fontFamily: fonts.subtitle,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default ProgramsScreen;
