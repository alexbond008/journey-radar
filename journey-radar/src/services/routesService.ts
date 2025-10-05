import api from './api';
import { BusRoute, Stop } from '@/types';

export interface RouteSegment {
  id: number;
  name: string;
  number?: string;
  stops: Stop[];
  time_table?: any[];
}

export interface RouteSegments {
  [segmentId: string]: RouteSegment;
}

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

  // Find route between two stops
  async findRoute(startStop: Stop, endStop: Stop): Promise<RouteSegments | null> {
    const response = await api.post<RouteSegments>('/info/get_route', {
      start: startStop,
      end: endStop,
    });
    return response.data;
  },
};


