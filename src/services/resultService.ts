const API_URL = 'http://18.207.0.161:3001/api';

const convertirFechaADashFormat = (fecha: string) => {
  if (!fecha) return "";

  // Si ya está en formato YYYY-MM-DD, no la tocamos
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }

  // Si está en formato DD/MM/YYYY, la convertimos
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  // Si no coincide con ningún formato esperado
  return "";
};


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
        fechaRealizacion: convertirFechaADashFormat(item.fecha_orden)?.split(" ")[0] || "",
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