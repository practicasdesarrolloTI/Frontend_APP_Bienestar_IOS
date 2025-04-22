import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  visible: boolean;
  maskedEmail: string;
  onClose: () => void;
};

const PasswordRecoveryModal: React.FC<Props> = ({ visible, maskedEmail, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Correo enviado!</Text>
          <Text style={styles.message}>
            Hemos enviado un enlace de recuperación a tu correo electrónico:
          </Text>
          <Text style={styles.email}>{maskedEmail}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
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
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.body,
    textAlign: "center",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontFamily: fonts.subtitle,
    color: colors.secondary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.white,
  },
});

export default PasswordRecoveryModal;
