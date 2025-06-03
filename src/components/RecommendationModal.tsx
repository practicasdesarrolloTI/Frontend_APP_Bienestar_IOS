import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  visible: boolean;
  recomendacion: string;
  onClose: () => void;
  onConfirm: () => void;
};

const RecommendationModal: React.FC<Props> = ({
  visible,
  recomendacion,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Recomendación!</Text>
          <Text style={styles.text}>{recomendacion}</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(245, 240, 240, 0.36)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.title,
    color: colors.preto,
    marginTop: 10,
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.preto,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  confirmButton: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: 18,
  },
});

export default RecommendationModal;
