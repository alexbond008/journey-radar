export interface Stop {
  id: number;
  code: string;           // Stop number/code (e.g., "1234")
  name: string;           // Stop name (e.g., "Rynek Główny")
  description?: string;   // Optional additional details
  lat: number;            // Latitude coordinate
  lon: number;            // Longitude coordinate
}

