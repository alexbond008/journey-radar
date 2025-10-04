from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid
from models.database_models import Stop, Route, Event, EventCreate, EventVote, IncidentType, LatLng

router = APIRouter(prefix="/info", tags=["info"])

# Mock database - in production this would be a real database
MOCK_STOPS = [
    Stop(id="stop_001", code="001", name="Dworzec Główny", description="Główny dworzec kolejowy", lat=50.0647, lon=19.9450),
    Stop(id="stop_002", code="002", name="Rynek Główny", description="Główny rynek miasta", lat=50.0614, lon=19.9373),
    Stop(id="stop_003", code="003", name="Wawel", description="Zamek Królewski na Wawelu", lat=50.0547, lon=19.9354),
    Stop(id="stop_004", code="004", name="Kazimierz", description="Dzielnica żydowska", lat=50.0513, lon=19.9442),
    Stop(id="stop_005", code="005", name="Nowa Huta", description="Dzielnica Nowa Huta", lat=50.0755, lon=20.0322),
    Stop(id="stop_006", code="006", name="Błonia", description="Błonia Krakowskie", lat=50.0597, lon=19.9200),
    Stop(id="stop_007", code="007", name="Zakopane", description="Stacja w Zakopanem", lat=49.2992, lon=19.9496),
    Stop(id="stop_008", code="008", name="Wieliczka", description="Stacja w Wieliczce", lat=49.9833, lon=20.0667),
]

MOCK_ROUTES = [
    Route(
        id="route_501", 
        name="Linia 501", 
        number="501", 
        description="Dworzec Główny - Nowa Huta",
        stops=[MOCK_STOPS[0], MOCK_STOPS[1], MOCK_STOPS[4]]  # Dworzec -> Rynek -> Nowa Huta
    ),
    Route(
        id="route_208", 
        name="Linia 208", 
        number="208", 
        description="Wawel - Kazimierz",
        stops=[MOCK_STOPS[2], MOCK_STOPS[3]]  # Wawel -> Kazimierz
    ),
    Route(
        id="route_102", 
        name="Linia 102", 
        number="102", 
        description="Błonia - Dworzec Główny",
        stops=[MOCK_STOPS[5], MOCK_STOPS[0]]  # Błonia -> Dworzec
    ),
    Route(
        id="route_300", 
        name="Linia 300", 
        number="300", 
        description="Kraków - Zakopane",
        stops=[MOCK_STOPS[0], MOCK_STOPS[6]]  # Dworzec -> Zakopane
    ),
    Route(
        id="route_210", 
        name="Linia 210", 
        number="210", 
        description="Kraków - Wieliczka",
        stops=[MOCK_STOPS[0], MOCK_STOPS[7]]  # Dworzec -> Wieliczka
    ),
]

MOCK_EVENTS = [
    Event(
        id="event_001",
        type=IncidentType.DELAY,
        title="Opóźnienie na linii 501",
        description="Autobus opóźniony o 15 minut z powodu korków na ul. Krakowskiej",
        timestamp=datetime.now(),
        location=LatLng(lat=50.0647, lng=19.9450),
        routeId="route_501",
        upvotes=5,
        downvotes=1,
        isResolved=False,
        reportedBy="user123"
    ),
    Event(
        id="event_002",
        type=IncidentType.CANCELLATION,
        title="Odwołany kurs linii 208",
        description="Kurs odwołany z powodu awarii technicznej pojazdu",
        timestamp=datetime.now(),
        location=LatLng(lat=50.0614, lng=19.9373),
        routeId="route_208",
        upvotes=3,
        downvotes=0,
        isResolved=True,
        reportedBy="user456"
    ),
]

@router.get("/get_stops", response_model=List[Stop])
async def get_all_stops():
    """Get all bus stops"""
    return MOCK_STOPS

@router.get("/get_routes", response_model=List[Route])
async def get_all_routes():
    """Get all bus routes"""
    return MOCK_ROUTES

@router.get("/get_stops_for_route", response_model=List[Stop])
async def get_stops_for_route(route_id: str = Query(..., description="Route ID")):
    """Get all bus stops for a specific route"""
    # Find the route
    route = next((r for r in MOCK_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    return route.stops

@router.post("/report_event", response_model=Event)
async def report_event(event_data: EventCreate):
    """Report a new event for a route"""
    # Validate route exists
    route = next((r for r in MOCK_ROUTES if r.id == event_data.routeId), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {event_data.routeId} not found")
    
    # Create new event
    new_event = Event(
        id=f"event_{uuid.uuid4().hex[:8]}",
        type=event_data.type,
        title=event_data.title,
        description=event_data.description,
        timestamp=datetime.now(),
        location=event_data.location,
        routeId=event_data.routeId,
        upvotes=0,
        downvotes=0,
        isResolved=False,
        reportedBy=event_data.reportedBy
    )
    
    # Add to mock database
    MOCK_EVENTS.append(new_event)
    
    return new_event

@router.get("/get_events", response_model=List[Event])
async def get_events(
    route_id: Optional[str] = Query(None, description="Filter by route ID"),
    incident_type: Optional[IncidentType] = Query(None, description="Filter by incident type"),
    is_resolved: Optional[bool] = Query(None, description="Filter by resolved status"),
    limit: int = Query(50, description="Maximum number of events to return")
):
    """Get events with optional filtering"""
    events = MOCK_EVENTS.copy()
    
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
    route = next((r for r in MOCK_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    # Get events for this route
    events = [e for e in MOCK_EVENTS if e.routeId == route_id]
    events.sort(key=lambda x: x.timestamp, reverse=True)
    
    return events

@router.get("/get_route_info/{route_id}", response_model=Route)
async def get_route_info(route_id: str):
    """Get detailed information about a specific route including its stops"""
    route = next((r for r in MOCK_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    return route

@router.get("/get_stop_info/{stop_id}", response_model=Stop)
async def get_stop_info(stop_id: str):
    """Get detailed information about a specific bus stop"""
    stop = next((s for s in MOCK_STOPS if s.id == stop_id), None)
    if not stop:
        raise HTTPException(status_code=404, detail=f"Bus stop with ID {stop_id} not found")
    
    return stop

@router.get("/get_routes_for_stop/{stop_id}", response_model=List[Route])
async def get_routes_for_stop(stop_id: str):
    """Get all routes that pass through a specific stop"""
    # Find routes that include this stop
    routes = [r for r in MOCK_ROUTES if any(stop.id == stop_id for stop in r.stops)]
    
    if not routes:
        raise HTTPException(status_code=404, detail=f"No routes found for stop ID {stop_id}")
    
    return routes

@router.post("/vote_event", response_model=Event)
async def vote_event(vote_data: EventVote):
    """Vote on an event (upvote or downvote)"""
    # Find the event
    event = next((e for e in MOCK_EVENTS if e.id == vote_data.eventId), None)
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
    event = next((e for e in MOCK_EVENTS if e.id == event_id), None)
    if not event:
        raise HTTPException(status_code=404, detail=f"Event with ID {event_id} not found")
    
    event.isResolved = True
    return event

@router.get("/stats")
async def get_stats():
    """Get basic statistics about routes, stops, and events"""
    return {
        "total_routes": len(MOCK_ROUTES),
        "total_stops": len(MOCK_STOPS),
        "total_events": len(MOCK_EVENTS),
        "resolved_events": len([e for e in MOCK_EVENTS if e.isResolved]),
        "unresolved_events": len([e for e in MOCK_EVENTS if not e.isResolved]),
        "events_by_type": {
            incident_type.value: len([e for e in MOCK_EVENTS if e.type == incident_type])
            for incident_type in IncidentType
        },
        "total_upvotes": sum(e.upvotes for e in MOCK_EVENTS),
        "total_downvotes": sum(e.downvotes for e in MOCK_EVENTS)
    }
