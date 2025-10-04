# Info API Documentation

## Overview

This API provides endpoints for managing bus routes, stops, and events in a transport system. It follows the database model with Routes having a one-to-many relationship with Bus Stops, and Events being reported and assigned to routes.

## Base URL

```
http://localhost:8000/info
```

## Data Models

### Event

```json
{
  "id": "string",
  "type": "delay|cancellation|crowding|technical_issue|accident|road_works|weather|other",
  "title": "string",
  "description": "string",
  "timestamp": "datetime",
  "location": {
    "lat": "float",
    "lng": "float"
  },
  "routeId": "string",
  "upvotes": "integer",
  "downvotes": "integer",
  "isResolved": "boolean",
  "reportedBy": "string"
}
```

### Stop

```json
{
  "id": "string",
  "code": "string",
  "name": "string",
  "description": "string|null",
  "lat": "float",
  "lon": "float"
}
```

### Route

```json
{
  "id": "string",
  "name": "string",
  "number": "string",
  "description": "string|null",
  "stops": ["Stop"]
}
```

## API Endpoints

### 1. Get All Stops

```http
GET /get_stops
```

Returns all bus stops in the system.

**Response:**

```json
[
  {
    "id": "stop_001",
    "code": "001",
    "name": "Dworzec Główny",
    "description": "Główny dworzec kolejowy",
    "lat": 50.0647,
    "lon": 19.945
  }
]
```

### 2. Get All Routes

```http
GET /get_routes
```

Returns all bus routes in the system.

**Response:**

```json
[
  {
    "id": "route_501",
    "name": "Linia 501",
    "number": "501",
    "description": "Dworzec Główny - Nowa Huta",
    "stops": [
      {
        "id": "stop_001",
        "code": "001",
        "name": "Dworzec Główny",
        "lat": 50.0647,
        "lon": 19.945
      }
    ]
  }
]
```

### 3. Get Stops for Route

```http
GET /get_stops_for_route?route_id={route_id}
```

Returns all stops for a specific route.

**Parameters:**

- `route_id` (string, required): The route ID

**Response:**

```json
[
  {
    "id": "stop_001",
    "code": "001",
    "name": "Dworzec Główny",
    "lat": 50.0647,
    "lon": 19.945
  }
]
```

### 4. Report Event

```http
POST /report_event
```

Report a new event for a route.

**Request Body:**

```json
{
  "type": "delay",
  "title": "Bus delayed by 15 minutes",
  "description": "Bus is delayed due to traffic congestion",
  "location": {
    "lat": 50.0647,
    "lng": 19.945
  },
  "routeId": "route_501",
  "reportedBy": "user123"
}
```

**Response:**

```json
{
  "id": "event_abc12345",
  "type": "delay",
  "title": "Bus delayed by 15 minutes",
  "description": "Bus is delayed due to traffic congestion",
  "timestamp": "2024-01-01T12:00:00",
  "location": {
    "lat": 50.0647,
    "lng": 19.945
  },
  "routeId": "route_501",
  "upvotes": 0,
  "downvotes": 0,
  "isResolved": false,
  "reportedBy": "user123"
}
```

### 5. Get Events

```http
GET /get_events?route_id={route_id}&incident_type={type}&is_resolved={bool}&limit={number}
```

Get events with optional filtering.

**Parameters:**

- `route_id` (string, optional): Filter by route ID
- `incident_type` (string, optional): Filter by incident type
- `is_resolved` (boolean, optional): Filter by resolved status
- `limit` (integer, optional): Maximum number of events (default: 50)

**Response:**

```json
[
  {
    "id": "event_001",
    "type": "delay",
    "title": "Opóźnienie na linii 501",
    "description": "Autobus opóźniony o 15 minut",
    "timestamp": "2024-01-01T12:00:00",
    "location": {
      "lat": 50.0647,
      "lng": 19.945
    },
    "routeId": "route_501",
    "upvotes": 5,
    "downvotes": 1,
    "isResolved": false,
    "reportedBy": "user123"
  }
]
```

### 6. Get Events for Route

```http
GET /get_events_for_route/{route_id}
```

Get all events for a specific route.

**Response:** Same as Get Events

### 7. Get Route Info

```http
GET /get_route_info/{route_id}
```

Get detailed information about a specific route including its stops.

**Response:**

```json
{
  "id": "route_501",
  "name": "Linia 501",
  "number": "501",
  "description": "Dworzec Główny - Nowa Huta",
  "stops": [
    {
      "id": "stop_001",
      "code": "001",
      "name": "Dworzec Główny",
      "lat": 50.0647,
      "lon": 19.945
    }
  ]
}
```

### 8. Get Stop Info

```http
GET /get_stop_info/{stop_id}
```

Get detailed information about a specific bus stop.

**Response:**

```json
{
  "id": "stop_001",
  "code": "001",
  "name": "Dworzec Główny",
  "description": "Główny dworzec kolejowy",
  "lat": 50.0647,
  "lon": 19.945
}
```

### 9. Get Routes for Stop

```http
GET /get_routes_for_stop/{stop_id}
```

Get all routes that pass through a specific stop.

**Response:**

```json
[
  {
    "id": "route_501",
    "name": "Linia 501",
    "number": "501",
    "description": "Dworzec Główny - Nowa Huta",
    "stops": [...]
  }
]
```

### 10. Vote on Event

```http
POST /vote_event
```

Vote on an event (upvote or downvote).

**Request Body:**

```json
{
  "eventId": "event_001",
  "userId": "user456",
  "voteType": "upvote"
}
```

**Response:** Updated Event object

### 11. Resolve Event

```http
PATCH /resolve_event/{event_id}
```

Mark an event as resolved.

**Response:** Updated Event object with `isResolved: true`

### 12. Get Statistics

```http
GET /stats
```

Get basic statistics about routes, stops, and events.

**Response:**

```json
{
  "total_routes": 5,
  "total_stops": 8,
  "total_events": 2,
  "resolved_events": 1,
  "unresolved_events": 1,
  "events_by_type": {
    "delay": 1,
    "cancellation": 1,
    "crowding": 0
  },
  "total_upvotes": 8,
  "total_downvotes": 1
}
```

## Incident Types

- `delay` - Service delays
- `cancellation` - Service cancellations
- `crowding` - Overcrowding issues
- `technical_issue` - Technical problems
- `accident` - Accidents
- `road_works` - Road construction
- `weather` - Weather-related issues
- `other` - Other issues

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a `detail` field with error information.

## Example Usage

### Report a Delay Event

```bash
curl -X POST "http://localhost:8000/info/report_event" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "delay",
    "title": "Bus delayed by 10 minutes",
    "description": "Traffic congestion on main street",
    "location": {
      "lat": 50.0647,
      "lng": 19.9450
    },
    "routeId": "route_501",
    "reportedBy": "user123"
  }'
```

### Get Events for Route

```bash
curl "http://localhost:8000/info/get_events_for_route/route_501"
```

### Vote on Event

```bash
curl -X POST "http://localhost:8000/info/vote_event" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event_001",
    "userId": "user456",
    "voteType": "upvote"
  }'
```

## Testing

Run the test script to verify all endpoints:

```bash
python test_endpoints.py
```

This will test all endpoints and display the results.
