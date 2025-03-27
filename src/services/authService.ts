import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://10.0.2.2:5000/api/auth"; // Asegúrate de reemplazar con tu IP local si pruebas en un dispositivo real

// Registrar usuario
export const registerUser = async (documentType: DocumentType, document: number, password: string) => {
  try {
    console.log("Enviando solicitud de registro con:", { documentType, document, password });

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentType, document, password }),
    });


  } catch (error: any) {
    console.error("Error en el registro:", error.message);
    return { success: false, message: error.message };
  }
};

// Iniciar sesión
export const loginUser = async (document: number, password: string) => {
  try {
    console.log("Intentando iniciar sesión con:", { document, password });

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el login");
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error("Token no recibido en la respuesta del servidor");
    }

    await AsyncStorage.setItem("token", data.token); // Guardar token JWT en el almacenamiento
    console.log("Token guardado en AsyncStorage:", data.token);

    return { success: true, data };
  } catch (error: any) {
    console.error("Error en el login:", error.message);
    return { success: false, message: error.message };
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Token eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar el token:", error);
  }
};

// Obtener el token almacenado
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};