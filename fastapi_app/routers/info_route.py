from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid
from models.database_models import Stop, Route, Event, EventCreate, EventVote, IncidentType, LatLng

router = APIRouter(prefix="/info", tags=["info"])

# Events storage (in production this would be a database)
EVENTS_STORAGE = [
    Event(
        id="event_001",
        type=IncidentType.DELAY,
        title="Opóźnienie na linii 1",
        description="Autobus opóźniony o 15 minut z powodu korków",
        timestamp=datetime.now(),
        location=LatLng(lat=50.0683947, lng=19.9475035),  # KRAKÓW GŁÓWNY
        routeId="route_1",
        upvotes=5,
        downvotes=1,
        isResolved=False,
        reportedBy="user123"
    ),
    Event(
        id="event_002",
        type=IncidentType.CANCELLATION,
        title="Odwołany kurs linii 2",
        description="Kurs odwołany z powodu awarii technicznej pojazdu",
        timestamp=datetime.now(),
        location=LatLng(lat=50.0484386, lng=19.956833),  # KRAKÓW ZABŁOCIE
        routeId="route_2",
        upvotes=3,
        downvotes=0,
        isResolved=True,
        reportedBy="user456"
    ),
]

@router.get("/get_stops", response_model=List[Stop])
async def get_all_stops():
    """Get all bus stops from CSV data"""
    return REAL_STOPS

@router.get("/get_routes", response_model=List[Route])
async def get_all_routes():
    """Get all bus routes from CSV data"""
    return REAL_ROUTES

@router.get("/get_stops_for_route", response_model=List[Stop])
async def get_stops_for_route(route_id: str = Query(..., description="Route ID")):
    """Get all bus stops for a specific route"""
    # Find the route
    route = next((r for r in REAL_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    return route.stops

@router.post("/report_event", response_model=Event)
async def report_event(event_data: EventCreate):
    """Report a new event for a route"""

    edge_id = find_nearest_edge(event_data.location)
    
    # Create new event
    new_event = Event(
        id=f"event_{uuid.uuid4().hex[:8]}",
        type=event_data.type,
        title=event_data.title,
        description=event_data.description,
        timestamp=datetime.now(),
        location=event_data.location,
        edge_affected=edge_id,
        upvotes=0,
        downvotes=0,
        isResolved=False,
        reportedBy=event_data.reportedBy
    )
    
    # Add to events storage
    EVENTS_STORAGE.append(new_event)
    
    return new_event

@router.get("/get_events", response_model=List[Event])
async def get_events(
    route_id: Optional[str] = Query(None, description="Filter by route ID"),
    incident_type: Optional[IncidentType] = Query(None, description="Filter by incident type"),
    is_resolved: Optional[bool] = Query(None, description="Filter by resolved status"),
    limit: int = Query(50, description="Maximum number of events to return")
):
    """Get events with optional filtering"""
    events = EVENTS_STORAGE.copy()
    
    # Apply filters
    if route_id is not None:
        events = [e for e in events if e.routeId == route_id]
    
    if incident_type is not None:
        events = [e for e in events if e.type == incident_type]
    
    if is_resolved is not None:
        events = [e for e in events if e.isResolved == is_resolved]
    
    # Sort by timestamp (newest first)
    events.sort(key=lambda x: x.timestamp, reverse=True)
    
    # Apply limit
    return events[:limit]

@router.get("/get_events_for_route/{route_id}", response_model=List[Event])
async def get_events_for_route(route_id: str):
    """Get all events for a specific route"""
    # Validate route exists
    route = next((r for r in REAL_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    # Get events for this route
    events = [e for e in EVENTS_STORAGE if e.routeId == route_id]
    events.sort(key=lambda x: x.timestamp, reverse=True)
    
    return events

@router.get("/get_route_info/{route_id}", response_model=Route)
async def get_route_info(route_id: str):
    """Get detailed information about a specific route including its stops"""
    route = next((r for r in REAL_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    return route

@router.get("/get_stop_info/{stop_id}", response_model=Stop)
async def get_stop_info(stop_id: str):
    """Get detailed information about a specific bus stop"""
    stop = next((s for s in REAL_STOPS if s.id == stop_id), None)
    if not stop:
        raise HTTPException(status_code=404, detail=f"Bus stop with ID {stop_id} not found")
    
    return stop

@router.get("/get_routes_for_stop/{stop_id}", response_model=List[Route])
async def get_routes_for_stop(stop_id: str):
    """Get all routes that pass through a specific stop"""
    # Find routes that include this stop
    routes = [r for r in REAL_ROUTES if any(stop.id == stop_id for stop in r.stops)]
    
    if not routes:
        raise HTTPException(status_code=404, detail=f"No routes found for stop ID {stop_id}")
    
    return routes

@router.post("/vote_event", response_model=Event)
async def vote_event(vote_data: EventVote):
    """Vote on an event (upvote or downvote)"""
    # Find the event
    event = next((e for e in EVENTS_STORAGE if e.id == vote_data.eventId), None)
    if not event:
        raise HTTPException(status_code=404, detail=f"Event with ID {vote_data.eventId} not found")
    
    # Update vote counts
    if vote_data.voteType == "upvote":
        event.upvotes += 1
    elif vote_data.voteType == "downvote":
        event.downvotes += 1
    else:
        raise HTTPException(status_code=400, detail="voteType must be 'upvote' or 'downvote'")
    
    return event

@router.patch("/resolve_event/{event_id}", response_model=Event)
async def resolve_event(event_id: str):
    """Mark an event as resolved"""
    event = next((e for e in EVENTS_STORAGE if e.id == event_id), None)
    if not event:
        raise HTTPException(status_code=404, detail=f"Event with ID {event_id} not found")
    
    event.isResolved = True
    return event

@router.get("/stats")
async def get_stats():
    """Get basic statistics about routes, stops, and events"""
    return {
        "total_routes": len(REAL_ROUTES),
        "total_stops": len(REAL_STOPS),
        "total_events": len(EVENTS_STORAGE),
        "resolved_events": len([e for e in EVENTS_STORAGE if e.isResolved]),
        "unresolved_events": len([e for e in EVENTS_STORAGE if not e.isResolved]),
        "events_by_type": {
            incident_type.value: len([e for e in EVENTS_STORAGE if e.type == incident_type])
            for incident_type in IncidentType
        },
        "total_upvotes": sum(e.upvotes for e in EVENTS_STORAGE),
        "total_downvotes": sum(e.downvotes for e in EVENTS_STORAGE),
        "csv_data_loaded": len(REAL_STOPS) > 0 and len(REAL_ROUTES) > 0
    }

@router.get("/lines")
async def get_all_lines():
    """Get all available line numbers from CSV data"""
    return [route.number for route in REAL_ROUTES]

@router.get("/stops_by_name/{stop_name}")
async def get_stops_by_name(stop_name: str):
    """Find stops by name (case-insensitive partial match)"""
    matching_stops = [
        stop for stop in REAL_STOPS 
        if stop_name.lower() in stop.name.lower()
    ]
    
    if not matching_stops:
        raise HTTPException(status_code=404, detail=f"No stops found matching '{stop_name}'")
    
    return matching_stops

@router.get("/route_by_number/{line_number}")
async def get_route_by_number(line_number: str):
    """Get route information by line number"""
    route = next((r for r in REAL_ROUTES if r.number == line_number), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Line {line_number} not found")
    
    return route
