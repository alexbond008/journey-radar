import api from './api';
import { Stop, BusRoute } from '@/types';

export const stopsService = {
  // Get all stops
  async getAllStops(): Promise<Stop[]> {
    const response = await api.get<Stop[]>('/info/get_stops');
    return response.data;
  },

  // Get stop by ID
  async getStopById(stopId: number): Promise<Stop> {
    const response = await api.get<Stop>(`/info/get_stop_info/${stopId}`);
    return response.data;
  },

  // Search stops by name
  async searchStopsByName(query: string): Promise<Stop[]> {
    const response = await api.get<Stop[]>(`/info/stops_by_name/${query}`);
    return response.data;
  },

  // Search stops locally (client-side)
  searchStops(stops: Stop[], query: string): Stop[] {
    const lowerQuery = query.toLowerCase();
    return stops.filter(
      (stop) =>
        stop.name.toLowerCase().includes(lowerQuery) ||
        stop.code.toLowerCase().includes(lowerQuery)
    );
  },

  // Get routes for a specific stop
  async getRoutesForStop(stopId: number): Promise<BusRoute[]> {
    const response = await api.get<BusRoute[]>(`/info/get_lines_for_stop/${stopId}`);
    return response.data;
  },
};


