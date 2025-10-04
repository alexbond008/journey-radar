import { Stop } from './stop';

export interface BusRoute {
  id: number;
  name: string;           // Route name (e.g., "Nowa Huta Express")
  number: string;         // Route number (e.g., "42", "N8")
  description?: string;   // Optional description
  stops: Stop[];          // Ordered list of stops on this route
  polyline: [number, number][]; // Route path coordinates for map display
  estimatedDuration?: number; // Total route duration in minutes
  activeIncidentIds?: string[]; // IDs of incidents affecting this route
}

