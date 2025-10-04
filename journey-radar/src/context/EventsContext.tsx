import { createContext, useState, useEffect, ReactNode } from 'react';
import { Event, EventFilters } from '@/types';
import { eventsService, CreateEventPayload } from '@/services/eventsService';

export interface EventsContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: CreateEventPayload) => Promise<void>;
  voteOnEvent: (eventId: string, voteType: 'up' | 'down') => Promise<void>;
  filterEvents: (filters: EventFilters) => Event[];
}

export const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching events from API...');
      const data = await eventsService.getAllEvents();
      console.log('Events fetched:', data);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventPayload: CreateEventPayload) => {
    setLoading(true);
    setError(null);
    try {
      await eventsService.createEvent(eventPayload);
      await fetchEvents(); // Refresh events after creating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const voteOnEvent = async (eventId: string, voteType: 'up' | 'down') => {
    try {
      // Generate a temporary userId (in production, this would come from auth)
      const userId = localStorage.getItem('userId') || 'anonymous_' + Date.now();
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
      }
      
      await eventsService.voteOnEvent({ 
        eventId, 
        userId,
        voteType: voteType === 'up' ? 'upvote' : 'downvote'
      });
      await fetchEvents(); // Refresh events after voting
    } catch (err) {
      console.error('Failed to vote on event:', err);
      throw err;
    }
  };

  const filterEvents = (filters: EventFilters): Event[] => {
    let filtered = [...events];

    if (filters.status === 'active') {
      filtered = filtered.filter((event) => !event.isResolved);
    } else if (filters.status === 'resolved') {
      filtered = filtered.filter((event) => event.isResolved);
    }

    if (filters.routeId) {
      filtered = filtered.filter((event) => event.routeId === filters.routeId);
    }

    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (filters.sortBy === 'mostVoted') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    }

    return filtered;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventsContextType = {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    voteOnEvent,
    filterEvents,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}


