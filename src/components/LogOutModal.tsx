import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";


type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const LogOutModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {

  /** Función para cerrar sesión */
 return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>¿Está seguro que quiere cerrar la sesión?</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Sí</Text>
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
    backgroundColor: "rgba(245, 240, 240, 0.36)", // Fondo oscuro semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 10,
    width: "70%",
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
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: colors.preto,
    marginVertical: 20,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 15,
    flex: 1,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.secondary,
    marginRight: 10,
  },
  confirmButton: {
    paddingVertical: 15,
    flex: 1,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelText: {
    fontSize: 18,
    color: "white",
    fontFamily: fonts.title,
  },
  confirmText: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.title,
  },
});

export default LogOutModal;