const API_URL = 'http://10.0.2.2:8000/api';
const API_PANA = 'http://10.0.2.2:5001/api';

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
      nombre: `${item.nombre_medicamento}`,
      fechaOrden: item.fecha_vigencia?.split(' ')[0] ?? '',
      medico: item.medico ?? 'Sin médico',
      estado: item.estado ?? 'Pendiente',
      presentacion: item.prescripcion_medicamento,
      cantidad: item.Cantidad,
    }));
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    throw error;
  }
};

export const fetchMedicamentsVigentes = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const response = await fetch(`${API_PANA}/medicamentos-vigentes/${tipoDocumento}/${numeroDocumento}`);

    if (!response.ok) throw new Error('Error al obtener medicamentos');

    const data = await response.json();

    return data; // Es un array de órdenes, cada una con su lista de medicamentos
  } catch (error) {
    console.error('❌ Error en fetchMedicamentsVigentes:', error);
    throw error;
  }
};