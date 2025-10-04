import { createContext, useState, useEffect, ReactNode } from 'react';
import { Stop } from '@/types';
import { stopsService } from '@/services/stopsService';

export interface StopsContextType {
  stops: Stop[];
  loading: boolean;
  error: string | null;
  fetchStops: () => Promise<void>;
  searchStops: (query: string) => Stop[];
}

export const StopsContext = createContext<StopsContextType | undefined>(undefined);

interface StopsProviderProps {
  children: ReactNode;
}

export function StopsProvider({ children }: StopsProviderProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stopsService.getAllStops();
      setStops(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stops');
    } finally {
      setLoading(false);
    }
  };

  const searchStops = (query: string): Stop[] => {
    return stopsService.searchStops(stops, query);
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const value: StopsContextType = {
    stops,
    loading,
    error,
    fetchStops,
    searchStops,
  };

  return <StopsContext.Provider value={value}>{children}</StopsContext.Provider>;
}


