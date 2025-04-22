export function calcularEdad(fechaNacimiento: string): number {
    const [dia, mes, año] = fechaNacimiento.split('/').map(Number);
    const fechaNac = new Date(año, mes - 1, dia);
    const hoy = new Date();
  
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
  
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
  
    return edad;
  }
  