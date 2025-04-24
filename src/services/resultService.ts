const API_URL = 'http://10.0.2.2:8000/api';

export const fetchResults = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const url = `${API_URL}/examenes/${tipoDocumento}/${numeroDocumento}`;
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta no es JSON');
    }

    const rawData = JSON.parse(text);

    if (Array.isArray(rawData)) {
      return rawData.map((item: any, index: number) => ({
        id: index.toString(),
        fechaRealizacion: item.fecha_orden?.split(" ")[0] || "",
        examen: item.Examen ?? '',
        programa: item.nom_medico_remisor ?? '',
        estado: 'Disponible',
      }));
    }

    // 🟡 Caso especial: backend devolvió un mensaje
    if (rawData.message) {
      console.warn("⚠️ El backend respondió con un mensaje:", rawData.message);
      return []; // ← no hay exámenes, devolvemos lista vacía
    }

    throw new Error('La respuesta no fue ni un arreglo ni un mensaje esperado');

  } catch (error) {
    console.error("Error al obtener resultados:", error);
    throw error;
  }
};