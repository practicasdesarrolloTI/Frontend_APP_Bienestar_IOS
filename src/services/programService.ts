// const API_URL = 'http://18.207.0.161:3001/api';

// export const fetchPrograms = async (tipoDocumento: string, numeroDocumento: string) => {
//   try {
//     const response = await fetch(`${API_URL}/programas/${tipoDocumento}/${numeroDocumento}`);
//     return await response.json();
//   } catch (error) {
//     console.error("Error al obtener programas:", error);
//     throw error;
//   }
// };

const API_URL = 'https://backend.bienestarips.com/api';

export async function fetchProgramas(tipo: string, documento: string) {
  const res = await fetch(`${API_URL}/programas/externos/${tipo}/${documento}`);
  if (!res.ok) throw new Error("Error al obtener programas");
  return res.json();
}