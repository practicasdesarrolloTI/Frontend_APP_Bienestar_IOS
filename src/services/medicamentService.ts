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

import axios from 'axios';

const AUTH_URL = 'https://training.aacustomers.com/aa_panacap/pana/rest/auth_server.php';
const MEDICAMENTOS_URL = 'https://training.aacustomers.com/aa_panacap/pana/rest/router.php/ordenes/consmed';

// Credenciales proporcionadas
const CLIENT_ID = 'rest901';
const SECRET = 'rest901';
const CUSTOM_ID = '901';

// 1. Función para obtener el token
interface AuthResponse {
  token: string;
}

const getAuthToken = async (): Promise<string> => {
  const res = await axios.post<AuthResponse>(
    AUTH_URL,
    {},
    {
      headers: {
        'X-Client-Id': CLIENT_ID,
        'X-Secret': SECRET,
        'X-Custom-Id': CUSTOM_ID,
      },
    }
  );
  return res.data.token;
};

// 2. Función para consultar orden de medicamentos
export const getOrdenMedicamentos = async (tipo_doc: string, identi_usr: string) => {
  const token = await getAuthToken();

  const res = await axios.post(
    MEDICAMENTOS_URL,
    {
      tipo_doc,
      identi_usr,
    },
    {
      headers: {
        'X-TOKEN': token,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
};
