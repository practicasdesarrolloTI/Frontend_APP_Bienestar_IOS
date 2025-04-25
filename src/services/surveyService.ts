const API_URL = "http://10.0.2.2:5001/api/surveys";

export const submitSurvey = async (surveyId: string, responses: string[]) => {
  try {
    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyId, responses }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al enviar la encuesta");

    return data;
  } catch (error: any) {
    return { error: error.message };
  }
};

const API_URL2 = 'http://10.0.2.2:8000/api';

export const getPatientIndicators = async (tipoDocumento: string, documento: string) => {
  try {
    const response = await fetch(`${API_URL2}/pacientes/indicadores/${tipoDocumento}/${documento}`);
    const data = await response.json();
    return data[0]; // viene como array con un solo objeto
  } catch (error) {
    console.error('Error al obtener indicadores del paciente:', error);
    return null;
  }
};