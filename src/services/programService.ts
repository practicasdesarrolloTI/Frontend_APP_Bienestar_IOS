const API_URL = 'https://backend.bienestarips.com/api';

type Programa = {
  id: string;
  fecha_cita: string;
  programa: string;
  hora: string;
  medico: string;
  especialidad: string;
  estado: string;
};

export async function fetchProgramas(tipo: string, documento: string) {
  const res = await fetch(`${API_URL}/programas/externos/${tipo}/${documento}`);
  if (!res.ok) throw new Error("Error al obtener programas");
  const data = await res.json();
  const resformateados = data.map((item: any, index: number) => ({
    id: index.toString(),
    fecha_cita: item.fecha_cita?.split(" ")[0] ?? "No tienes citas agendadas",
    hora: item.hora_cita?.slice(0, 8) ?? " ",
    programa: item.Programa ?? "si",
    medico: item.nombre_medico ?? "No Asignado",
    especialidad: item.Especialidad ?? "",
    estado: item.estado_cita ?? "Pendiente",
  }));

  return resformateados;
}