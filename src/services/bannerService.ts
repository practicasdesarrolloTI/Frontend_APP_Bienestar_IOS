const API_URL = "https://backend.bienestarips.com/maestros";

export async function fetchBanners() {
  try {
    const response = await fetch(`${API_URL}/banners`);
    if (!response.ok) throw new Error("Error al obtener los banners");

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.image,
    }));    
  } catch (error) {
    return [];
  }
}
