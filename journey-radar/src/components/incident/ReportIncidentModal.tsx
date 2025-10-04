import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { useRoutes } from '@/hooks/useRoutes';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIncidentModal({ isOpen, onClose }: ReportIncidentModalProps) {
  const { createEvent } = useEvents();
  const { routes } = useRoutes();
  const { latitude, longitude } = useGeolocation(false);

  const [type, setType] = useState<IncidentType | ''>('');
  const [routeId, setRouteId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const incidentTypes = [
    { value: IncidentType.DELAY, label: 'Delay', icon: '🕒' },
    { value: IncidentType.CROWDING, label: 'Crowding', icon: '👥' },
    { value: IncidentType.SAFETY, label: 'Safety Issue', icon: '⚠️' },
    { value: IncidentType.ROUTE_CHANGE, label: 'Route Change', icon: '↪️' },
    { value: IncidentType.ACCIDENT, label: 'Accident', icon: '🚨' },
    { value: IncidentType.BREAKDOWN, label: 'Breakdown', icon: '🔧' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !routeId || !title) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        type: type as string,
        title,
        description,
        timestamp: new Date().toISOString(),
        location: {
          lat: latitude || 50.0647,
          lon: longitude || 19.9450,
        },
        routeId,
        reportedBy: 'anonymous',
      });

      toast.success('Incident reported successfully');
      onClose();
      
      // Reset form
      setType('');
      setRouteId('');
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
          <DialogDescription>
            Help others by reporting incidents on your route
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Incident Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as IncidentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
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

          <div>
            <Label htmlFor="route">Affected Route *</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.number} - {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {title.length}/100 characters
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {description.length}/500 characters
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Location: {latitude && longitude
              ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : 'Using default location'}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !type || !routeId || !title}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

