
const API_URL = 'https://backend.bienestarips.com/api';

export async function fetchCitas(tipo: string, documento: string) {
  const res = await fetch(`${API_URL}/citas/externas/${tipo}/${documento}`);
 
  if (!res.ok) throw new Error("Error al obtener citas");
  return res.json();
}