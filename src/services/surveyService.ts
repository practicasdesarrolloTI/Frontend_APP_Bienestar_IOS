const API_URL = "http://TU_IP:5000/api/surveys"; // Cambia TU_IP por la IP de tu backend

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