import { useContext } from 'react';
import { StopsContext } from '@/context/StopsContext';

export function useStops() {
  const context = useContext(StopsContext);
  if (!context) {
    throw new Error('useStops must be used within a StopsProvider');
  }
  return context;
}


