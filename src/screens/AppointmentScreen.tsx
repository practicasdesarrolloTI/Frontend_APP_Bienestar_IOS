import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../themes/colors"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchAppointments } from "../services/appointmentService";

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

const AppointmentScreen: React.FC<Props> =({ navigation} ) => {
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAppointments();
      setCitas(data);
    };
    loadData();
  }, []);
  return (
    <View style={styles.container}>
      {/* Botón para regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={"white"} />
        </TouchableOpacity>
      </View>
<Text style={styles.title}>Tus Citas</Text>
      {/* Lista de Citas */}
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <MaterialIcons name="date-range" size={16} /> {item.fecha} -- <FontAwesome5 name="clock" size={16} /> {item.hora}
            </Text>
            <Text style={styles.text}>
              <FontAwesome5 name="user-md" size={16} /> {item.medico}
            </Text>
            <Text style={styles.text}>
              <MaterialIcons name="medical-services" size={16} /> {item.especialidad}
            </Text>
            <Text style={[styles.status, item.estado === "Pendiente" ? styles.pending : styles.completed]}>
              {item.estado}
            </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
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
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
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
    color: "#fff",
  },
  completed: {
    backgroundColor: colors.primary,
    color: "#fff",
  },
});

export default AppointmentScreen;
