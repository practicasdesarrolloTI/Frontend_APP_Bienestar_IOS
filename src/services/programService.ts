const API_URL = 'http://10.0.2.2:8000/api';

export const fetchPrograms = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_URL}/programas/${tipoDocumento}/${numeroDocumento}`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener programas:", error);
    throw error;
  }
};