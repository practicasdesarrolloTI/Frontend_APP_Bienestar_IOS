import dayjs from "dayjs";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const agruparMedicamentosPorFecha = (medicamentos: any[]) => {
  const ahora = dayjs();
  const tresMesesAtras = ahora.subtract(3, "month");

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

export const generarPDFMedicamentos = async (
  paciente: any,
  medicamentos: any[],
  fecha: string
) => {
  const medicamento = medicamentos[0];
  const contenidoHTML = `
    <!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      margin: 40px;
      color: #000;
    }

    .titulo {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .encabezado {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .paciente-section {
      border: 1px solid #ccc;
      margin-bottom: 12px;
      border-radius: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin: 4px;
    }

    td,
    th {
      border: 0px;
      padding: 2px;
      vertical-align: top;
    }

    .paciente-section td:first-child {
      width: 15%;
    }

    .medicamento-section {
      border: 1px solid #ccc;
      margin-bottom: 12px;
      border-radius: 10px;
    }

    .tabla-medicamentos {
      margin-top: 10px;
    }

    .footer {
      margin-top: 30px;
    }
  </style>
</head>

<body>
  <div class="titulo">ORDEN DE MEDICAMENTOS</div>

  <div class="encabezado">
    <div>
      <div><strong>Sede:</strong> BIENESTAR COLINA</div>
      <div><strong>Dirección:</strong> Crr 59a #136-95</div>
      <div><strong>Teléfono:</strong> 3102498123</div>
    </div>
    <div>
      <div><strong>Orden Nro.:</strong> ${
        medicamento.no_autorizacion ?? "No disponible"
      }</div>
    </div>
  </div>

  <div class="paciente-section">
    <table>
      <tr>
        <td><strong>Paciente</strong><br>${
          paciente.nombre ?? "No disponible"
        }</td>
        <td><strong>ID</strong><br>${paciente.tipoDocumento ?? ""} ${
    paciente.Documento ?? ""
  }</td>
        <td><strong>Edad</strong><br>${paciente.edad ?? "No disponible"}</td>
        <td><strong>Tipo Usuario</strong><br>BENEFICIARIO</td>
        <td><strong>Semanas</strong><br>----</td>
        <td><strong>Rango</strong><br>----</td>
      </tr>
      <tr>
        <td><strong>Contrato</strong><br>BIENESTAR CALLE 53 - PURO</td>
        <td></td>
        <td><strong>Plan</strong><br>CONTRIBUTIVO</td>
        <td><strong>Sede Afiliado</strong><br>BIENESTAR CALLE 53</td>
        <td><strong>Programa</strong><br>${
          paciente.programa ?? "No disponible"
        }</td>
        <td></td>
      </tr>
      <tr>
        <td><strong>Dirección</strong><br>CRA 102C N 140B 32</td>
        <td></td>
        <td><strong>Teléfono</strong><br>---</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><strong>Solicitado Por</strong><br>${
          paciente.medico ?? "No disponible"
        }</td>
        <td></td>
        <td><strong>Diagnóstico</strong><br>----</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><strong>Expedida a</strong><br>FARMACIA</td>
        <td></td>
        <td><strong>Dirección</strong><br>----</td>
        <td></td>
        <td><strong>Teléfono</strong><br>----</td>
        <td></td>
      </tr>
    </table>
  </div>

  <div class="medicamento-section">
    <table class="tabla-medicamentos">
      <thead>
        <tr>
          <th>Código</th>
          <th>Medicamentos</th>
          <th>Dosificación</th>
          <th># Dosis</th>
          <th>Cant. Pres.</th>
          <th>Indicaciones</th>
          <th>Tarifa</th>
        </tr>
      </thead>
      <tbody>
        ${medicamentos
          .map(
            (med) => `
          <tr>
            <td>${med.codigo ?? "-"}</td>
            <td>${med.nombre ?? "-"}</td>
            <td>${med.dosificacion ?? "-"}</td>
            <td>${med.dosis ?? "-"}</td>
            <td>${med.cantidad ?? "-"}</td>
            <td>${med.indicaciones ?? "-"}</td>
            <td>PACTADA</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div style="margin-top: 10px; font-weight: bold;">TOTAL PACTADA</div>
  <div style="margin-top: 10px;">
    Cobrar COPAGO o CUOTA MODERADORA POR VALOR DE: <strong>$4700</strong>
  </div>

  <div class="footer">
    <div>Firmado electrónicamente por:</div>
    <div><strong>${paciente.medico ?? "No disponible"}</strong></div>
    <div>Registro Médico: ${paciente.registro ?? "No disponible"}</div>
    <br />
    <div>Fecha Ordenamiento: ${fecha ?? "Fecha no disponible"}</div>
    <div>
      Validez de la orden: 30 días desde la fecha de ordenamiento
    </div>
    <div>Facturar a: ${paciente.programa ?? "No disponible"}</div>
  </div>
</body>

</html>  `;

  const { uri } = await Print.printToFileAsync({ html: contenidoHTML });
  await Sharing.shareAsync(uri);
};
