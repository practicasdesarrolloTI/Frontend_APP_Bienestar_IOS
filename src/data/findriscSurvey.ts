export const findriscSurvey = {
  id: "findrisc",
  nombre: "Encuesta FINDRISC",
  descripcion: "Evalúa el riesgo de diabetes tipo 2",
  requiereEdad: true,
  requiereSexo: true,
  calcularEdad: (edad: number) => {
    if (edad < 45) return 0;
    if (edad >= 45 && edad <= 54) return 2;
    if (edad >= 55 && edad <= 64) return 3;
    return 4;
  },
  preguntas: [
    {
      pregunta: "¿Tiene antecedentes familiares de diabetes?",
      opciones: [
        { texto: "No", valor: 0 },
        { texto: "Sí: abuelo, tío o primo", valor: 3 },
        { texto: "Sí: padre, madre, hermano", valor: 5 },
      ],
    },
    {
      pregunta: "¿Cuál es su circunferencia de cintura?",
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
      pregunta: "¿Realiza al menos 30 minutos de actividad física al día?",
      opciones: [
        { texto: "Sí", valor: 0 },
        { texto: "No", valor: 2 },
      ],
    },
    {
      pregunta: "¿Con qué frecuencia consume frutas o verduras?",
      opciones: [
        { texto: "Diario", valor: 0 },
        { texto: "Ocasional", valor: 1 },
        { texto: "Raramente o nunca", valor: 2 },
      ],
    },
    {
      pregunta: "¿Ha tomado medicamentos para la hipertensión?",
      opciones: [
        { texto: "No", valor: 0 },
        { texto: "Sí", valor: 2 },
      ],
    },
    {
      pregunta: "¿Se ha detectado niveles altos de glucosa en algún examen?",
      opciones: [
        { texto: "No", valor: 0 },
        { texto: "Sí", valor: 5 },
      ],
    },
    {
      pregunta: "¿Cuál es su IMC calculado?",
      opciones: [
        { texto: "< 25", valor: 0 },
        { texto: "25–30", valor: 1 },
        { texto: "> 30", valor: 3 },
      ],
    },
  ],
};
