import api from './api';
import { LineResponse, Stop } from '@/types';

export const routesService = {

  async getLineWithStops(): Promise<LineResponse[]> {
    const response = await api.get<LineResponse[]>('/info/get_line_with_stops');
    return response.data;
  },

  // Get all routes
  async getAllRoutes(): Promise<LineResponse[]> {
    const response = await api.get<LineResponse[]>('/info/get_lines');
    return response.data;
  },

  // Get route by ID
  async getRouteById(routeId: string): Promise<LineResponse> {
    const response = await api.get<LineResponse>(`/info/get_line_info/${routeId}`);
    return response.data;
  },

  // Get route by line number
  async getRouteByNumber(lineNumber: string): Promise<LineResponse> {
    const response = await api.get<LineResponse>(`/info/route_by_number/${lineNumber}`);
    return response.data;
  },

  // Get all available line numbers
  async getAllLines(): Promise<string[]> {
    const response = await api.get<string[]>('/info/lines');
    return response.data;
  },

  // Get stops for a specific route
  async getStopsForRoute(lineId: string): Promise<Stop[]> {
    const response = await api.get<Stop[]>(`/info/get_stops_for_line?line_id=${lineId}`);
    return response.data;
  },
};


