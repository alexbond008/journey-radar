# Events Integration Summary

## Overview
Successfully integrated event fetching and display functionality between the backend (FastAPI) and frontend (React/TypeScript). Events (incidents) can now be reported, fetched, displayed, and voted on.

## Changes Made

### Backend Changes (`fastapi_app/`)

#### 1. `routers/info_route.py`
**Fixed type conversion issues for event IDs:**

- **`vote_event` endpoint (line 215-236):**
  - Added conversion from string `eventId` to integer for proper event lookup
  - Added error handling for invalid event IDs
  
  ```python
  try:
      event_id_int = int(vote_data.eventId)
  except ValueError:
      raise HTTPException(status_code=400, detail=f"Invalid event ID: {vote_data.eventId}")
  ```

- **`resolve_event` endpoint (line 238-252):**
  - Added conversion from string `event_id` to integer for proper event lookup
  - Added error handling for invalid event IDs
  
  ```python
  try:
      event_id_int = int(event_id)
  except ValueError:
      raise HTTPException(status_code=400, detail=f"Invalid event ID: {event_id}")
  ```

**Why:** The backend Event model uses `id: int`, but the frontend sends event IDs as strings. This ensures proper type conversion and comparison.

### Frontend Changes (`journey-radar/src/`)

#### 1. `services/eventsService.ts`
**Fixed type mismatch between backend and frontend:**

- **`EventResponse` interface (line 22-38):**
  - Changed `id` type from `string` to `number` to match backend response
  
  ```typescript
  interface EventResponse {
    id: number;  // Backend returns id as number
    // ... rest of fields
  }
  ```

- **All service methods:**
  - Added `id` conversion from number to string in all response mapping functions:
    - `getAllEvents()` (line 52)
    - `getEventsForRoute()` (line 66)
    - `createEvent()` (line 80)
    - `voteOnEvent()` (line 90)
    - `resolveEvent()` (line 100)
  
  ```typescript
  return response.data.map((event) => ({
    ...event,
    id: String(event.id),  // Convert id from number to string
    timestamp: new Date(event.timestamp),
    // ...
  }));
  ```

**Why:** The backend returns `id` as an integer, but the frontend Event type expects a string for consistency with other frontend data structures.

#### 2. `components/incident/IncidentDetailModal.tsx`
**Fixed location property access:**

- **Location display (line 82):**
  - Changed from `event.location.lon` to `event.location.lng`
  
  ```typescript
  {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
  ```

**Why:** The frontend Event type uses `lng` (not `lon`) to match the LatLng interface standard.

## API Endpoints Available

### Events Endpoints (Backend)

1. **GET `/info/get_events`**
   - Fetch all events with optional filtering
   - Query params: `route_id`, `incident_type`, `is_resolved`, `limit`
   - Response: Array of Event objects

2. **POST `/info/report_event`**
   - Create a new event
   - Body: EventCreate object
   - Response: Created Event object

3. **POST `/info/vote_event`**
   - Vote on an event (upvote/downvote)
   - Body: `{ eventId: string, userId: string, voteType: "upvote" | "downvote" }`
   - Response: Updated Event object

4. **PATCH `/info/resolve_event/{event_id}`**
   - Mark an event as resolved
   - Path param: `event_id` (string)
   - Response: Updated Event object

5. **GET `/info/get_events_for_route/{route_id}`**
   - Get all events for a specific route
   - Path param: `route_id` (string)
   - Response: Array of Event objects

6. **GET `/info/stats`**
   - Get statistics about events, lines, and stops
   - Response: Stats object

## Frontend Components

### Pages
1. **`IncidentsPage`** - Main page for viewing and filtering incidents
2. **`MapPage`** - Map view showing events as markers

### Components
1. **`IncidentCard`** - Card displaying event summary
2. **`IncidentDetailModal`** - Modal showing full event details with voting
3. **`ReportIncidentModal`** - Modal for reporting new incidents
4. **`MapView`** - Leaflet map displaying events as colored markers

### Context & Hooks
1. **`EventsContext`** - Manages events state and operations
2. **`useEvents`** - Hook to access events context

### Services
1. **`eventsService`** - API service for event-related operations

## Event Data Flow

1. **Fetching Events:**
   ```
   Component → useEvents hook → EventsContext → eventsService → Backend API
   ```

2. **Creating Events:**
   ```
   ReportIncidentModal → createEvent() → eventsService → Backend API → Refresh events
   ```

3. **Voting:**
   ```
   IncidentDetailModal → voteOnEvent() → eventsService → Backend API → Refresh events
   ```

## Testing Results

### Backend API Tests ✅

1. **Get Events (Empty):**
   ```bash
   GET http://localhost:8000/info/get_events
   Response: []
   ```

2. **Create Event:**
   ```bash
   POST http://localhost:8000/info/report_event
   Body: {
     "type": "delay",
     "title": "Bus delayed",
     "description": "Bus is running 15 minutes late",
     "location": {"lat": 50.0647, "lng": 19.9450},
     "reportedBy": "test_user",
     "routeId": "1"
   }
   Response: Event object with id=1
   ```

3. **Get Events (With Data):**
   ```bash
   GET http://localhost:8000/info/get_events
   Response: [Event object]
   ```

4. **Vote on Event:**
   ```bash
   POST http://localhost:8000/info/vote_event
   Body: {"eventId": "1", "userId": "test_user", "voteType": "upvote"}
   Response: Event object with upvotes=1
   ```

## Configuration

### Backend
- **Host:** `0.0.0.0`
- **Port:** `8000`
- **CORS:** Enabled for all origins (development)

### Frontend
- **API Base URL:** `http://localhost:8000` (default)
- Can be overridden with `VITE_API_URL` environment variable

## How to Use

### Start Backend:
```bash
cd fastapi_app
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Start Frontend:
```bash
cd journey-radar
npm run dev
```

### Access Application:
- Frontend: `http://localhost:5173` (or Vite's assigned port)
- Backend API docs: `http://localhost:8000/docs`

## Features Now Working

✅ Fetch all events from backend
✅ Display events on map as colored markers
✅ Display events in incidents list page
✅ Filter events by status (all/active/resolved)
✅ Filter events by route
✅ Sort events (recent/most voted)
✅ Report new incidents
✅ Vote on events (upvote/downvote)
✅ View event details
✅ Auto-refresh events after creating or voting

## Event Types Supported

- 🕒 Delay
- 🚫 Cancellation
- 👥 Crowding
- 🔧 Technical Issue
- 🚨 Accident
- 🚧 Road Works
- 🌧️ Weather
- 📍 Other

## Notes

- Events are currently stored in-memory (backend). They will be lost on server restart.
- For production, implement proper database storage.
- User authentication is not implemented - using localStorage for temporary user IDs.
- Event IDs are integers in the backend but converted to strings in the frontend for consistency.

