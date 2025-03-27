import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Survey } from "../screens/SelfCareScreen";
import colors from "../themes/colors";

type Props = {
  survey: Survey;
  onPress: () => void;
};

const SurveyCard: React.FC<Props> = ({ survey, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        <FontAwesome5 name="clipboard-list" size={16} /> {survey.nombre}
      </Text>
      <Text style={styles.description}>{survey.descripcion}</Text>
      <TouchableOpacity style={styles.startButton} onPress={onPress}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 15,
    marginTop: 30,
    marginBottom: 40,
  },
  backButton: {
    top: 30,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  imageSize: {
    marginTop: 20,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    alignSelf: "center",
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // 📌 Estilos del Modal (SurveyModal y SurveyForm)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
  },
  modalContent: {
    width: "85%",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: colors.primary,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // 📌 Botón para agregar preguntas dinámicamente
  addQuestionButton: {
    backgroundColor: colors.preto,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  addQuestionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  // 📌 Botón de Guardar/Editar Encuesta
  submitButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: colors.preto,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});

export default SurveyCard;
