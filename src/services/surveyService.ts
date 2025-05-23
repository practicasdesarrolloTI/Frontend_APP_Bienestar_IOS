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
  const res = await fetch(`${API_URL}/autocuidado/externos/${tipo}/${documento}`);

  if (!res.ok) throw new Error("Error al obtener indicadores de autocuidado");

  const data = await res.json();

  return {
    colesterol: data.colesterol ?? null,
    hdl: data.hdl ?? null,
    peso: data.peso ?? null,
    talla: data.talla ?? null,
    tension_arterial_sistolica: data.tension_arterial_sistolica ?? null,
    tension_arterial_diastolica: data.tension_arterial_diastolica ?? null,
    perimetro_abdominal: data.perimetro_abdominal ?? null,
    programa_actual: data.programa_actual ?? null,
    nombre_medico: data.nombre_medico ?? "No disponible por el momento",
    nombre_especialidad: data.nombre_especialidad ?? "No disponible por el momento",
  };
}
