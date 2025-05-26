const API_URL = "https://backend.bienestarips.com/api/surveys";

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

export async function fetchAutocuidado(tipo: string, documento: string) {
  const res = await fetch(`https://backend.bienestarips.com/api/autocuidado/externos/${tipo}/${documento}`);

  if (!res.ok) throw new Error("Error al obtener indicadores de autocuidado");

  const data = await res.json();

  return {
    Colesterol_Total: data.colesterol ?? null,
    HDL: data.hdl ?? null,
    Peso: data.peso ?? null,
    Altura: data.talla ?? null,
    Tension_Arterial_Sistolica: data.tension_arterial_sistolica ?? null,
    Tension_Arterial_Diastolica: data.tension_arterial_diastolica ?? null,
    Perimetro_Abdominal: data.perimetro_abdominal ?? null,
  };
}
