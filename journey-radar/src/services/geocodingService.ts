// Geocoding service using Nominatim (OpenStreetMap)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

export const geocodingService = {
  // Convert coordinates to address
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  },

  // Convert address to coordinates
  async geocode(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await fetch(
        `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },
};


