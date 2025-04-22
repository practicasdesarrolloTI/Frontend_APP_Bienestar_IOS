import dayjs from 'dayjs';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const agruparMedicamentosPorFecha = (medicamentos: any[]) => {
  const ahora = dayjs();
  const tresMesesAtras = ahora.subtract(3, 'month');

  const recientes = medicamentos.filter((med) => {
    const fecha = dayjs(med.fechaOrden);
    return fecha.isAfter(tresMesesAtras);
  });

  const agrupados: Record<string, any[]> = {};
  recientes.forEach((med) => {
    const fecha = med.fechaOrden;
    if (!agrupados[fecha]) agrupados[fecha] = [];
    agrupados[fecha].push(med);
  });

  return agrupados;
};

export const generarPDFMedicamentos = async (paciente: any, medicamentos: any[], fecha: string) => {
  const contenidoHTML = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        .datos-paciente, .footer { margin-top: 20px; }
        .datos-paciente p { margin: 4px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 12px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; }
        .firma { margin-top: 60px; }
      </style>
    </head>
    <body>
      <h1>ORDEN DE MEDICAMENTOS</h1>
      <h2>Fecha: ${fecha}</h2>

      <div class="datos-paciente">
        <p><strong>Paciente:</strong> ${paciente.nombre ?? "No disponible"}</p>
        <p><strong>Documento:</strong> ${paciente.tipoDocumento} ${paciente.Documento}</p>
        <p><strong>Edad:</strong> ${paciente.edad ?? "No disponible"}</p>
        <p><strong>Programa:</strong> ${paciente.programa ?? "No disponible"}</p>
        <p><strong>Médico:</strong> ${paciente.medico ?? "No disponible"}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Medicamento</th>
            <th>Prescripción</th>
            <th>Cantidad</th>
            <th>Fecha Orden</th>
          </tr>
        </thead>
        <tbody>
          ${medicamentos.map((med) => `
            <tr>
              <td>${med.codigo ?? "-"}</td>
              <td>${med.nombre}</td>
              <td>${med.presentacion ?? "-"}</td>
              <td>${med.cantidad ?? "-"}</td>
              <td>${med.fechaOrden}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="firma">
        <p>Firmado electrónicamente por:</p>
        <p><strong>${paciente.medico ?? "No disponible"}</strong></p>
        <p>Registro Médico: ${paciente.registro ?? "No disponible"}</p>
      </div>

      <div class="footer">
        <p>Validez de la orden: 30 días desde la fecha de ordenamiento</p>
        <p>Estos servicios se deben facturar a: ${paciente.programa ?? "No disponible"}</p>
      </div>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html: contenidoHTML });
  await Sharing.shareAsync(uri);
};