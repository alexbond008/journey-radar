import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, X, RotateCcw } from 'lucide-react';
import { useStops } from '@/hooks/useStops';
import { useRoutes } from '@/hooks/useRoutes';
import { BusRoute } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

interface RouteSelectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RouteSelectorPanel({ isOpen, onClose }: RouteSelectorPanelProps) {
  const { searchStops } = useStops();
  const { routes, selectRoute } = useRoutes();

  const [startQuery, setStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [startStopId, setStartStopId] = useState<number | null>(null);
  const [destStopId, setDestStopId] = useState<number | null>(null);
  const [routeResults, setRouteResults] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedStartQuery = useDebounce(startQuery, 300);
  const debouncedDestQuery = useDebounce(destQuery, 300);

  const startSuggestions = debouncedStartQuery ? searchStops(debouncedStartQuery).slice(0, 5) : [];
  const destSuggestions = debouncedDestQuery ? searchStops(debouncedDestQuery).slice(0, 5) : [];

  const handleFindRoutes = () => {
    if (!startStopId || !destStopId) {
      console.log('Missing stop IDs:', { startStopId, destStopId });
      return;
    }

    console.log('Finding routes between stops:', { startStopId, destStopId });
    console.log('Available routes:', routes.length);

    setLoading(true);
    try {
      // Client-side filtering: find routes that contain both stops
      const matchingRoutes = routes.filter(route => {
        const stopIds = route.stops.map(stop => stop.id);
        const startIndex = stopIds.indexOf(startStopId);
        const destIndex = stopIds.indexOf(destStopId);
        console.log(`Route ${route.number} (${route.name}):`, {
          stopIds: stopIds.slice(0, 5),
          startIndex,
          destIndex,
          matches: startIndex !== -1 && destIndex !== -1 && startIndex < destIndex
        });
        // Both stops must exist and start must come before destination
        return startIndex !== -1 && destIndex !== -1 && startIndex < destIndex;
      });
      
      console.log('Found matching routes:', matchingRoutes.length);
      setRouteResults(matchingRoutes);
    } catch (error) {
      console.error('Failed to search routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId: number) => {
    selectRoute(routeId);
    onClose();
  };

  const handleClearFields = () => {
    setStartQuery('');
    setDestQuery('');
    setStartStopId(null);
    setDestStopId(null);
    setRouteResults([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 right-0 top-0 max-w-5xl mx-auto bg-card border-b border-l border-r border-border z-[1001] overflow-y-auto max-h-[95vh] rounded-b-lg shadow-xl transition-all transform animate-in slide-in-from-top duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">Route Selector</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Start Stop */}
            <div className="relative">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Start Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Search for a start location..."
                  value={startQuery}
                  onChange={(e) => setStartQuery(e.target.value)}
                  className="bg-secondary border-border text-foreground text-base"
                />
              </div>
              {startSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-20 max-h-72 overflow-y-auto">
                  {startSuggestions.map((stop) => (
                    <button
                      key={stop.id}
                      className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                      onClick={() => {
                        setStartQuery(`${stop.code} - ${stop.name}`);
                        setStartStopId(stop.id);
                      }}
                    >
                      <div className="font-medium text-base">{stop.code} - {stop.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Stop */}
            <div className="relative">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Destination
              </label>
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Search for a destination..."
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  className="bg-secondary border-border text-foreground text-base"
                />
              </div>
              {destSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-20 max-h-72 overflow-y-auto">
                  {destSuggestions.map((stop) => (
                    <button
                      key={stop.id}
                      className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                      onClick={() => {
                        setDestQuery(`${stop.code} - ${stop.name}`);
                        setDestStopId(stop.id);
                      }}
                    >
                      <div className="font-medium text-base">{stop.code} - {stop.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFindRoutes}
                disabled={!startStopId || !destStopId || loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
              >
                {loading ? 'Searching...' : 'Find Routes'}
              </Button>
              <Button
                onClick={handleClearFields}
                variant="outline"
                className="h-12 px-4"
                title="Clear all fields"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            {/* Route Results */}
            {routeResults.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-lg font-semibold text-card-foreground">Available Routes</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {routeResults.map((route) => (
                    <Card
                      key={route.id}
                      className="p-5 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleSelectRoute(route.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">{route.number} - {route.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {route.stops.length} stops · {route.estimatedDuration || 'N/A'} min
                          </div>
                          {route.activeIncidentIds && route.activeIncidentIds.length > 0 && (
                            <div className="text-sm text-warning mt-1">
                              ⚠️ {route.activeIncidentIds.length} incident(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

