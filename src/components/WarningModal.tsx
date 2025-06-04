import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { scale, verticalScale, moderateScale, s } from "react-native-size-matters";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  text: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const WarningModal: React.FC<Props> = ({
  text,
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require("../../assets/icons/warning.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.modalTitle}> {text}</Text>
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
    backgroundColor: "rgba(245, 240, 240, 0.36)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: scale(20),
    borderRadius: moderateScale(15),
    width: "75%",
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
  icon: {
    width: moderateScale(35),
    height: moderateScale(35),
    tintColor: colors.primary,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: fonts.title,
    color: colors.preto,
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    textAlign: "center",
  },
  modalButtons: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: scale(12),
    flex: 1,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.secondary,
    marginRight: scale(10),
  },
  confirmButton: {
    paddingVertical: scale(12), 
    flex: 1,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  cancelText: {
    fontSize: scale(17),
    color: "white",
    fontFamily: fonts.title,
  },
  confirmText: {
    fontSize: scale(17),  
    color: colors.white,
    fontFamily: fonts.title,
  },
});

export default WarningModal;
