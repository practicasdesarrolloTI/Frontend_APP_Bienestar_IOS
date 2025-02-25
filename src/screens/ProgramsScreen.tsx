import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../themes/colors"; 

type Programa = {
  id: string;
  fechaInscripcion: string;
  nombrePrograma: string;
  medico: string;
  fechaProximaCita: string;
  estado: string;
};

const ProgramsScreen = ({ navigation }: any) => {
  const [programas, setProgramas] = useState<Programa[]>([
    { id: "1", fechaInscripcion: "02/02/2020", nombrePrograma: "Ruta Riesgo Cardiovascular", medico: "Juan Pablo Vargas", fechaProximaCita: "05/07/2025", estado: "Pendiente" },
    { id: "2", fechaInscripcion: "15/03/2023", nombrePrograma: "Ruta de P Y M Vejez", medico: "María Camila Gómez", fechaProximaCita: "05/08/2025", estado: "Pendiente" }
  ]);

  return (
    <View style={styles.container}>
      {/* Botón para regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={"white"} />
        </TouchableOpacity>
      </View>

      {/* Lista de Programas */}
      <FlatList
        data={programas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <MaterialIcons name="calendar-today" size={16} /> Fecha de inscripción: {item.fechaInscripcion}
            </Text>
            <Text style={styles.text}>
              <MaterialIcons name="assignment" size={16} /> Programa: {item.nombrePrograma}
            </Text>
            <Text style={styles.text}>
              <FontAwesome5 name="user-md" size={16} /> Médico de cabecera: {item.medico}
            </Text>
            <Text style={styles.text}>
              <MaterialIcons name="event" size={16} /> Fecha próxima cita: {item.fechaProximaCita}
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
    backgroundColor: colors.background,
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
  card: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
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

export default ProgramsScreen;
