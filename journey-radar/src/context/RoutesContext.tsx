import { createContext, useState, useEffect, ReactNode } from 'react';
import { BusRoute } from '@/types';
import { routesService, RouteSegments } from '@/services/routesService';

export interface RoutesContextType {
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  routeSegments: RouteSegments | null;
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  selectRoute: (routeId: number | string) => void;
  setRouteSegments: (segments: RouteSegments | null) => void;
  clearSelectedRoute: () => void;
}

export const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

interface RoutesProviderProps {
  children: ReactNode;
}

export function RoutesProvider({ children }: RoutesProviderProps) {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegments | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routesService.getAllRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const selectRoute = (routeId: number | string) => {
    console.log('Selecting route:', routeId);
    console.log('Available routes:', routes.map(r => ({ id: r.id, number: r.number, name: r.name })));
    const route = routes.find((r) => r.id === Number(routeId));
    console.log('Found route:', route ? { id: route.id, number: route.number, name: route.name } : 'null');
    setSelectedRoute(route || null);
    // Clear route segments when selecting a single route
    setRouteSegments(null);
  };

  const clearSelectedRoute = () => {
    setSelectedRoute(null);
    setRouteSegments(null);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const value: RoutesContextType = {
    routes,
    selectedRoute,
    routeSegments,
    loading,
    error,
    fetchRoutes,
    selectRoute,
    setRouteSegments,
    clearSelectedRoute,
  };

  return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
}


