# Journey-Radar FastAPI Backend

This document describes the backend API functionality for the Journey-Radar project. The API is designed to support a frontend agent in building interactive commuter experiences, including route planning, live tracking, and incident reporting.

---

## API Overview

The backend is built with FastAPI and exposes endpoints for:
- Retrieving stops and routes
- Reporting and managing events (incidents)
- Voting and resolving events
- Querying statistics and notifications

### Main Endpoints (under `/info`)

#### Stops & Routes
- `GET /info/get_stops` — List all bus/train stops
- `GET /info/get_routes` — List all available routes
- `GET /info/get_stops_for_route?route_id=...` — Get stops for a specific route
- `GET /info/get_route_info/{route_id}` — Get detailed info about a route
- `GET /info/get_stop_info/{stop_id}` — Get detailed info about a stop
- `GET /info/get_routes_for_stop/{stop_id}` — List all routes passing through a stop
- `GET /info/lines` — List all available line numbers
- `GET /info/stops_by_name/{stop_name}` — Search stops by name (partial match)
- `GET /info/route_by_number/{line_number}` — Get route info by line number

#### Events (Incidents)
- `POST /info/report_event` — Report a new incident/event (delay, cancellation, etc.)
- `GET /info/get_events` — List events, with optional filters (route, type, resolved)
- `GET /info/get_events_for_route/{route_id}` — List events for a specific route
- `POST /info/vote_event` — Upvote/downvote an event
- `PATCH /info/resolve_event/{event_id}` — Mark an event as resolved

#### Statistics & Notifications
- `GET /info/stats` — Get statistics (routes, stops, events, votes)
- `GET /info/notifications/{user_id}` — Get notifications for a user

---

## Data Models
- **Stop**: id, code, name, lat, lon, description
- **Route**: id, name, number, description, stops[]
- **Event**: id, type, title, description, timestamp, location, upvotes, downvotes, isResolved, reportedBy
- **Notification**: user_id, message, timestamp

---

## Example Use Cases for Frontend Agent
- Display all stops and routes on a map
- Show incidents along a selected route
- Allow users to report new problems (with location, type, description)
- Enable voting on reported events
- Show statistics (number of routes, stops, events, etc.)
- Provide user-specific notifications

---

## Running the API
- The API is containerized (see `Dockerfile`).
- Main entrypoint: `main.py` (FastAPI app)
- Dependencies: FastAPI, Uvicorn, Pydantic, aiosqlite, httpx

---

## Notes for AI Frontend Agent
- All endpoints return JSON data.
- Filtering and searching is supported for events and stops.
- Voting and resolving events is possible via dedicated endpoints.
- The API is designed for extensibility and can be adapted for new incident types or transport modes.

---

For further details, see the endpoint implementations in `fastapi_app/routers/info_route.py` and the data models in `fastapi_app/models/database_models.py`.
