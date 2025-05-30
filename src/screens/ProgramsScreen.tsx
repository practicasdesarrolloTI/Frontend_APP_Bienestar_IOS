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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchProgramas } from "../services/programService";
import LoadingScreen from "../components/LoadingScreen";
import { fonts } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../components/CustomHeader";
import LogOutModal from "../components/WarningModal";
import Toast from "react-native-toast-message";
import EmptyState from "../components/EmptyState";
import Buscador from "../components/Buscador";

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
  const [filteredProgramas, setFilteredProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
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
    const loadPrograms = async () => {
      try {
        const tipo = await AsyncStorage.getItem("tipoDocumento");
        const doc = await AsyncStorage.getItem("documento");
        if (!tipo || !doc) throw new Error("Datos incompletos");
        const data = await fetchProgramas(tipo, doc);
        console.log("Programas obtenidos:", data);
        setProgramas(data);
        setFilteredProgramas(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

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

  if (loading) return <LoadingScreen />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/backgrounds/Inicio.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Header transparente */}
        <CustomHeader
          title="Programas"
          showBack
          transparent
          showProfileIcon
          onLogout={() => setModalVisible(true)}
        />

        <View style={styles.container}>
          {/* Buscador */}
          <Buscador
            value={searchQuery}
            onChange={(text) => {
              setSearchQuery(text);
              const lowerText = text.toLowerCase();
              const filtered = programas.filter((programa) =>
                [programa.programa, programa.medico, programa.especialidad]
                  .join(" ")
                  .toLowerCase()
                  .includes(lowerText)
              );
              setFilteredProgramas(filtered);
            }}
            placeholder="Buscar programas"
          />
          {/* Lista de Programas */}
          {filteredProgramas.length === 0 ? (
            <EmptyState message="No se encontraron programas de momento" />
          ) : (
            <FlatList
              data={filteredProgramas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const sinCitas =
                  item.fecha_cita === null || item.medico === null;
                if (sinCitas) {
                  return (
                    <View style={styles.card}>
                      <View style={styles.cardContent}>
                        {/* Columna izquierda: Fecha */}
                        <View style={styles.leftColumn}>
                          <Text
                            style={[styles.dateMonth, { textAlign: "center" }]}
                          >
                            Sin cita{"\n"}próxima
                          </Text>
                        </View>

                        {/* Columna derecha: Detalles */}
                        <View style={styles.rightColumn}>
                          <Text style={styles.text}>
                            <Text style={styles.label}>Programa: </Text>
                            {item.programa}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }
                return (
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      {/* Columna izquierda: Fecha */}
                      <View style={styles.leftColumn}>
                        {item.fecha_cita &&
                        !isNaN(new Date(item.fecha_cita).getTime()) ? (
                          <>
                            <Text style={styles.dateDay}>
                              {new Date(item.fecha_cita).getDate()}
                            </Text>
                            <Text style={styles.dateMonth}>
                              {new Date(item.fecha_cita).toLocaleDateString(
                                "es-CO",
                                {
                                  month: "long",
                                }
                              )}
                            </Text>
                            <Text style={styles.dateYear}>
                              {new Date(item.fecha_cita).getFullYear()}
                            </Text>
                          </>
                        ) : (
                          <Text
                            style={[styles.dateMonth, { textAlign: "center" }]}
                          >
                            Sin cita{"\n"}próxima
                          </Text>
                        )}
                      </View>

                      {/* Columna derecha: Detalles */}
                      <View style={styles.rightColumn}>
                        <Text style={styles.text}>
                          <Text style={styles.label}>Programa: </Text>
                          {item.programa}
                        </Text>
                        <Text style={styles.text}>
                          <Text style={styles.label}>Médico: </Text>
                          {capitalizeName(item.medico)}
                        </Text>
                        <Text style={styles.text}>
                          <Text style={styles.label}>Especialidad: </Text>
                          {capitalizeName(item.especialidad)}
                        </Text>
                        {item.hora && item.hora.trim() !== "" && (
                          <Text style={styles.text}>
                            <Text style={styles.label}>Hora: </Text>
                            {item.hora}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
          {/* Modal de Cerrar Sesión */}
          <LogOutModal
            text="¿Estás seguro de que deseas cerrar sesión?"
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardContent: {
    height: 200,
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
});

export default ProgramsScreen;
