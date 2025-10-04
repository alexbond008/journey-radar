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

export function MapPage() {
  const { events } = useEvents();
  const { selectedRoute } = useRoutes();
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
        <MapView
          events={events}
          selectedRoute={selectedRoute}
          userLocation={userLocation}
          onMarkerClick={setSelectedEventId}
        />

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

