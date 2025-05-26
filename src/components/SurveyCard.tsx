import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from "react-native";
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
    image?: any;
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

const SurveyCard: React.FC<Props> = ({
  survey,
  tiempoRestante,
  cargando,
  onPress,
}) => {
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.card,
          survey.bloqueada && { borderRadius: 30, backgroundColor: colors.lightGray, opacity: 0.5 },
        ]}
        activeOpacity={survey.bloqueada ? 1 : 0.7}
      >
        {cargando ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Image
            source={survey.image}
            resizeMode="cover"
            style={styles.image}
          />
        )}
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Encuesta completada</Text>
            <Text style={styles.modalText}>
              Podrás volver a realizarla en {getTiempoDisponibleEn()}.
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
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.26,
    overflow: "hidden",
    marginBottom: 10,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
