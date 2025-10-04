import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, X } from 'lucide-react';
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
    if (!startStopId || !destStopId) return;

    setLoading(true);
    try {
      // Client-side filtering: find routes that contain both stops
      const matchingRoutes = routes.filter(route => {
        const stopIds = route.stops.map(stop => stop.id);
        const startIndex = stopIds.indexOf(startStopId);
        const destIndex = stopIds.indexOf(destStopId);
        // Both stops must exist and start must come before destination
        return startIndex !== -1 && destIndex !== -1 && startIndex < destIndex;
      });
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 right-0 top-0 max-w-4xl mx-auto bg-card border-b border-l border-r border-border z-[1001] overflow-y-auto max-h-[80vh] rounded-b-lg shadow-xl transition-all transform animate-in slide-in-from-top duration-300">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-card-foreground">Route Selector</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Start Stop */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Start location"
                  value={startQuery}
                  onChange={(e) => setStartQuery(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              {startSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {startSuggestions.map((stop) => (
                    <button
                      key={stop.id}
                      className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                      onClick={() => {
                        setStartQuery(`${stop.code} - ${stop.name}`);
                        setStartStopId(stop.id);
                      }}
                    >
                      <div className="font-medium">{stop.code} - {stop.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Stop */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Destination"
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              {destSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {destSuggestions.map((stop) => (
                    <button
                      key={stop.id}
                      className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                      onClick={() => {
                        setDestQuery(`${stop.code} - ${stop.name}`);
                        setDestStopId(stop.id);
                      }}
                    >
                      <div className="font-medium">{stop.code} - {stop.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleFindRoutes}
              disabled={!startStopId || !destStopId || loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Searching...' : 'Find Routes'}
            </Button>

            {/* Route Results */}
            {routeResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-card-foreground">Available Routes</h3>
                {routeResults.map((route) => (
                  <Card
                    key={route.id}
                    className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => handleSelectRoute(route.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">{route.number} - {route.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {route.stops.length} stops · {route.estimatedDuration || 'N/A'} min
                        </div>
                        {route.activeIncidentIds && route.activeIncidentIds.length > 0 && (
                          <div className="text-sm text-warning">
                            ⚠️ {route.activeIncidentIds.length} incident(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

