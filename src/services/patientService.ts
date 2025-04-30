import axios from 'axios';

const API_URL = 'http://10.0.2.2:3001/api/paciente'; 
const API_URL2 = 'http://10.0.2.2:5001/api/patient'; 

export type PacienteBackend = {
  tipo_documento: string | number;
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
  tipo_documento_abreviado: string;
};

export type PacienteRegistro = {
  _id: string;
  documentType: string;
  document: number;
  email?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};


export const getPatientByDocument = async (documento: string): Promise<PacienteBackend | null> => {
  try {
    const response = await axios.get<PacienteBackend>(`${API_URL}/${documento}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const checkPatient = async (document: number): Promise<PacienteRegistro | null> => {
  try {
    const response = await axios.get<PacienteRegistro>(`${API_URL2}/${document}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getPatientAPP = async (document: number): Promise<PacienteRegistro | null> => {
  try {
    const response = await axios.get<PacienteRegistro>(`${API_URL2}/data/${document}`);
    return response.data;
  } catch (error) {
    return null;
  }
}



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