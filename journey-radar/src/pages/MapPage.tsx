import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { Header } from '@/components/layout/Header';
import { RouteSelectorPanel } from '@/components/route/RouteSelectorPanel';
import { ReportIncidentModal } from '@/components/incident/ReportIncidentModal';
import { IncidentDetailModal } from '@/components/incident/IncidentDetailModal';
import { ActionButtonsMenu } from '@/components/common/ActionButtonsMenu';
import { ChatbotModal } from '@/components/common/ChatbotModal';
import { useEvents } from '@/hooks/useEvents';
import { useRoutes } from '@/hooks/useRoutes';
import { useGeolocation } from '@/hooks/useGeolocation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { X, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MapPage() {
  const { events } = useEvents();
  const { selectedRoute, clearSelectedRoute } = useRoutes();
  const { latitude, longitude } = useGeolocation(true);

  const [routePanelOpen, setRoutePanelOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [pinPlacementMode, setPinPlacementMode] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const userLocation =
    latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  const handleStartPinPlacement = () => {
    // Initialize pin at user location or map center
    const initialLocation = userLocation || { lat: 50.0647, lng: 19.9450 };
    setPinnedLocation(initialLocation);
    setPinPlacementMode(true);
  };

  const handleConfirmPin = () => {
    setPinPlacementMode(false);
    setReportModalOpen(true);
  };

  const handleCancelPin = () => {
    setPinPlacementMode(false);
    setPinnedLocation(null);
  };

  const handlePinMoved = (location: { lat: number; lng: number }) => {
    setPinnedLocation(location);
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
    setPinnedLocation(null);
  };

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
            pinPlacementMode={pinPlacementMode}
            pinnedLocation={pinnedLocation}
            onPinPlaced={handlePinMoved}
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

        {/* Pin Placement Instructions */}
        {pinPlacementMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] animate-in slide-in-from-top duration-300">
            <div className="bg-card border-2 border-red-500 shadow-lg rounded-lg px-6 py-3 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-card-foreground">
                Drag the pin or click on the map to set incident location
              </span>
            </div>
          </div>
        )}

        {/* Pin Placement Controls */}
        {pinPlacementMode && (
          <div className="absolute bottom-24 right-6 z-[1100] flex flex-col gap-3 md:bottom-6">
            <Button
              size="lg"
              className="rounded-full shadow-lg h-14 px-6"
              onClick={handleConfirmPin}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm Location
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-lg h-14 px-6"
              onClick={handleCancelPin}
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        )}

        {/* Action Buttons Menu */}
        {!pinPlacementMode && (
          <div className="absolute bottom-24 right-6 z-[1100] md:bottom-6">
            <ActionButtonsMenu
              onReportClick={handleStartPinPlacement}
              onChatbotClick={() => setChatbotModalOpen(true)}
            />
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Modals */}
      <RouteSelectorPanel
        isOpen={routePanelOpen}
        onClose={() => setRoutePanelOpen(false)}
      />
      <ReportIncidentModal
        isOpen={reportModalOpen}
        onClose={handleCloseReportModal}
        pinnedLocation={pinnedLocation}
      />
      <IncidentDetailModal
        event={selectedEvent}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
      <ChatbotModal
        isOpen={chatbotModalOpen}
        onClose={() => setChatbotModalOpen(false)}
      />
    </div>
  );
}

