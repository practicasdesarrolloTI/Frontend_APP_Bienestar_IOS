export const fragmiganSurvey = {
  id: "fragmigan",
  nombre: "Encuesta de Fragilidad",
  descripcion: "Evalúa signos de fragilidad física en adultos mayores",
  requiereEdad: true,
  requiereSexo: false,
  preguntas: [
    {
      pregunta: "¿Ha perdido peso involuntariamente en el último año?",
      opciones: [
        { texto: "Sí", valor: 1 },
        { texto: "No", valor: 0 },
      ],
    },
    {
      pregunta: "¿Se siente fatigado frecuentemente?",
      opciones: [
        { texto: "Sí", valor: 1 },
        { texto: "No", valor: 0 },
      ],
    },
    {
      pregunta: "¿Ha notado debilidad muscular o dificultad para caminar?",
      opciones: [
        { texto: "Sí", valor: 1 },
        { texto: "No", valor: 0 },
      ],
    },
    {
      pregunta: "¿Su velocidad al caminar ha disminuido notablemente?",
      opciones: [
        { texto: "Sí", valor: 1 },
        { texto: "No", valor: 0 },
      ],
    }
  ],
};