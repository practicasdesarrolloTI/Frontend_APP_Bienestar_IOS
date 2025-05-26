const API_URL = "https://backend.bienestarips.com/api";


export async function fetchProgramas(tipo: string, documento: string) {
  const res = await fetch(`${API_URL}/programas/externos/${tipo}/${documento}`);
  if (!res.ok) throw new Error("Error al obtener programas");
  const data = await res.json();
  const resformateados = data.map((item: any, index: number) => ({
    id: index.toString(),
    fecha_cita: item.fecha_cita?.slice(0,10) ?? "No tienes citas agendadas",
    hora: item.turno?.slice(0, 8) ?? " ",
    programa: item.Programa ?? null,
    medico: item.nombre_medico ?? null,
    especialidad: item.especialidad ?? "",
    estado: item.estado_cita ?? "Pendiente",
    
  }));
  // console.log("Programas formateados:", resformateados);

  return resformateados;
}
