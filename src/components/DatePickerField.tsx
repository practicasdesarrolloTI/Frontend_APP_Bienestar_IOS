import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type Props = {
  label?: string;
  date: string | null;
  onSelect: (value: string) => void;
};

const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DatePickerField: React.FC<Props> = ({ label = "F. de nacimiento", date, onSelect }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    const formattedDate = formatDateToString(selectedDate);
    onSelect(formattedDate);
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={showDatePicker}
      >
        <Text style={[styles.selectedText, !date && styles.placeholder]}>
          {date ? date : label}
        </Text>
        <MaterialIcons name="calendar-today" size={moderateScale(12)} color={colors.preto} style={styles.icon} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
    height: verticalScale(38),
    width: scale(147),
  },
  selectedText: {
    fontSize: moderateScale(11),
    color: colors.preto,
    fontFamily: fonts.body,
  },
  placeholder: {
    color: colors.lightGray,
  },
  icon: {
    marginLeft: scale(2),
  },
});

export default DatePickerField;
