import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS" | "NIT" | "CD" | "SC" | "MSI" | "ASI" | "PEP" | "PTP";

type Props = {
  selected: DocumentType | null;
  onSelect: (value: DocumentType) => void;
};

const documentOptions = [
  { label: "Registro Civil", value: "RC" },
  { label: "Tarjeta de Identidad", value: "TI" },
  { label: "Cédula de Ciudadanía", value: "CC" },
  { label: "Cédula de Extranjería", value: "CE" },
  { label: "Pasaporte", value: "PAS" },
  { label: "NIT", value: "NIT" },
  { label: "Cédula Diplomática", value: "CD" },
  { label: "Salvoconducto", value: "SC" },
  { label: "Menores Sin Identificación", value: "MSI" },
  { label: "Adulto Sin Identificación", value: "ASI" },
  { label: "Permiso Especial de Permanencia", value: "PEP" },
  { label: "Permiso Temporal de Permanencia", value: "PTP" },
];

const DocumentPicker: React.FC<Props> = ({ selected, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: DocumentType) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectedText, !selected && styles.placeholder]}>
          {selected
            ? documentOptions.find((opt) => opt.value === selected)?.label
            : "Seleccione el tipo de documento"}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.preto} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={documentOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value as DocumentType)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingHorizontal: scale(15),
    height: verticalScale(45),
    width: scale(300),
    marginBottom: verticalScale(10),
  },
  selectedText: {
    fontSize: moderateScale(15),
    color: colors.preto,
    fontFamily: fonts.body,
  },
  placeholder: {
    color: colors.lightGray,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: colors.white,
    width: scale(300),
    borderRadius: scale(8),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    elevation: 5,
  },
  option: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
  },
  optionText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.body,
    color: colors.preto,
  },
});

export default DocumentPicker;
