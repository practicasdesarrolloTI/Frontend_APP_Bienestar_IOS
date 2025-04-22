import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  onClose,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Recomendación!</Text>
          <Text style={styles.text}>{recomendacion}</Text>

          <View>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: 10,
    fontFamily: fonts.title,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: fonts.subtitle,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: 16,
  },
});

export default RecommendationModal;
