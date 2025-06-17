import axios from 'axios';

const API_URL = 'https://backend.bienestarips.com/api'; 

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

export type PacienteRegistroBack = {
  _id: string;
  documentType: string;
  document: number;
  mail: string;
  password: string;
  eps: string;
  fechaNacimiento: string;
  createdAt: string;
  updatedAt: string;
};


export const getPatientByDocument = async ( documento: string): Promise<PacienteBackend | null> => {
    const response = await axios.get<PacienteBackend>(`${API_URL}/paciente/${documento}`);
    return response.data;
  
  };


export const checkPatient = async (documentType: string, document: number): Promise<PacienteRegistroBack | null> => {
    const response = await axios.get<PacienteRegistroBack>(`${API_URL}/patient/${documentType}/${document}`);
    return response.data;
};

export const checkPatientByMail = async (mail: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/patient/mail`, {
      mail: mail,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getPatientAPP = async (documentType: string, document: number): Promise<PacienteRegistroBack | null> => {
  try {
    const response = await axios.get<PacienteRegistroBack>(`${API_URL}/patient/data/${documentType}/${document}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

interface PatientResponse {
  documento: string;
}

export const checkPatientExists = async (documento: string): Promise<boolean> => {
    const response = await axios.get<PatientResponse>(`${API_URL}/paciente/${documento}`);
    return !!response.data && response.data.documento === documento;
};