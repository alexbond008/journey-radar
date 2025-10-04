import api from './api';
import { Event, IncidentType } from '@/types';

export interface CreateEventPayload {
  type: IncidentType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  reportedBy: string;
}

export interface VotePayload {
  eventId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
}

interface EventResponse {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  routeId?: string;
  upvotes: number;
  downvotes: number;
  isResolved: boolean;
  reportedBy: string;
  edge_affected?: number;
}

export const eventsService = {
  // Get all events with optional filtering
  async getAllEvents(params?: {
    route_id?: string;
    incident_type?: IncidentType;
    is_resolved?: boolean;
    limit?: number;
  }): Promise<Event[]> {
    const response = await api.get<EventResponse[]>('/info/get_events', { params });
    // Convert timestamp strings to Date objects and normalize location
    return response.data.map((event) => ({
      ...event,
      timestamp: new Date(event.timestamp),
      location: {
        lat: event.location.lat,
        lng: event.location.lng,
      },
    }));
  },

  // Get events for a specific route
  async getEventsForRoute(routeId: string): Promise<Event[]> {
    const response = await api.get<EventResponse[]>(`/info/get_events_for_route/${routeId}`);
    return response.data.map((event) => ({
      ...event,
      timestamp: new Date(event.timestamp),
      location: {
        lat: event.location.lat,
        lng: event.location.lng,
      },
    }));
  },

  // Create new event
  async createEvent(event: CreateEventPayload): Promise<Event> {
    const response = await api.post<EventResponse>('/info/report_event', event);
    return {
      ...response.data,
      timestamp: new Date(response.data.timestamp),
    };
  },

  // Vote on event
  async voteOnEvent(payload: VotePayload): Promise<Event> {
    const response = await api.post<EventResponse>('/info/vote_event', payload);
    return {
      ...response.data,
      timestamp: new Date(response.data.timestamp),
    };
  },

  // Mark event as resolved
  async resolveEvent(eventId: string): Promise<Event> {
    const response = await api.patch<EventResponse>(`/info/resolve_event/${eventId}`);
    return {
      ...response.data,
      timestamp: new Date(response.data.timestamp),
    };
  },

  // Get statistics
  async getStats() {
    const response = await api.get('/info/stats');
    return response.data;
  },
};


