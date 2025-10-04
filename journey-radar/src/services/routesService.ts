import api from './api';
import { BusRoute, Stop } from '@/types';

// Helper function to convert route stops to polyline
function stopsToPolyline(stops: Stop[]): [number, number][] {
  return stops.map(stop => [stop.lat, stop.lon] as [number, number]);
}

// Helper function to enhance route with polyline
function enhanceRoute(route: BusRoute): BusRoute {
  return {
    ...route,
    polyline: stopsToPolyline(route.stops),
  };
}

export const routesService = {
  // Get all routes
  async getAllRoutes(): Promise<BusRoute[]> {
    const response = await api.get<BusRoute[]>('/info/get_routes');
    // Enhance routes with polylines from stops
    return response.data.map(enhanceRoute);
  },

  // Get route by ID
  async getRouteById(routeId: number): Promise<BusRoute> {
    const response = await api.get<BusRoute>(`/info/get_route_info/${routeId}`);
    return enhanceRoute(response.data);
  },

  // Get route by line number
  async getRouteByNumber(lineNumber: string): Promise<BusRoute> {
    const response = await api.get<BusRoute>(`/info/route_by_number/${lineNumber}`);
    return enhanceRoute(response.data);
  },

  // Get all available line numbers
  async getAllLines(): Promise<string[]> {
    const response = await api.get<string[]>('/info/lines');
    return response.data;
  },

  // Get stops for a specific route
  async getStopsForRoute(routeId: number): Promise<Stop[]> {
    const response = await api.get<Stop[]>(`/info/get_stops_for_route?route_id=${routeId}`);
    return response.data;
  },
};


