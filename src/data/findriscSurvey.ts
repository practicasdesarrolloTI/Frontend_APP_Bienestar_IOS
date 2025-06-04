
export const findriscSurvey = {
  id: "findrisc",
  nombre: "Encuesta FINDRISC",
  imagen: require("../../assets/icons/findrisc_b.png"),
  descripcion: "Evalúa el riesgo de diabetes tipo 2",
  requiereEdad: true,
  requiereSexo: true,
  requireIMC: true,

  preguntas: [
    {
      pregunta: "Edad",
      omitida: false,
      opciones: [
        {texto: "Menos de 45 años", valor: 0, sexo: null},
        {texto: "Entre 45-54 años", valor: 2, sexo: null},
        {texto: "Entre 55-64 años", valor: 3, sexo: null},
        {texto: "Mas de 64 años", valor: 4, sexo: null},
      ],
    },
    {
      pregunta: "IMC (kg/m2)",
      requiredIMC: true,
      omitida: false,
      opciones: [
        {texto: "Menos de 25 kg/m2", valor: 0, sexo: null},
        {texto: "Entre 25-30 kg/m2", valor: 1, sexo: null},
        {texto: "Mas de 30 kg/m2", valor: 3, sexo: null},
      ],
    },
    {
      pregunta: "¿Cuál es su circunferencia de cintura?",
      omitida: false,
      opciones: [
        { texto: "< 94cm", valor: 0, sexo: "Masculino" },
        { texto: "94-102cm", valor: 3, sexo: "Masculino" },
        { texto: ">102cm", valor: 4, sexo: "Masculino" },
        { texto: "< 80cm", valor: 0, sexo: "Femenino" },
        { texto: "80-88cm", valor: 3, sexo: "Femenino" },
        { texto: ">88cm", valor: 4, sexo: "Femenino" },
      ],
    },
    {
      pregunta: "¿Tiene antecedentes familiares de diabetes?",
      omitida: false,
      opciones: [
        { texto: "No", valor: 0, sexo: null },
        { texto: "Sí: abuelo, tío o primo", valor: 3, sexo: null },
        { texto: "Sí: padre, madre, hermano", valor: 5, sexo: null },
      ],
    },
    {
      pregunta: "¿Realiza al menos 30 minutos de actividad física al día?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 0, sexo: null },
        { texto: "No", valor: 2, sexo: null },
      ],
    },
    {
      pregunta: "¿Con qué frecuencia consume frutas o verduras?",
      omitida: false,
      opciones: [
        { texto: "Diario", valor: 0, sexo: null },
        { texto: "Ocasional", valor: 1, sexo: null },
      ],
    },
    {
      pregunta: "¿Ha tomado medicamentos para la hipertensión?",
      omitida: false,
      opciones: [
        { texto: "No", valor: 0, sexo: null },
        { texto: "Sí", valor: 2, sexo: null },
      ],
    },
    {
      pregunta: "¿Se ha detectado niveles altos de glucosa en algún examen?",
      omitida: false,
      opciones: [
        { texto: "No", valor: 0, sexo: null },
        { texto: "Sí", valor: 5, sexo: null },
      ],

    },
  ],
  recomendaciones: [
    {
      min: 0,
      max: 6,
      texto:
        "Tu riesgo de desarrollar diabetes tipo 2 es muy bajo. Sigue con tus buenos hábitos de alimentación y actividad física. Puedes volver a evaluar tu salud en 1 o 2 años.",
      sexo: null,
    },
    {
      min: 7,
      max: 11,
      texto:
        "Tienes un leve aumento en el riesgo de diabetes tipo 2. Comienza a mejorar tu alimentación y realiza actividad física regular. Consulta con un profesional de salud de tu sede.",
      sexo: null,
    },
    {
      min: 12,
      max: 14,
      texto:
        "Existe una posibilidad media de desarrollar diabetes. Consulta a tu médico para una evaluación y análisis de sangre. Puedes prevenirla con pequeños cambios. Recuerda seguir una dieta balanceada y alta en vegetales, grasas saludables y fibra.",
      sexo: null,
    },
    {
      min: 15,
      max: 20,
      texto:
        "Tu riesgo de diabetes es alto. Es importante hacer una cita médica y realizar exámenes. Cambios en tu estilo de vida pueden marcar la diferencia. Recuerda seguir una dieta baja en carbohidratos refinados y azúcares.",
      sexo: null,
    },
    {
      min: 21,
      max: 30,
      texto:
        "Tu riesgo de desarrollar diabetes tipo 2 es muy alto. Es urgente que consultes con un médico para una evaluación completa y orientación personalizada.",
      sexo: null,
    },
  ],
};

