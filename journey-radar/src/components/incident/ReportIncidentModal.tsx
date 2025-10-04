import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncidentType } from '@/types';
import { useEvents } from '@/hooks/useEvents';
import { toast } from 'sonner';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIncidentModal({ isOpen, onClose }: ReportIncidentModalProps) {
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user's current location when modal opens
  useEffect(() => {
    if (isOpen && !currentLocation) {
      setLocationLoading(true);
      
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback to Krakow coordinates
            setCurrentLocation({
              lat: 50.0647,
              lng: 19.9450,
            });
            setLocationLoading(false);
            toast.info('Using default location (Krakow)');
          }
        );
      } else {
        // Fallback if geolocation is not supported
        setCurrentLocation({
          lat: 50.0647,
          lng: 19.9450,
        });
        setLocationLoading(false);
        toast.info('Geolocation not supported, using default location');
      }
    }
  }, [isOpen, currentLocation]);

  const incidentTypes = [
    { value: IncidentType.DELAY, label: 'Delay', icon: '🕒' },
    { value: IncidentType.CROWDING, label: 'Crowding', icon: '👥' },
    { value: IncidentType.ACCIDENT, label: 'Accident', icon: '🚨' },
    { value: IncidentType.TECHNICAL_ISSUE, label: 'Technical Issue', icon: '🔧' },
    { value: IncidentType.ROAD_WORKS, label: 'Road Works', icon: '🚧' },
    { value: IncidentType.WEATHER, label: 'Weather', icon: '🌧️' },
    { value: IncidentType.OTHER, label: 'Other', icon: '📌' },
  ];

  const handleSelectIncident = async (selectedType: string) => {
    if (loading || !currentLocation) return;

    const incident = incidentTypes.find(i => i.value === selectedType);
    if (!incident) return;

    setLoading(true);
    try {
      await createEvent({
        type: selectedType as IncidentType,
        title: incident.label,
        description: `${incident.label} reported by user`,
        location: currentLocation,
        reportedBy: 'anonymous',
      });

      toast.success('Incident reported successfully');
      onClose();
    } catch (error) {
      console.error('Error reporting incident:', error);
      toast.error('Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
          <DialogDescription>
            Select the type of incident you want to report
            {locationLoading && " (getting your location...)"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select 
            onValueChange={handleSelectIncident} 
            disabled={loading || locationLoading || !currentLocation}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  loading ? "Submitting..." : 
                  locationLoading ? "Getting location..." : 
                  "Select incident type"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {incidentTypes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.icon} {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}

