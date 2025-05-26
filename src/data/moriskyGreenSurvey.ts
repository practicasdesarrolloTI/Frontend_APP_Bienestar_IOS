export const moriskyGreenSurvey = {
  id: "moriskyGreen",
  nombre: "Test de Morisky-Green",
   imagen: require("../../assets/icons/morisky_b.png"),
  descripcion:
    "Esta encuesta ayuda a conocer qué tanto sigues tu tratamiento médico.",
  requiereEdad: false,
  requiereSexo: false,
  requiredIMC: false,
  preguntas: [
    {
      omitida: false,
      pregunta: "¿Olvida alguna vez tomar los medicamentos para tratar su enfermedad?",
      opciones: [
        { texto: "Sí", valor: 0, sexo: null },
        { texto: "No", valor: 1, sexo: null },
      ],
    },
    {
      omitida: false,
      pregunta: "¿Toma los medicamentos a las horas indicadas?",
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null },
      ],
    },
    {
      omitida: false,
      pregunta: "Cuando se encuentra bien, ¿deja de tomar la medicación?",
      opciones: [
        { texto: "Sí", valor: 0, sexo: null },
        { texto: "No", valor: 1, sexo: null },
      ],
    },
    {
      omitida: false,
      pregunta: "¿Alguna vez se le sienta mal, ¿deja usted de tomarla?",
      opciones: [
        { texto: "Sí", valor: 0, sexo: null },
        { texto: "No", valor: 1, sexo: null },
      ],
    },
  ],

  recomendaciones: [
    {
      min: 1,
      max: 1,
      texto: "Paciente adherente al tratamiento",
      sexo: null,
    },
    {
      min: 0,
      max: 0,
      texto: "Paciente no adherente al tratamiento",
      sexo: null,
    },
  ],
};
