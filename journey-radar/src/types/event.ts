export enum IncidentType {
  DELAY = 'delay',
  CANCELLATION = 'cancellation',
  CROWDING = 'crowding',
  TECHNICAL_ISSUE = 'technical_issue',
  ACCIDENT = 'accident',
  ROAD_WORKS = 'road_works',
  WEATHER = 'weather',
  OTHER = 'other'
}

export interface Event {
  id: string;
  type: IncidentType;
  title: string;          // Brief incident description
  description: string;    // Detailed incident information
  timestamp: Date;        // When the incident was reported
  location: {
    lat: number;
    lng: number;          // Backend uses 'lng' not 'lon'
  };
  routeId?: string;       // ID of affected route (optional)
  upvotes: number;        // Number of users confirming legitimacy
  downvotes: number;      // Number of users disputing legitimacy
  isResolved: boolean;    // Whether incident is still active
  reportedBy: string;     // User identifier (can be anonymous)
  edge_affected?: number; // Edge affected by the event
}

export interface EventFilters {
  status?: 'all' | 'active' | 'resolved';
  routeId?: string;
  sortBy?: 'recent' | 'mostVoted';
}

