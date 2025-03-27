const API_URL = "http://10.0.2.2:5000/api";

export const get = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`GET ${endpoint}:`, error);
    throw error;
  }
};