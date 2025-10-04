import api from './api';
import { BusRoute, Stop } from '@/types';

export const routesService = {

  // Get all routes with polylines
  async getAllRoutes(): Promise<BusRoute[]> {
    const response = await api.get<BusRoute[]>('/info/get_lines');
    return response.data;
  },

  // Get route by ID
  async getRouteById(routeId: number): Promise<BusRoute> {
    const response = await api.get<BusRoute>(`/info/get_line_info/${routeId}`);
    return response.data;
  },

  // Get route by line number
  async getRouteByNumber(lineNumber: string): Promise<BusRoute> {
    const response = await api.get<BusRoute>(`/info/route_by_number/${lineNumber}`);
    return response.data;
  },

  // Get all available line numbers
  async getAllLines(): Promise<string[]> {
    const response = await api.get<string[]>('/info/lines');
    return response.data;
  },

  // Get stops for a specific route
  async getStopsForRoute(lineId: number): Promise<Stop[]> {
    const response = await api.get<Stop[]>(`/info/get_stops_for_line?line_id=${lineId}`);
    return response.data;
  },
};


