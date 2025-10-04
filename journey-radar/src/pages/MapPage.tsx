import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { Header } from '@/components/layout/Header';
import { RouteSelectorPanel } from '@/components/route/RouteSelectorPanel';
import { ReportIncidentModal } from '@/components/incident/ReportIncidentModal';
import { IncidentDetailModal } from '@/components/incident/IncidentDetailModal';
import { ReportButton } from '@/components/common/ReportButton';
import { useEvents } from '@/hooks/useEvents';
import { useRoutes } from '@/hooks/useRoutes';
import { useGeolocation } from '@/hooks/useGeolocation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MapPage() {
  const { events } = useEvents();
  const { selectedRoute, clearSelectedRoute } = useRoutes();
  const { latitude, longitude } = useGeolocation(true);

  const [routePanelOpen, setRoutePanelOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const userLocation =
    latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onRoutesClick={() => setRoutePanelOpen(true)} />
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <MapView
            events={events}
            selectedRoute={selectedRoute}
            userLocation={userLocation}
            onMarkerClick={setSelectedEventId}
          />
        </div>

        {/* Selected Route Badge */}
        {selectedRoute && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999] animate-in slide-in-from-top duration-300">
            <div className="bg-card border-2 border-primary shadow-lg rounded-full px-6 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {selectedRoute.number}
                </div>
                <div className="text-sm font-semibold text-card-foreground">
                  {selectedRoute.name}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full hover:bg-destructive/20"
                onClick={clearSelectedRoute}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Report Problem Button */}
        <div className="absolute bottom-6 right-6 z-[1100]">
          <ReportButton onClick={() => setReportModalOpen(true)} />
        </div>
      </div>

      <BottomNavigation />

      {/* Modals */}
      <RouteSelectorPanel
        isOpen={routePanelOpen}
        onClose={() => setRoutePanelOpen(false)}
      />
      <ReportIncidentModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
      <IncidentDetailModal
        event={selectedEvent}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </div>
  );
}

