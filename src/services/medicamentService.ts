const API_URL = 'http://10.0.2.2:8000/api';

export const fetchMedicaments = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_URL}/medicamentos/${tipoDocumento}/${numeroDocumento}`);
    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      if (rawData.message) return [];
      throw new Error('La respuesta no es un arreglo');
    }

    return rawData.map((item: any, index: number) => ({
      id: index.toString(),
      nombre: `${item.nombre_medicamento} - ${item.prescripcion_medicamento}`,
      fechaOrden: item.fecha_vigencia?.split(' ')[0] ?? '',
      medico: item.medico ?? 'Sin médico',
      estado: item.estado ?? 'Pendiente'
    }));
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    throw error;
  }
};