import React, { useState, useEffect } from 'react';
import { StyleSheet,View, Text, Modal, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { Survey } from '../screens/SurveyScreen';
import colors from "../themes/colors";


type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (survey: Survey) => void;
  editingSurvey: Survey | null;
};

const SurveyForm: React.FC<Props> = ({ visible, onClose, onSubmit, editingSurvey }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preguntas, setPreguntas] = useState<string[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');

  // 🛠️ Limpiar formulario al abrir una nueva encuesta
  useEffect(() => {
    if (visible) {
      if (editingSurvey) {
        setNombre(editingSurvey.nombre);
        setDescripcion(editingSurvey.descripcion);
        setPreguntas([...editingSurvey.preguntas]); 
      } else {
        setNombre('');
        setDescripcion('');
        setPreguntas([]); 
      }
    }
  }, [visible, editingSurvey]);

  // 📌 Agregar pregunta sin borrar las anteriores
  const agregarPregunta = () => {
    if (nuevaPregunta.trim()) {
      setPreguntas((prevPreguntas) => [...prevPreguntas, nuevaPregunta]); 
      setNuevaPregunta(''); 
    }
  };

  // 🚨 Validar antes de guardar
  const handleSaveSurvey = () => {
    if (!nombre.trim() || !descripcion.trim() || preguntas.length === 0) {
      Alert.alert('Error', 'Todos los campos son obligatorios y debes agregar al menos una pregunta.');
      return;
    }

    const updatedSurvey: Survey = {
        id: editingSurvey ? editingSurvey.id : `custom-${Date.now()}`, // Solo encuestas creadas pueden editarse
        nombre,
        descripcion,
        preguntas,
      };

    // onSubmit({ id: editingSurvey ? editingSurvey.id : '', nombre, descripcion, preguntas });
    onSubmit(updatedSurvey);
    onClose();
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingSurvey ? "Editar Encuesta" : "Crear Encuesta"}</Text>

          <TextInput style={styles.input} placeholder="Nombre de la encuesta" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />

          <TextInput
            style={styles.input}
            placeholder="Nueva pregunta"
            value={nuevaPregunta}
            onChangeText={setNuevaPregunta}
            onSubmitEditing={agregarPregunta} 
          />
          <TouchableOpacity style={styles.addQuestionButton} onPress={agregarPregunta}>
            <Text style={styles.addQuestionText}>+ Agregar Pregunta</Text>
          </TouchableOpacity>

          <FlatList
            data={preguntas}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.questionText}>• {item}</Text>}
          />

          {/* 📌 Botón para cerrar sin guardar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>

          {/* 📌 Botón para guardar (solo si los campos están llenos) */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSaveSurvey}>
            <Text style={styles.submitButtonText}>{editingSurvey ? "Guardar Cambios" : "Guardar Encuesta"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SurveyForm;
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
    borderWidth: 2,
    borderColor: colors.preto,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  
});