import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

type Props = {
  visible: boolean;
  recomendacion: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const RecommendationModal: React.FC<Props> = ({
  visible,
  recomendacion,
  loading,

  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Recomendación!</Text>
          <Text style={styles.text}>{recomendacion}</Text>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              loading && styles.confirmButtonDisabled,
            ]}
            onPress={onConfirm}
            disabled={loading} 
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Aceptar</Text>
            )}
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
    fontSize: moderateScale(24),
    fontFamily: fonts.title,
    color: colors.preto,
    marginTop: 10,
    marginBottom: 12,
  },
  text: {
    fontSize: moderateScale(15),
    fontFamily: fonts.body,
    color: colors.preto,
    textAlign: "center",

    marginBottom: 30,
  },
  confirmButton: {
    width: "100%",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(14),
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.title,
    fontSize: moderateScale(18),
  },
});

export default RecommendationModal;
