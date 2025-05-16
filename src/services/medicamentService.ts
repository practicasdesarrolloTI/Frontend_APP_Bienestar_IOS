import { Presentation } from "lucide-react-native";

// const API_URL = 'http://18.207.0.161:3001/api';
const API_URL = 'https://backend.bienestarips.com/api';

// export const fetchMedicaments = async (tipoDocumento: string, numeroDocumento: string) => {
//   try {
//     const response = await fetch(`${API_URL}/medicamentos/${tipoDocumento}/${numeroDocumento}`);
//     const rawData = await response.json();

//     if (!Array.isArray(rawData)) {
//       if (rawData.message) return [];
//       throw new Error('La respuesta no es un arreglo');
//     }

//     return rawData.map((item: any, index: number) => ({
//       id: index.toString(),
//       nombre: `${item.nombre_medicamento}`,
//       fechaOrden: item.fecha_vigencia?.split(' ')[0] ?? '',
//       medico: item.medico ?? 'Sin médico',
//       estado: item.estado ?? 'Pendiente',
//       presentacion: item.prescripcion_medicamento,
//       cantidad: item.Cantidad,
//     }));
//   } catch (error) {
//     console.error('Error al obtener medicamentos:', error);
//     throw error;
//   }
// };

export const fetchMedicamentsVigentes = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_URL}/medicamentos-vigentes/${tipoDocumento}/${numeroDocumento}`);

    if (!response.ok) throw new Error('Error al obtener medicamentos');

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('❌ Error en fetchMedicamentsVigentes:', error);
    throw error;
  }
};

export async function fetchMedicamentos(tipo: string, documento: string) {
  try {
    const response = await fetch(`${API_URL}/medicamentos/externos/${tipo}/${documento}`);
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta no es JSON');
    }

    const rawData = JSON.parse(text);

    if (Array.isArray(rawData)) {
      return rawData.map((item: any, index: number) => ({
        id: index.toString(),
        nombre: item.nombre_medicamento,
        cantidad: item.cantidad,
        dosificacion: item.dosificacion || "No especificada",
        presentacion: item.prescripcion_medicamento,
        fechaVencimiento: item.fecha_vencimiento?.split('T')[0] || "No disponible",

      }));
    }

    // 🟡 Caso especial: backend devolvió un mensaje
    if (rawData.message) {
      console.warn("⚠️ El backend respondió con un mensaje:", rawData.message);
      return []; // ← no hay exámenes, devolvemos lista vacía
    }

    throw new Error('La respuesta no fue ni un arreglo ni un mensaje esperado');

  } catch (error) {
    // console.error("Error al obtener resultados:", error);
    throw error;
  }
}