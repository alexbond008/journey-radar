import { useState } from 'react';
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
  pinnedLocation: { lat: number; lng: number } | null;
}

export function ReportIncidentModal({ isOpen, onClose, pinnedLocation }: ReportIncidentModalProps) {
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);

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
    if (loading || !pinnedLocation) return;

    const incident = incidentTypes.find(i => i.value === selectedType);
    if (!incident) return;

    setLoading(true);
    try {
      await createEvent({
        type: selectedType as IncidentType,
        title: incident.label,
        description: `${incident.label} reported by user`,
        location: pinnedLocation,
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
            Select the type of incident at the pinned location
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select 
            onValueChange={handleSelectIncident} 
            disabled={loading || !pinnedLocation}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  loading ? "Submitting..." : 
                  !pinnedLocation ? "No location pinned" :
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

