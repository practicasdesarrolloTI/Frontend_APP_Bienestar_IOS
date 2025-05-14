import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type DocumentType = "RC" | "TI" | "CC" | "CE" | "PAS" | "";

type Props = {
  selected: DocumentType;
  onSelect: (value: DocumentType) => void;
};

const documentOptions = [
  { label: "Registro Civil", value: "RC" },
  { label: "Tarjeta de Identidad", value: "TI" },
  { label: "Cédula de Ciudadanía", value: "CC" },
  { label: "Cédula de Extranjería", value: "CE" },
  { label: "Pasaporte", value: "PAS" },
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
            : "Seleccione tipo de documento"}
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
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    width: "100%",
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 16,
    color: colors.preto,
    fontFamily: fonts.body,
  },
  placeholder: {
    color: colors.preto,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: colors.white,
    width: "85%",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.preto,
  },
});

export default DocumentPicker;
