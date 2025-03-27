import axios from 'axios';

const API_URL = 'http://10.0.2.2:3001/api/paciente'; // Ajusta si es IP o dominio en producción

export type PacienteBackend = {
  tipo_documento: string;
  documento: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento: string;
  sexo: string;
  celular: string;
  telefono: string;
  correo: string;
  codigo_ips: number;
  eps: string;
};


export const getPatientByDocument = async (documento: string): Promise<PacienteBackend | null> => {
  try {
    const response = await axios.get<PacienteBackend>(`${API_URL}/${documento}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// export const getPatientByDocument = async (document: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/${document}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener información del paciente:", error);
//     throw error;
//   }
// };



interface PatientResponse {
  documento: string;
}

export const checkPatientExists = async (documento: string): Promise<boolean> => {
  try {
    const response = await axios.get<PatientResponse>(`${API_URL}/${documento}`);
    return !!response.data && response.data.documento === documento;
  } catch (error) {
    return false;
  }
};