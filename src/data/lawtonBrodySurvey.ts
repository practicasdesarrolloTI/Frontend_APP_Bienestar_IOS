export const lawtonBrodySurvey = {
  id: "lawtonbrody",
  nombre: "Encuesta LAWTON-BRODY",
  image: require("../../assets/icons/lawton_b.png"),
  descripcion: "Evalúa el nivel de autonomía funcional en adultos mayores.",
  requiereEdad: false,
  requiereSexo: true,
  requiredIMC: false,

  preguntas: [
    {
      pregunta: "¿Usa el teléfono por iniciativa propia?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Puede hacer compras sin ayuda?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Prepara su comida de forma independiente?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Mantiene la casa o participa activamente en su limpieza?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Lava su ropa sin ayuda?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Usa transporte público o maneja sin ayuda?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Toma sus medicamentos correctamente?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    },
    {
      pregunta: "¿Administra su dinero sin ayuda?",
      omitida: false,
      opciones: [
        { texto: "Sí", valor: 1, sexo: null },
        { texto: "No", valor: 0, sexo: null }
      ]
    }
  ],
  recomendaciones: [
    {
      min: 0,
      max: 2,
      texto: "Necesitas apoyo en la mayoría de tus actividades cotidianas. Es importante tener un plan de cuidado estructurado con acompañamiento constante. Un equipo de salud puede ayudarte a prevenir riesgos y mejorar tu bienestar. No estás solo/a: contar con cuidadores, ayudas técnicas y el cariño de tu familia hace la diferencia. Pedir ayuda también es una forma de cuidarte.",
      sexo: null
    },
    {
      min: 3,
      max: 4,
      texto: "Requieres apoyo regular para algunas actividades diarias, como cocinar o manejar tu dinero. Es importante contar con la ayuda de familiares o cuidadores. Una evaluación geriátrica puede ayudarte a identificar formas de mejorar tu calidad de vida. Mantente activo dentro de tus posibilidades y busca participar en actividades que disfrutes.",
      sexo: null
    },
    {
      min: 5,
      max: 6,
      texto: "Eres bastante independiente, aunque podrías necesitar un poco de ayuda con tareas como hacer compras o usar el transporte. Fortalece tus habilidades con pequeñas estrategias y apóyate en recordatorios, dispositivos o aplicaciones. Habla con tu familia o médico para buscar soluciones juntos.",
      sexo: null
    },
    {
      min: 7,
      max: 8,
      texto: "¡Excelente trabajo! Puedes realizar todas tus actividades del día a día sin ayuda. Mantente activo y continúa cuidando tu salud física y mental. Realiza chequeos médicos de rutina y mantén contacto con tu red de apoyo. Participar en actividades como caminar, leer o hacer juegos de memoria te ayudará a conservar tu bienestar.",
      sexo: null
    }
  ]
};
