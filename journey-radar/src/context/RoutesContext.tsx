import { createContext, useState, useEffect, ReactNode } from 'react';
import { BusRoute } from '@/types';
import { routesService } from '@/services/routesService';

export interface RoutesContextType {
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  selectRoute: (routeId: number | string) => void;
  clearSelectedRoute: () => void;
}

export const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

interface RoutesProviderProps {
  children: ReactNode;
}

export function RoutesProvider({ children }: RoutesProviderProps) {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
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
  };

  const clearSelectedRoute = () => {
    setSelectedRoute(null);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const value: RoutesContextType = {
    routes,
    selectedRoute,
    loading,
    error,
    fetchRoutes,
    selectRoute,
    clearSelectedRoute,
  };

  return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
}


