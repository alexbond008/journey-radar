import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { Header } from '@/components/layout/Header';
import { RouteSelectorPanel } from '@/components/route/RouteSelectorPanel';
import { RouteStopsPanel } from '@/components/route/RouteStopsPanel';
import { ReportIncidentModal } from '@/components/incident/ReportIncidentModal';
import { IncidentDetailModal } from '@/components/incident/IncidentDetailModal';
import { ActionButtonsMenu } from '@/components/common/ActionButtonsMenu';
import { ChatbotModal } from '@/components/common/ChatbotModal';
import { useEvents } from '@/hooks/useEvents';
import { useRoutes } from '@/hooks/useRoutes';
import { useGeolocation } from '@/hooks/useGeolocation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { X, Check, MapPin, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipType } from '@/components/map/MapTooltip';

export function MapPage() {
  const { events } = useEvents();
  const { selectedRoute, routeSegments, clearSelectedRoute } = useRoutes();
  const { latitude, longitude } = useGeolocation(true);

  const [routePanelOpen, setRoutePanelOpen] = useState(false);
  const [stopsPanelOpen, setStopsPanelOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [pinPlacementMode, setPinPlacementMode] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tooltipType] = useState<TooltipType>('event');
  const [chatEventContext, setChatEventContext] = useState<string | null>(null);
  const [centerRouteFunc, setCenterRouteFunc] = useState<(() => void) | null>(null);

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

  const handleChatClick = (eventId: string) => {
    setChatEventContext(eventId);
    setChatbotModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setChatbotModalOpen(false);
    setChatEventContext(null);
  };

  const handleMapReady = (centerRoute: () => void) => {
    setCenterRouteFunc(() => centerRoute);
  };

  const handleCenterOnRoute = () => {
    if (centerRouteFunc) {
      centerRouteFunc();
    }
  };

  const handleRoutePanelClose = () => {
    setRoutePanelOpen(false);
    // Center map on route after dialog closes and route is set
    // Use setTimeout to ensure the dialog closing animation doesn't interfere
    setTimeout(() => {
      if (centerRouteFunc && (routeSegments || selectedRoute)) {
        centerRouteFunc();
      }
    }, 100);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onRoutesClick={() => setRoutePanelOpen(true)} />
      
      {/* Selected Route Bar */}
      {selectedRoute && (
        <div className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm px-4 py-2.5 flex items-center justify-between z-[999] animate-in slide-in-from-top duration-300">
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-muted/50 rounded-md -ml-2 pl-2 py-1 transition-colors"
            onClick={handleCenterOnRoute}
            title="Click to center map on route"
          >
            <div className="w-9 h-9 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-sm shadow-sm">
              {selectedRoute.number}
            </div>
            <div>
              <div className="text-sm font-semibold text-card-foreground">
                {selectedRoute.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedRoute.stops.length} stops
                {selectedRoute.activeIncidentIds && selectedRoute.activeIncidentIds.length > 0 && (
                  <span className="ml-2 text-warning">
                    ⚠️ {selectedRoute.activeIncidentIds.length} incident(s)
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-md hover:bg-destructive/20"
            onClick={clearSelectedRoute}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Route Segments Bar */}
      {routeSegments && Object.keys(routeSegments).length > 0 && (
        <div className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm px-4 py-2.5 flex items-center justify-between z-[999] animate-in slide-in-from-top duration-300">
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-muted/50 rounded-md -ml-2 pl-2 py-1 transition-colors"
            onClick={handleCenterOnRoute}
            title="Click to center map on route"
          >
            <div className="w-9 h-9 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-sm shadow-sm">
              {Object.keys(routeSegments).length}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-card-foreground">
                {Object.entries(routeSegments).map(([segmentId, segment]: [string, any], index) => {
                  const isLastSegment = index === Object.entries(routeSegments).length - 1;
                  const startStop = segment.stops[0];
                  const endStop = segment.stops[segment.stops.length - 1];
                  
                  return (
                    <span key={segmentId}>
                      {startStop.name} → {endStop.name}
                      {!isLastSegment && (
                        <span className="text-xs text-warning mx-2">
                          🔄 Transit
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {Object.keys(routeSegments).length} segment(s)
                {Object.keys(routeSegments).length > 1 && (
                  <span className="ml-1">with {Object.keys(routeSegments).length - 1} transit(s)</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-md hover:bg-primary/10"
              onClick={() => setStopsPanelOpen(true)}
              title="View all stops"
            >
              <List className="w-4 h-4 mr-1" />
              Stops
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-md hover:bg-destructive/20"
              onClick={clearSelectedRoute}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <MapView
            events={events}
            selectedRoute={selectedRoute}
            routeSegments={routeSegments}
            userLocation={userLocation}
            onMarkerClick={setSelectedEventId}
            onChatClick={handleChatClick}
            pinPlacementMode={pinPlacementMode}
            pinnedLocation={pinnedLocation}
            onPinPlaced={handlePinMoved}
            tooltipType={tooltipType}
            onMapReady={handleMapReady}
          />
        </div>

        

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
        onClose={handleRoutePanelClose}
      />
      <RouteStopsPanel
        isOpen={stopsPanelOpen}
        onClose={() => setStopsPanelOpen(false)}
        routeSegments={routeSegments}
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
        onClose={handleCloseChatModal}
        eventContext={chatEventContext}
      />
    </div>
  );
}

