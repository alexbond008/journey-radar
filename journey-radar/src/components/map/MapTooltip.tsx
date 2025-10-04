import { Event } from '@/types';
import { MessageCircle, Info } from 'lucide-react';

export type TooltipType = 'event' | 'chat';

interface MapTooltipProps {
  event: Event;
  type: TooltipType;
  onChatClick?: () => void;
}

export function MapTooltip({ event, type, onChatClick }: MapTooltipProps) {
  if (type === 'event') {
    return (
      <div className="p-3 min-w-[200px]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <strong className="text-sm font-semibold text-gray-900">
              {event.type.toUpperCase().replace('_', ' ')}
            </strong>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{event.title}</p>
        <button
          onClick={onChatClick}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          Chat about this event
        </button>
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className="p-3 min-w-[200px]">
        <div className="flex items-start gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm font-semibold text-gray-900 block mb-1">
              Ask about this incident
            </strong>
            <p className="text-xs text-gray-600">
              Get real-time information and updates
            </p>
          </div>
        </div>
        <button
          onClick={onChatClick}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          Start Chat
        </button>
      </div>
    );
  }

  return null;
}

// Helper function to create HTML string for Leaflet popup
export function createTooltipHTML(event: Event, type: TooltipType): string {
  if (type === 'event') {
    return `
      <div style="padding: 12px; min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: start; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg style="width: 16px; height: 16px; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
              <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round"></path>
            </svg>
            <strong style="font-size: 14px; font-weight: 600; color: #111827;">
              ${event.type.toUpperCase().replace(/_/g, ' ')}
            </strong>
          </div>
        </div>
        <p style="font-size: 14px; color: #374151; margin-bottom: 12px;">${event.title}</p>
        <button 
          onclick="window.mapTooltipHandlers.openChat('${event.id}')"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 12px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#1d4ed8'"
          onmouseout="this.style.backgroundColor='#2563eb'"
        >
          <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          Chat about this event
        </button>
      </div>
    `;
  }

  if (type === 'chat') {
    return `
      <div style="padding: 12px; min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 12px;">
          <svg style="width: 20px; height: 20px; color: #3b82f6; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <div>
            <strong style="font-size: 14px; font-weight: 600; color: #111827; display: block; margin-bottom: 4px;">
              Ask about this incident
            </strong>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Get real-time information and updates
            </p>
          </div>
        </div>
        <button 
          onclick="window.mapTooltipHandlers.openChat('${event.id}')"
          style="
            width: 100%;
            padding: 8px 12px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#1d4ed8'"
          onmouseout="this.style.backgroundColor='#2563eb'"
        >
          Start Chat
        </button>
      </div>
    `;
  }

  return '';
}

