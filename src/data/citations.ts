export type SurveyKey = 'FINDRISC' | 'FRAMINGHAM' | 'LAWTON_BRODY' | 'MORISKY_GREEN';
 
type Citation = { text: string; url?: string };
type CitationMap = Record<SurveyKey, Citation[]>;
 
export const CITATIONS: CitationMap = {
  FINDRISC: [
    {
      text:
        'Ministerio de Salud y Protección Social. Resolución 3280 de 2018. Por la cual se adopta la Política de Atención Integral en Salud – PAIS, y se definen los lineamientos para la operación de la Ruta Integral de Atención en Salud – RIAS. Bogotá: MinSalud; 2018.',
    },
    {
      text:
        'Ministerio de Salud y Protección Social, Instituto de Evaluación Tecnológica en Salud (IETS). Guía de Práctica Clínica (GPC) para el diagnóstico, tratamiento y seguimiento de la diabetes mellitus tipo 2 en población mayor de 18 años. Guía No. GPC-2015-51. Bogotá: MinSalud–IETS; 2016 [actualizada 2017].',
    },
    {
      text:
        'Asociación Latinoamericana de Diabetes (ALAD). Guías ALAD sobre el diagnóstico, control y tratamiento de la diabetes mellitus tipo 2 con medicina basada en evidencia. Edición 2022. Rev. ALAD. 2022;12(3):7-56.',
    },
  ],
  FRAMINGHAM: [
    {
      text:
        'Ministerio de Salud y Protección Social. Resolución 3280 de 2018. Bogotá: MinSalud; 2018.',
    },
    {
      text:
        'Ministerio de Salud y Protección Social, Colciencias, Asociación Colombiana de Medicina Interna (ACMI). Guía de práctica clínica para la prevención, diagnóstico, tratamiento y rehabilitación de la enfermedad cardiovascular ateroesclerótica. Bogotá: MinSalud; 2014.',
    },
  ],
  LAWTON_BRODY: [
    {
      text:
        'Ministerio de Salud y Protección Social. Resolución 3280 de 2018. Bogotá: MinSalud; 2018.',
    },
    {
      text:
        'Ministerio de Salud y Protección Social. Guía de práctica clínica para la detección temprana de alteraciones en el adulto mayor. Bogotá: MinSalud; 2016.',
    },
  ],
  MORISKY_GREEN: [
    {
      text:
        'Ministerio de Salud y Protección Social. Resolución 3280 de 2018. Bogotá: MinSalud; 2018.',
    },
    {
      text:
        'Ministerio de Salud y Protección Social. Guía de práctica clínica para la promoción de la adherencia al tratamiento en enfermedades crónicas no transmisibles. Bogotá: MinSalud; 2015.',
    },
  ],
};