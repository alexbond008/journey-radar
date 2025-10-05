import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, X, RotateCcw } from 'lucide-react';
import { useStops } from '@/hooks/useStops';
import { useRoutes } from '@/hooks/useRoutes';
import { Stop } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { routesService } from '@/services/routesService';
import { toast } from '@/hooks/use-toast';

interface RouteSelectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RouteSelectorPanel({ isOpen, onClose }: RouteSelectorPanelProps) {
  const { searchStops } = useStops();
  const { setRouteSegments } = useRoutes();

  const [startQuery, setStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [startStop, setStartStop] = useState<Stop | null>(null);
  const [destStop, setDestStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(false);
  const [routeFound, setRouteFound] = useState(false);

  const debouncedStartQuery = useDebounce(startQuery, 300);
  const debouncedDestQuery = useDebounce(destQuery, 300);

  const startSuggestions = debouncedStartQuery ? searchStops(debouncedStartQuery).slice(0, 5) : [];
  const destSuggestions = debouncedDestQuery ? searchStops(debouncedDestQuery).slice(0, 5) : [];

  const handleFindRoutes = async () => {
    if (!startStop || !destStop) {
      toast({
        title: 'Missing stops',
        description: 'Please select both start and destination stops',
        variant: 'destructive',
      });
      return;
    }

    console.log('Finding route between stops:', { 
      start: startStop.name, 
      end: destStop.name 
    });

    setLoading(true);
    setRouteFound(false);
    try {
      const segments = await routesService.findRoute(startStop, destStop);
      
      if (segments && Object.keys(segments).length > 0) {
        console.log('Route segments received:', segments);
        setRouteSegments(segments);
        setRouteFound(true);
        toast({
          title: 'Route found!',
          description: `Found ${Object.keys(segments).length} segment(s) for your journey`,
        });
      } else {
        toast({
          title: 'No route found',
          description: 'Could not find a route between these stops',
          variant: 'destructive',
        });
        setRouteSegments(null);
      }
    } catch (error) {
      console.error('Failed to find route:', error);
      toast({
        title: 'Error',
        description: 'Failed to find route. Please try again.',
        variant: 'destructive',
      });
      setRouteSegments(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFields = () => {
    setStartQuery('');
    setDestQuery('');
    setStartStop(null);
    setDestStop(null);
    setRouteFound(false);
    setRouteSegments(null);
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
                        setStartStop(stop);
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
                        setDestStop(stop);
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
                disabled={!startStop || !destStop || loading}
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

            {/* Route Found Message */}
            {routeFound && (
              <div className="mt-6">
                <Card className="p-5 bg-primary/10 border-primary">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-primary mb-2">
                      ✓ Route found and displayed on map!
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The route is now shown on the map with different colors for each segment.
                    </div>
                    <Button
                      onClick={onClose}
                      className="mt-4"
                      variant="outline"
                    >
                      Close & View Map
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

