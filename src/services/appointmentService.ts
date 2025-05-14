const API_URL = 'http://18.207.0.161:3001/api';

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