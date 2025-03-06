import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import SurveyCard from "../components/SurveyCard";
import SurveyModal from "../components/SurveyModal";
import SurveyForm from "../components/SurveyForm";
import colors from "../themes/colors";

export type Survey = {
  id: string;
  nombre: string;
  descripcion: string;
  preguntas: string[];
};

const SelfCareScreen = ({ navigation }: any) => {
  const [encuestas, setEncuestas] = useState<Survey[]>([
    {
      id: "1",
      nombre: "COULD IT BE COPD",
      descripcion: "Evalúa síntomas de EPOC",
      preguntas: ["¿Tiene tos frecuente?", "¿Siente falta de aire?"],
    },
    {
      id: "2",
      nombre: "Karnofsky Scale",
      descripcion: "Evalúa el estado funcional",
      preguntas: ["¿Puede realizar tareas sin ayuda?", "¿Se siente fatigado?"],
    },
  ]);

  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isSurveyModalVisible, setSurveyModalVisible] = useState(false);
  const [isSurveyFormVisible, setSurveyFormVisible] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  const handleOpenSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setSurveyModalVisible(true);
  };

  const handleAddSurvey = (newSurvey: Survey) => {
    if (editingSurvey) {
      setEncuestas(
        encuestas.map((s) => (s.id === editingSurvey.id ? newSurvey : s))
      );
    } else {
      setEncuestas([
        ...encuestas,
        { ...newSurvey, id: (encuestas.length + 1).toString() },
      ]);
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    if (survey.id.startsWith("custom-")) {
      // Solo encuestas creadas pueden editarse
      setEditingSurvey(survey);
      setSurveyFormVisible(true);
    }
  };

  const handleSurveyResponses = (surveyId: string, responses: string[]) => {
    console.log(`Respuestas enviadas para la encuesta ${surveyId}:`, responses);
    // 📌 Aquí puedes guardar las respuestas en Firebase si lo deseas
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Autocuidado</Text>
      <FlatList
        data={encuestas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onPress={() => handleOpenSurvey(item)}
            onEdit={() => handleEditSurvey(item)}
          />
        )}
      />
      {/* <TouchableOpacity style={styles.addButton} onPress={() => setSurveyFormVisible(true)}>
                <Text style={styles.addButtonText}>+ Crear Encuesta</Text>
            </TouchableOpacity> */}
      <SurveyModal
        visible={isSurveyModalVisible}
        survey={selectedSurvey}
        onClose={() => setSurveyModalVisible(false)}
        onSubmitResponses={handleSurveyResponses}
      />
      <SurveyForm
        visible={isSurveyFormVisible}
        onClose={() => {
          setSurveyFormVisible(false);
          setEditingSurvey(null);
        }}
        onSubmit={handleAddSurvey}
        editingSurvey={editingSurvey}
      />
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

  // Estilos del Modal (SurveyModal y SurveyForm)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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

export default SelfCareScreen;
