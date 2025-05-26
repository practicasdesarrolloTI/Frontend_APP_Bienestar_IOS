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
import { fetchMedicamentos } from "../services/medicamentService";
import { fonts } from "../themes/fonts";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyState from "../components/EmptyState";
import Toast from "react-native-toast-message";
import CustomDateRangeFilter from "../components/CustomDateRangeFilter";
import CustomHeader from "../components/CustomHeader";
import LogOutModal from "../components/LogOutModal";
import Buscador from "../components/Buscador";

type Props = NativeStackScreenProps<RootStackParamList, "Medicamentos">;

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
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [filteredMedicamentos, setFilteredMedicamentos] = useState<Medicamento[]>([]);

  /** Función para cerrar sesión */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("documento");
    Toast.show({
      type: "success",
      text1: "Sesión cerrada",
      text2: "Has cerrado sesión correctamente.",
      position: "bottom",
    });
    navigation.navigate("Login");
  };

  const loadData = async () => {
    try {
      const tipo = await AsyncStorage.getItem("tipoDocumento");
      const doc = await AsyncStorage.getItem("documento");
      if (!tipo || !doc) throw new Error("Faltan datos del paciente");

      const data = await fetchMedicamentos(tipo, doc);
      setMedicamentos(data);
    } catch (error) {
      return;
    }
    finally {
      setLoading(false);
    }
  };

  
  
  useEffect(() => {
    loadData()
  }, []);

  /* Función para formatear el nombre del medicamento */
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
          <Buscador
            value={searchQuery}
            onChange={(text) => {
              setSearchQuery(text);
              const lowerText = text.toLowerCase();
              const filtered = medicamentos.filter((resultado) =>
                [resultado.nombre]
                  .join(" ")
                  .toLowerCase()
                  .includes(lowerText)
              );
              setFilteredMedicamentos(filtered);
            }}
            placeholder="Buscar medicamentos"
          />

          <FlatList
            data={filteredMedicamentos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent:
                medicamentos.length === 0 ? "center" : "flex-start",
              paddingBottom: 100,
            }}
            ListEmptyComponent={
              <EmptyState message="No se encontraron resultados de momento" />
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
                        Nombre:{" "}
                        <Text style={styles.text}>
                          {formatName(item.nombre)}
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.label}>Cantidad: </Text>{" "}
                      {item.cantidad}
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
    borderRadius: 12,
    marginBottom: 20,
  },
  cardContent: {
    height: 145,
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
    width: "26%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 11,
    color: "white",
    fontFamily: fonts.body,
    marginBottom: 2,
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

export default MedicamentScreen;
