const API_URL = 'http://18.207.0.161:3001/api';

export const fetchPrograms = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_URL}/programas/${tipoDocumento}/${numeroDocumento}`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener programas:", error);
    throw error;
  }
};