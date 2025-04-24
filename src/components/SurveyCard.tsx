import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ActivityIndicator } from "react-native-paper";

dayjs.extend(duration);

type Props = {
  survey: {
    nombre: string;
    descripcion: string;
    bloqueada?: boolean;
  };
  tiempoRestante?: {
    porcentajeCompletado: number;
    meses: number;
    dias: number;
    horas: number;
    minutos?: number;
    segundos: number;
  };
  cargando?: boolean;
  onPress: () => void;
};

const SurveyCard: React.FC<Props> = ({ survey, tiempoRestante, cargando, onPress }) => {
  const [showModal, setShowModal] = useState(false);

  const getTiempoDisponibleEn = () => {
    if (!tiempoRestante) return "";

    const partes = [];
    if (tiempoRestante.meses > 0)
      partes.push(
        `${tiempoRestante.meses} mes${tiempoRestante.meses === 1 ? "" : "es"}`
      );
    if (tiempoRestante.dias > 0)
      partes.push(
        `${tiempoRestante.dias} día${tiempoRestante.dias === 1 ? "" : "s"}`
      );
    if (tiempoRestante.horas > 0)
      partes.push(
        `${tiempoRestante.horas} hora${tiempoRestante.horas === 1 ? "" : "s"}`
      );
    if (tiempoRestante.minutos && tiempoRestante.minutos > 0)
      partes.push(`${tiempoRestante.minutos} min`);
    if (tiempoRestante.segundos > 0) {
      partes.push(
        `${tiempoRestante.segundos} segundo${
          tiempoRestante.segundos === 1 ? "" : "s"
        }`
      );
    }

    return partes.join(", ");
  };

  const handlePress = () => {
    if (survey.bloqueada) {
      setShowModal(true);
    } else {
      onPress();
    }
  };

  return (
    <>
      
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.card,
            survey.bloqueada && { backgroundColor: "#e0e0e0", opacity: 0.7 },
          ]}
          activeOpacity={survey.bloqueada ? 1 : 0.7}
        >
          {cargando ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{survey.nombre}</Text>
            <Text style={styles.description}>{survey.descripcion}</Text>
          </View>
           )}
          <MaterialIcons
            name="arrow-forward"
            size={24}
            color={colors.primary}
          />
    
        </TouchableOpacity>
      

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Encuesta completada</Text>
            <Text style={styles.modalText}>
              Podrás volver a realizarla en{" "}
              {getTiempoDisponibleEn()}.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: colors.preto,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 120,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    fontFamily: fonts.body,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    color: colors.primary,
    fontFamily: fonts.title,
  },
  startButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledText: {
    fontSize: 14,
    color: colors.preto,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: colors.preto,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SurveyCard;
