import { Event } from '@/types';
import { getIncidentIcon } from '@/utils/helpers';

export type TooltipType = 'event';

interface MapTooltipProps {
  event: Event;
  type: TooltipType;
}

export function MapTooltip({ event, type }: MapTooltipProps) {
  if (type === 'event') {
    const emoji = getIncidentIcon(event.type);
    return (
      <div className="p-3">
      </div>
    );
  }

  return null;
}

// Helper function to create HTML string for Leaflet popup
export function createTooltipHTML(event: Event, type: TooltipType): string {
  if (type === 'event') {
    const emoji = getIncidentIcon(event.type);
    return `
      <div>
      
      </div>
    `;
  }

  return '';
}

