import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Event } from '@/types';
import { getIncidentColor } from '@/utils/helpers';
import { BusRoute } from '@/types';

interface MapViewProps {
  events: Event[];
  selectedRoute: BusRoute | null;
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick?: (eventId: string) => void;
}

export function MapView({ events, selectedRoute, userLocation, onMarkerClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const stopMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        
        const color = getIncidentColor(event.type);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background-color: ${color};
              border: 4px solid ${color}dd;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.3);
              cursor: pointer;
              transition: transform 0.2s;
            ">
              <div style="
                width: 14px;
                height: 14px;
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([event.location.lat, event.location.lng], { icon }).addTo(
          mapInstanceRef.current!
        );

        marker.bindPopup(`
          <div style="color: #000; padding: 8px; min-width: 150px;">
            <strong style="font-size: 14px; display: block; margin-bottom: 4px;">
              ${event.type.toUpperCase()}
            </strong>
            <p style="margin: 0; font-size: 13px; color: #555;">${event.title}</p>
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(event.id);
          }
        });

        markersRef.current.push(marker);
      });
      
      console.log('Added', markersRef.current.length, 'event markers');

      // Clear existing stop markers
      stopMarkersRef.current.forEach((marker) => marker.remove());
      stopMarkersRef.current = [];

      // Draw route polyline if selected
      if (selectedRoute && selectedRoute.polyline.length > 0) {
        console.log('Drawing route:', selectedRoute.number, selectedRoute.name);
        console.log('Route has', selectedRoute.polyline.length, 'polyline points');
        console.log('Route has', selectedRoute.stops.length, 'stops');
        
        // Remove existing route polyline
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
        }

        // Draw new route polyline
        routePolylineRef.current = L.polyline(selectedRoute.polyline, {
          color: '#eab308',
          weight: 6,
          opacity: 0.8,
          smoothFactor: 1,
        }).addTo(mapInstanceRef.current!);

        console.log('Polyline added to map');

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
        console.log('No route selected or empty polyline');
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
          routePolylineRef.current = null;
        }
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
  }, [isClient, events, selectedRoute, userLocation, onMarkerClick]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}

