import { Stop } from './stop';

export interface BusRoute {
  id: number;
  name: string;
  number: string;
  description?: string;
  stops: Stop[];
  polyline: [number, number][];  // Array of [lat, lng] coordinates
  estimatedDuration?: number;
  activeIncidentIds?: string[];
}

export interface LineResponse {
  id: number;
  name: string;
  stops: Stop[];
}

