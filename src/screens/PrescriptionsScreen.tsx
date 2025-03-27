import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../themes/colors";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchMedicaments } from "../services/medicamentService";

type Props = NativeStackScreenProps<RootStackParamList, "Medicamentos">;

type Medicamento = {
  id: string;
  nombre: string;
  fechaOrden: string;
  medico: string;
  estado: "Pendiente" | "Reformulado" | "Descargado";
};

const MedicamentScreen: React.FC<Props> =({ navigation} ) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    
    useEffect(() => {
        const loadData = async () => {
          const data = await fetchMedicaments();
          setMedicamentos(data);
        };
        loadData();
      }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Gestión de Medicamentos</Text>
      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <FontAwesome5 name="pills" size={16} /> {item.nombre}
            </Text>
            <Text style={styles.text}>
              <MaterialIcons name="event" size={16} /> {item.fechaOrden}
            </Text>
            <Text style={styles.text}>
              <FontAwesome5 name="user-md" size={16} /> {item.medico}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome5
                  name="file-download"
                  size={16}
                  color={colors.white}
                />
                <Text style={styles.buttonText}>Descargar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome5 name="redo" size={16} color={colors.white} />
                <Text style={styles.buttonText}>Renovar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome5
                  name="file-medical"
                  size={16}
                  color={colors.white}
                />
                <Text style={styles.buttonText}>Pedir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "flex-start",
    padding: 15,
    marginTop: 30,
    marginBottom: 40, 
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
  imageSize: {
    marginTop: 20,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.preto,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  downloaded: {
    backgroundColor: colors.green,
    color: colors.white,
  },
});
export default MedicamentScreen;
