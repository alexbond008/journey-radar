import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Event } from '@/types';
import { getIncidentIcon } from '@/utils/helpers';
import { BusRoute } from '@/types';
import { createTooltipHTML, TooltipType } from './MapTooltip';
import { RouteSegments } from '@/services/routesService';

interface MapViewProps {
  events: Event[];
  selectedRoute: BusRoute | null;
  routeSegments?: RouteSegments | null;
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick?: (eventId: string) => void;
  onChatClick?: (eventId: string) => void;
  pinPlacementMode?: boolean;
  pinnedLocation?: { lat: number; lng: number } | null;
  onPinPlaced?: (location: { lat: number; lng: number }) => void;
  tooltipType?: TooltipType;
  onMapReady?: (centerRoute: () => void) => void;
}

export function MapView({ events, selectedRoute, routeSegments, userLocation, onMarkerClick, onChatClick, pinPlacementMode, pinnedLocation, onPinPlaced, tooltipType = 'event', onMapReady }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const stopMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeSegmentPolylinesRef = useRef<L.Polyline[]>([]);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Store callback refs to avoid stale closures
  const onMarkerClickRef = useRef(onMarkerClick);
  const onChatClickRef = useRef(onChatClick);
  const onPinPlacedRef = useRef(onPinPlaced);
  const onMapReadyRef = useRef(onMapReady);

  // Update refs when callbacks change
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
    onChatClickRef.current = onChatClick;
    onPinPlacedRef.current = onPinPlaced;
    onMapReadyRef.current = onMapReady;
  }, [onMarkerClick, onChatClick, onPinPlaced, onMapReady]);

  useEffect(() => {
    setIsClient(true);
    
    // Set up global handlers for tooltip interactions
    if (typeof window !== 'undefined') {
      (window as any).mapTooltipHandlers = {
        openChat: (eventId: string) => {
          if (onChatClickRef.current) {
            onChatClickRef.current(eventId);
          }
        },
      };
    }

    return () => {
      // Cleanup
      if (typeof window !== 'undefined') {
        delete (window as any).mapTooltipHandlers;
      }
    };
  }, []);

  // Function to center the map on the current route
  const centerOnRoute = () => {
    if (!mapInstanceRef.current) return;

    // Center on route segments if available
    if (routeSegmentPolylinesRef.current.length > 0) {
      const allBounds: L.LatLngBounds[] = [];
      routeSegmentPolylinesRef.current.forEach(polyline => {
        allBounds.push(polyline.getBounds());
      });
      
      if (allBounds.length > 0) {
        const combinedBounds = allBounds.reduce((acc, bounds) => acc.extend(bounds), allBounds[0]);
        mapInstanceRef.current.fitBounds(combinedBounds, {
          padding: [50, 50],
        });
        console.log('Map centered on route segments');
      }
    }
    // Otherwise center on single route if available
    else if (routePolylineRef.current) {
      const bounds = routePolylineRef.current.getBounds();
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
      });
      console.log('Map centered on route');
    }
  };

  // Expose centerOnRoute function to parent component
  useEffect(() => {
    if (onMapReadyRef.current && mapInstanceRef.current) {
      onMapReadyRef.current(centerOnRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSegments, selectedRoute]);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    const initMap = async () => {
      // Initialize map only once
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!, {
          center: [50.0647, 19.9450],
          zoom: 13,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3,
        }).addTo(mapInstanceRef.current);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add event markers
      console.log('Adding', events.length, 'event markers to map');
      events.forEach((event) => {
        console.log('Event marker:', {
          id: event.id,
          type: event.type,
          location: event.location
        });
        
        // Validate coordinates
        if (!event.location || typeof event.location.lat !== 'number' || typeof event.location.lng !== 'number') {
          console.error('Invalid event location:', event);
          return;
        }
        
        const emoji = getIncidentIcon(event.type);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 44px;
              height: 44px;
              background-color: rgba(255, 255, 255, 0.95);
              border: 3px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              transition: transform 0.2s;
              font-size: 24px;
            ">
              ${emoji}
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker([event.location.lat, event.location.lng], { icon }).addTo(
          mapInstanceRef.current!
        );

        // Bind the generic tooltip based on the tooltip type
        const tooltipHTML = createTooltipHTML(event, tooltipType);
        marker.bindPopup(tooltipHTML, {
          maxWidth: 300,
          className: 'custom-map-popup',
        });

        marker.on('click', () => {
          if (onMarkerClickRef.current) {
            onMarkerClickRef.current(event.id);
          }
        });

        markersRef.current.push(marker);
      });
      
      console.log('Added', markersRef.current.length, 'event markers');

      // Clear existing stop markers
      stopMarkersRef.current.forEach((marker) => marker.remove());
      stopMarkersRef.current = [];

      // Draw route segments if provided (from route finding)
      if (routeSegments && Object.keys(routeSegments).length > 0) {
        console.log('Drawing route segments:', Object.keys(routeSegments).length);
        
        // Remove existing route polylines
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
          routePolylineRef.current = null;
        }
        routeSegmentPolylinesRef.current.forEach(polyline => polyline.remove());
        routeSegmentPolylinesRef.current = [];

        // Define colors for different segments
        const segmentColors = [
          '#3b82f6', // blue
          '#ef4444', // red
          '#22c55e', // green
          '#f59e0b', // amber
          '#8b5cf6', // violet
          '#ec4899', // pink
          '#14b8a6', // teal
          '#f97316', // orange
        ];

        const allBounds: L.LatLngBounds[] = [];
        let globalStopIndex = 0;

        // Draw each segment with a different color
        Object.entries(routeSegments).forEach(([segmentId, segment], index) => {
          console.log(`Drawing segment ${segmentId}:`, segment.name, `with ${segment.stops.length} stops`);
          
          if (segment.stops && segment.stops.length > 0) {
            const segmentColor = segmentColors[index % segmentColors.length];
            
            // Generate polyline from stops
            const routeCoordinates: [number, number][] = segment.stops.map(stop => 
              [stop.lat, stop.lon] as [number, number]
            );

            // Draw segment polyline
            const polyline = L.polyline(routeCoordinates, {
              color: segmentColor,
              weight: 6,
              opacity: 0.8,
              smoothFactor: 1,
            }).addTo(mapInstanceRef.current!);

            // Add popup to polyline showing line info
            polyline.bindPopup(`
              <div style="color: #000; padding: 8px;">
                <strong style="font-size: 14px;">Segment ${parseInt(segmentId)}</strong>
                <p style="margin: 4px 0 0 0; font-size: 12px;">Line: ${segment.number || segment.id} - ${segment.name}</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #666;">${segment.stops.length} stops</p>
              </div>
            `);

            routeSegmentPolylinesRef.current.push(polyline);
            allBounds.push(polyline.getBounds());

            // Add stop markers along the segment
            segment.stops.forEach((stop, stopIndex) => {
              const isTransferStop = stopIndex === 0 && parseInt(segmentId) > 1;
              const isLastStop = stopIndex === segment.stops.length - 1 && 
                                  parseInt(segmentId) === Object.keys(routeSegments).length;
              
              const stopIcon = L.divIcon({
                className: 'stop-marker',
                html: `
                  <div style="
                    width: ${isTransferStop || isLastStop ? '20px' : '16px'};
                    height: ${isTransferStop || isLastStop ? '20px' : '16px'};
                    background-color: white;
                    border: 3px solid ${segmentColor};
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    ${isTransferStop ? 'border-width: 4px;' : ''}
                  "></div>
                `,
                iconSize: [isTransferStop || isLastStop ? 20 : 16, isTransferStop || isLastStop ? 20 : 16],
                iconAnchor: [isTransferStop || isLastStop ? 10 : 8, isTransferStop || isLastStop ? 10 : 8],
              });

              const stopMarker = L.marker([stop.lat, stop.lon], { icon: stopIcon }).addTo(
                mapInstanceRef.current!
              );

              const stopLabel = isTransferStop 
                ? 'Transfer Stop' 
                : isLastStop 
                  ? 'Destination' 
                  : stopIndex === 0 && parseInt(segmentId) === 1 
                    ? 'Start' 
                    : `Stop ${globalStopIndex + 1}`;

              stopMarker.bindPopup(`
                <div style="color: #000; padding: 8px; min-width: 140px;">
                  <strong style="font-size: 13px; display: block; margin-bottom: 4px; color: ${segmentColor};">
                    ${stopLabel}
                  </strong>
                  <p style="margin: 0; font-size: 12px; color: #555;">${stop.name}</p>
                  <p style="margin: 2px 0 0 0; font-size: 11px; color: #888;">Code: ${stop.code}</p>
                  <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">
                    Segment ${parseInt(segmentId)}: Line ${segment.number || segment.id}
                  </p>
                </div>
              `);

              stopMarkersRef.current.push(stopMarker);
              globalStopIndex++;
            });
          }
        });

        // Fit map to show all segments
        if (allBounds.length > 0) {
          const combinedBounds = allBounds.reduce((acc, bounds) => acc.extend(bounds), allBounds[0]);
          mapInstanceRef.current!.fitBounds(combinedBounds, {
            padding: [50, 50],
          });
          console.log('Map fitted to show all route segments');
        }
      } 
      // Draw route polyline if selected (single route)
      else if (selectedRoute) {
        console.log('Drawing route:', selectedRoute.number, selectedRoute.name);
        console.log('Route has', selectedRoute.stops?.length || 0, 'stops');
        
        // Remove existing route polylines
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
          routePolylineRef.current = null;
        }
        routeSegmentPolylinesRef.current.forEach(polyline => polyline.remove());
        routeSegmentPolylinesRef.current = [];

        // Generate polyline from stops if polyline property doesn't exist or is empty
        let routeCoordinates: [number, number][] = [];
        
        if (selectedRoute.polyline && selectedRoute.polyline.length > 0) {
          console.log('Using provided polyline with', selectedRoute.polyline.length, 'points');
          routeCoordinates = selectedRoute.polyline;
        } else if (selectedRoute.stops && selectedRoute.stops.length > 0) {
          console.log('Generating polyline from', selectedRoute.stops.length, 'stops');
          // Generate polyline from stops coordinates
          routeCoordinates = selectedRoute.stops.map(stop => [stop.lat, stop.lon] as [number, number]);
        }

        if (routeCoordinates.length > 0) {
          // Draw new route polyline
          routePolylineRef.current = L.polyline(routeCoordinates, {
            color: '#eab308',
            weight: 6,
            opacity: 0.8,
            smoothFactor: 1,
          }).addTo(mapInstanceRef.current!);

          console.log('Polyline added to map with', routeCoordinates.length, 'points');

          // Add stop markers along the route
          if (selectedRoute.stops && selectedRoute.stops.length > 0) {
            selectedRoute.stops.forEach((stop, index) => {
              const stopIcon = L.divIcon({
                className: 'stop-marker',
                html: `
                  <div style="
                    width: 16px;
                    height: 16px;
                    background-color: white;
                    border: 3px solid #eab308;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                  "></div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              });

              const stopMarker = L.marker([stop.lat, stop.lon], { icon: stopIcon }).addTo(
                mapInstanceRef.current!
              );

              stopMarker.bindPopup(`
                <div style="color: #000; padding: 8px; min-width: 120px;">
                  <strong style="font-size: 13px; display: block; margin-bottom: 4px;">
                    Stop ${index + 1}
                  </strong>
                  <p style="margin: 0; font-size: 12px; color: #555;">${stop.name}</p>
                  <p style="margin: 2px 0 0 0; font-size: 11px; color: #888;">Code: ${stop.code}</p>
                </div>
              `);

              stopMarkersRef.current.push(stopMarker);
            });
            
            console.log('Added', selectedRoute.stops.length, 'stop markers');
          }

          // Fit map to show entire route
          const bounds = routePolylineRef.current.getBounds();
          console.log('Fitting map to bounds:', bounds);
          mapInstanceRef.current!.fitBounds(bounds, {
            padding: [50, 50],
          });
          
          console.log('Map centered on route');
        } else {
          console.log('No valid polyline or stops data available');
        }
      } else {
        console.log('No route or segments selected');
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
          routePolylineRef.current = null;
        }
        routeSegmentPolylinesRef.current.forEach(polyline => polyline.remove());
        routeSegmentPolylinesRef.current = [];
      }

      // Add user location marker
      if (userLocation) {
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="
                position: absolute;
                width: 24px;
                height: 24px;
                background-color: #3b82f6;
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.6), 0 0 0 2px rgba(59, 130, 246, 0.3);
                animation: pulse 2s infinite;
              "></div>
            </div>
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
            </style>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
        }).addTo(mapInstanceRef.current!);
      }

      // Handle pin placement mode
      if (pinPlacementMode && mapInstanceRef.current) {
        // Remove existing pin marker
        if (pinMarkerRef.current) {
          pinMarkerRef.current.remove();
          pinMarkerRef.current = null;
        }

        // Create a draggable pin icon
        const pinIcon = L.divIcon({
          className: 'pin-marker',
          html: `
            <div style="
              width: 48px;
              height: 48px;
              position: relative;
            ">
              <div style="
                width: 40px;
                height: 40px;
                background-color: #ef4444;
                border: 4px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                position: absolute;
                top: 0;
                left: 4px;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6), 0 0 0 2px rgba(239, 68, 68, 0.3);
                cursor: move;
              ">
                <div style="
                  width: 16px;
                  height: 16px;
                  background-color: white;
                  border-radius: 50%;
                  position: absolute;
                  top: 8px;
                  left: 8px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                "></div>
              </div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 40],
        });

        // Use pinnedLocation if available, otherwise use map center or user location
        const initialLocation = pinnedLocation || 
          (userLocation ? [userLocation.lat, userLocation.lng] : mapInstanceRef.current!.getCenter());
        
        const latLng = Array.isArray(initialLocation) 
          ? initialLocation as [number, number]
          : [initialLocation.lat, initialLocation.lng] as [number, number];

        pinMarkerRef.current = L.marker(latLng, {
          icon: pinIcon,
          draggable: true,
          autoPan: true,
        }).addTo(mapInstanceRef.current!);

        // Notify parent when pin is dragged
        pinMarkerRef.current.on('dragend', () => {
          if (pinMarkerRef.current && onPinPlacedRef.current) {
            const position = pinMarkerRef.current.getLatLng();
            onPinPlacedRef.current({ lat: position.lat, lng: position.lng });
          }
        });

        // Allow clicking on map to move pin
        const mapClickHandler = (e: L.LeafletMouseEvent) => {
          if (pinMarkerRef.current) {
            pinMarkerRef.current.setLatLng(e.latlng);
            if (onPinPlacedRef.current) {
              onPinPlacedRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
          }
        };

        mapInstanceRef.current.on('click', mapClickHandler);

        // Cleanup function for map click handler
        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.off('click', mapClickHandler);
          }
        };
      } else if (pinMarkerRef.current) {
        // Remove pin marker if not in placement mode
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }
      
      // Auto-zoom to show all markers if no route is selected
      if (!selectedRoute && markersRef.current.length > 0) {
        console.log('Auto-zooming to show', markersRef.current.length, 'event markers');
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current!.fitBounds(group.getBounds(), {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    };

    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, events, selectedRoute, routeSegments, userLocation, pinPlacementMode, pinnedLocation, tooltipType]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}

