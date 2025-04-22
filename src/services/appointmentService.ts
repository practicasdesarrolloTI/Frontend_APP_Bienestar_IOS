const API_URL = 'http://10.0.2.2:8000/api';

export const fetchAppointments = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_URL}/citas/${tipoDocumento}/${numeroDocumento}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener citas:", error);
    throw error;
  }
};