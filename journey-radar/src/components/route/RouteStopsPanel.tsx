import { X, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RouteSegments } from '@/services/routesService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface RouteStopsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  routeSegments: RouteSegments | null;
}

export function RouteStopsPanel({ isOpen, onClose, routeSegments }: RouteStopsPanelProps) {
  if (!isOpen) return null;

  // Extract all stops from all segments in order
  const getAllStops = () => {
    if (!routeSegments) return [];
    
    const allStops: Array<{
      code: string;
      name: string;
      lat: number;
      lon: number;
      segmentNumber: string;
      segmentName: string;
      isTransfer: boolean;
    }> = [];

    const entries = Object.entries(routeSegments);
    
    entries.forEach(([segmentId, segment], segmentIndex) => {
      segment.stops.forEach((stop, stopIndex) => {
        // Check if this is a transfer point (last stop of one segment, first of next)
        const isTransfer = 
          stopIndex === segment.stops.length - 1 && 
          segmentIndex < entries.length - 1;

        allStops.push({
          code: stop.code,
          name: stop.name,
          lat: stop.lat,
          lon: stop.lon,
          segmentNumber: segment.number || `${segmentId}`,
          segmentName: segment.name,
          isTransfer,
        });
      });
    });

    return allStops;
  };

  const stops = getAllStops();
  const totalSegments = routeSegments ? Object.keys(routeSegments).length : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[1002] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-card border-r border-border z-[1003] shadow-2xl transition-all transform animate-in slide-in-from-left duration-300 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-border bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Route Stops
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {stops.length} stop{stops.length !== 1 ? 's' : ''} across {totalSegments} segment{totalSegments !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Stops List - Scrollable Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {stops.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No stops to display
                </div>
              ) : (
                stops.map((stop, index) => (
                  <div key={`${stop.code}-${index}`}>
                    <div
                      className={`
                        p-3 rounded-lg border transition-all hover:bg-secondary/50
                        ${stop.isTransfer 
                          ? 'bg-warning/10 border-warning/30' 
                          : 'bg-card border-border'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Stop Number Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>

                        {/* Stop Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-card-foreground truncate">
                                {stop.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Stop {stop.code}
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20"
                            >
                              Line {stop.segmentNumber}
                            </Badge>
                          </div>
                          
                          {/* Coordinates */}
                          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {stop.lat.toFixed(4)}, {stop.lon.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      {/* Transfer Notice */}
                      {stop.isTransfer && (
                        <div className="mt-2 pt-2 border-t border-warning/20">
                          <div className="flex items-center gap-2 text-xs font-medium text-warning">
                            <ArrowRight className="w-3 h-3" />
                            Transfer point - Switch lines here
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < stops.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-0.5 h-4 bg-border"></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground text-center">
            Click outside to close or use the ✕ button
          </div>
        </div>
      </div>
    </>
  );
}

