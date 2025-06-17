const API_URL = 'https://backend.bienestarips.com/api';


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
        dias_tratamiento: item.dias_tratamiento || "No especificado",
        indicaciones: item.nota || "",
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