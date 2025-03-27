export const lawtonBrodySurvey = {
  id: "lawton_brody",
  nombre: "Escala Lawton-Brody",
  descripcion: "Evalúa habilidades funcionales del adulto mayor",
  requiereEdad: false,
  requiereSexo: false,
  preguntas: [
    {
      pregunta: "¿Puede usar el teléfono sin ayuda?",
      opciones: [
        { texto: "Completamente capaz", valor: 1 },
        { texto: "Capaz solo para números conocidos", valor: 0.5 },
        { texto: "Incapaz de usarlo", valor: 0 },
      ],
    },
    {
      pregunta: "¿Puede hacer sus compras sin ayuda?",
      opciones: [
        { texto: "Totalmente independiente", valor: 1 },
        { texto: "Necesita algo de ayuda", valor: 0.5 },
        { texto: "Dependiente", valor: 0 },
      ],
    },
    {
      pregunta: "¿Es capaz de preparar sus comidas?",
      opciones: [
        { texto: "Sí", valor: 1 },
        { texto: "Con asistencia", valor: 0.5 },
        { texto: "No", valor: 0 },
      ],
    }
  ],
};