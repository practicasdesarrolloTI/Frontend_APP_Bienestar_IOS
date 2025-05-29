import React, { useState } from "react";
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
import { getSurveyResultsByDocument } from "../services/surveyResultService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonLoading from "./SkeletonLoading";
dayjs.extend(duration);

type Props = {
  survey: {
    id: string;
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
  onPress: () => void;
};

type Recomendacion = {
  surveyId: string;
  recomendacion: string;
};

const SurveyCard: React.FC<Props> = ({ survey, tiempoRestante, onPress }) => {
  const [showModal, setShowModal] = useState(false);
  const [recomendacion, setRecomendacion] = useState<string | null>(null);


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

    return partes.join(", ");
  };

  const handlePress = async () => {
    if (survey.bloqueada) {
      const document = await AsyncStorage.getItem("documento");
      if (document) {
        try {
          const data = (await getSurveyResultsByDocument(
            document
          )) as Recomendacion[];
          const result = data.find((res: any) => res.surveyId === survey.id);
          setRecomendacion(
            result?.recomendacion || "No hay recomendación disponible."
          );
        } catch (error) {
          setRecomendacion("Error al cargar la recomendación.");
        }
      }
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
          survey.bloqueada && {
            borderRadius: 30,
            backgroundColor: colors.lightGray,
            opacity: 0.5,
          },
        ]}
        
        activeOpacity={survey.bloqueada ? 1 : 0.7}
      >
        <Image source={survey.image} resizeMode="cover" style={styles.image} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Encuesta completada</Text>
            <Text style={styles.recomendacionTitle}>Último resultado:</Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalText}>{recomendacion}</Text>
            </Text>
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
console.log("Screen dimensions:", screenWidth, screenHeight);
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
    backgroundColor: "rgba(245, 240, 240, 0.36)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 10,
    width: "80%",
    shadowColor: colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.preto,
    marginVertical: 20,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  recomendacionTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.preto,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  modalButton: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.secondary,
    marginTop: 20,
  },
  modalButtonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: 18,
  },
});

export default SurveyCard;
