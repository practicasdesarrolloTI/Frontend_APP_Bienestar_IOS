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

type Props = {
  selected: string | null; // nombre de la EPS
  options: { label: string; value: string }[]; // viene del backend
  onSelect: (value: string) => void;
};

const normalizarTexto = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const EpsPicker: React.FC<Props> = ({ selected, options, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (label: string) => {
    const normalizedValue = normalizarTexto(label);
    onSelect(normalizedValue);
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
            ? options.find((opt) => normalizarTexto(opt.label) === selected)?.label
            : "Seleccione su EPS"}
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
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.label)}
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
    height: verticalScale(35),
    width: scale(150),
    marginBottom: verticalScale(10),
  },
  selectedText: {
    fontSize: moderateScale(13),
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

export default EpsPicker;
