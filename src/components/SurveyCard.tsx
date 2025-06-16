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
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getSurveyResultsByDocument } from "../services/surveyResultService";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            borderRadius: moderateScale(30),
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
            <Text style={styles.modalText}>{recomendacion}</Text>
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

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const ASPECT_RATIO = 340 / 280;
const CARD_HEIGHT = CARD_WIDTH / ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: "hidden",
    marginBottom: verticalScale(10),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",

  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(25),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(245, 240, 240, 0.36)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: scale(20),
    borderRadius: moderateScale(15),
    width: "75%",
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.55,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: fonts.title,
    color: colors.preto,
    marginVertical: verticalScale(10),
    textAlign: "center",
  },
  recomendacionTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  modalText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.body,
    color: colors.preto,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  modalButton: {
    width: "100%",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(50),
    backgroundColor: colors.secondary,
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  modalButtonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: moderateScale(17),
  },
});

export default SurveyCard;
