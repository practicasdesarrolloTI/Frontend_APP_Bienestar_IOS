type Opcion = {
    texto: string;
    valor: number;
    sexo?: string | null;
  };
  
  type Pregunta = {
    pregunta: string;
    opciones?: Opcion[];
    omitida: boolean;
    recomendaciones?: {
      min: number;
      max: number;
      texto: string;
      sexo?: string | null;
    }[];
  };
  
  export function calcularIMC(peso: number, estatura: number): number {
    if (peso > 0 && estatura > 0) {
      return peso / (estatura * estatura);
    }
    return 0;
  }
  
  export function calcularPuntajeYRecomendacion(
    preguntas: Pregunta[],
    respuestas: string[],
    edad: number,
    peso: number,
    estatura: number,
    sexo: string
  ) {
    let puntaje = 0;
  
    preguntas.forEach((pregunta, index) => {
      if (pregunta.omitida) return;
  
      const respuesta = respuestas[index];
  
      if (pregunta.opciones && respuesta !== '') {
        const opcionSeleccionada = pregunta.opciones.find(
          (op) => op.valor.toString() === respuesta
        );
        if (opcionSeleccionada) {
          puntaje += opcionSeleccionada.valor;
        }
      } else if (!pregunta.opciones) {
        const valorNumerico = parseFloat(respuesta);
        if (!isNaN(valorNumerico)) {
          puntaje += valorNumerico;
        }
      }
    });
  
    let recomendacion = 'Sin recomendación disponible.';
  
    const preguntaRecomendacion = preguntas.find(
      (p) => p.recomendaciones && Array.isArray(p.recomendaciones)
    );
  
    if (preguntaRecomendacion && preguntaRecomendacion.recomendaciones) {
      const recomendacionEncontrada = preguntaRecomendacion.recomendaciones.find((r) => {
        const sexoCoincide = r.sexo ? r.sexo === sexo : true;
        return sexoCoincide && puntaje >= r.min && puntaje <= r.max;
      });
  
      if (recomendacionEncontrada) {
        recomendacion = recomendacionEncontrada.texto;
      }
    }
  
    return {
      puntaje,
      recomendacion,
    };
  }
  