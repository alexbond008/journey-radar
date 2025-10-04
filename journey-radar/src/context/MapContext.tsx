import { createContext, useState, ReactNode } from 'react';
import { MAP_CONFIG } from '@/utils/constants';

export interface MapContextType {
  center: [number, number];
  zoom: number;
  selectedMarker: string | null;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setSelectedMarker: (markerId: string | null) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const [center, setCenter] = useState<[number, number]>([
    MAP_CONFIG.defaultCenter.lat,
    MAP_CONFIG.defaultCenter.lon,
  ]);
  const [zoom, setZoom] = useState<number>(MAP_CONFIG.defaultZoom);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const value: MapContextType = {
    center,
    zoom,
    selectedMarker,
    setCenter,
    setZoom,
    setSelectedMarker,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}


