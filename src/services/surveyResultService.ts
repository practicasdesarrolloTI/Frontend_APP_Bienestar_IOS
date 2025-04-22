import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const API_URL = "http://10.20.15.236:5001/api/Surveyresults";

type SurveyResultResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export const submitSurveyResult = async ({
  surveyId,
  patientTypeId,
  patientId,
  patientName,
  surveyName,
  responses,
  puntaje,
  edad,
  sexo,
  recomendacion,
}: {
  surveyId: string;
  patientTypeId: string;
  patientId: string;
  patientName: string;
  surveyName: string;
  responses: string[];
  puntaje: number;
  edad: number;
  sexo: string;
  recomendacion: string;
}): Promise<SurveyResultResponse> => {
  try {
    const token = await AsyncStorage.getItem("token");

    type SurveyResultData = {
      message: string;
    };
    
    const res = await axios.post<SurveyResultData>(
      API_URL,
      {
        surveyId,
        patientTypeId,
        patientId,
        patientName,
        surveyName,
        responses,
        puntaje,
        edad,
        sexo,
        recomendacion,
      },
      {
        headers: {
          Authorization: token || "",
        },
      }
    );
    
    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "No se pudo enviar el resultado",
    };
  }
};

export const getSurveyResultsByDocument = async (documento: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${documento}`, {
    headers: {
      Authorization: token || '',
    },
  });
  return response.data;
};
