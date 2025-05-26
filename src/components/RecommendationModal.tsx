import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
    borderRadius: 16,
    width: "85%",
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.preto,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.preto,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  confirmButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: 16,
  },
});

export default RecommendationModal;
