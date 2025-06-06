const API_URL = "https://backend.bienestarips.com/maestros";
export const fetchEps = async () => {
  try {
    const response = await fetch(`${API_URL}/sedes/epsActive`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener EPS:", error);
    return [];
  }
};
