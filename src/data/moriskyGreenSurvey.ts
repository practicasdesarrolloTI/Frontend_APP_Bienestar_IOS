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
      pregunta:
        "¿Olvida alguna vez tomar los medicamentos para tratar su enfermedad?",
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
      texto:
        "Esto indica que frecuentemente olvidas tomar tus medicamentos o suspendes el tratamiento por decisión propia. Te recomendamos establecer una rutina diaria para tomar tus medicamentos, usa alarmas o recordatorios, guarda los medicamentos en un lugar visible, habla con tu médico si tienes dudas, efectos secundarios o barreras para seguir el tratamiento, recuerda que no tomar tus medicamentos puede empeorar tu enfermedad y afectar tu calidad de vida.  ",
      sexo: null,
    },
    {
      min: 0,
      max: 0,
      texto:
        "¡Felicidades! Estás tomando correctamente tus medicamentos. Este es un paso clave para controlar tu enfermedad. Continúa con tus buenos hábitos y revisa periódicamente tus tratamientos con el médico, Infórmate sobre tu enfermedad para mantenerte motivado y comprometido con tu salud. ",
      sexo: null,
    },
  ],
};
