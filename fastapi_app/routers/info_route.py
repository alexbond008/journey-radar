from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid
from models.database_models import Line, LineResponse, Stop, Route, Event, EventCreate, EventVote, IncidentType, LatLng, Notification
import db.dicts
from db.dicts import stops, lines, notifications

router = APIRouter(prefix="/info", tags=["info"])

# Events storage (in production this would be a database)
EVENTS_STORAGE = []

def notify_user(user_id: str, message: str):
    notifications.append(Notification(user_id=user_id, message=message, timestamp=datetime.now()))

@router.get("/get_stops", response_model=List[Stop])
async def get_all_stops():
    """Get all bus stops from CSV data"""
    return list(stops.values())

@router.get("/get_lines", response_model=List[Line])
async def get_all_lines():
    """Get all bus routes from CSV data"""
    return list(lines.values())

@router.get("/get_stops_for_line", response_model=List[Stop])
async def get_stops_for_line(line_id: str = Query(..., description="Line ID")):
    """Get all bus stops for a specific line"""
    # Find the line
    line = next((l for l in lines.values() if l.id == line_id), None)
    if not line:
        raise HTTPException(status_code=404, detail=f"Line with ID {line_id} not found")
    
    return line.stops

@router.get("/get_line_with_stops")
async def get_line_with_stops(line_id: int) -> LineResponse:
    line = lines[line_id] if line_id in lines else None
    if not line:
        raise HTTPException(status_code=404, detail=f"Line with ID {line_id} not found")

    edges = line.edges

    line_stops = [edges[0].from_stop] + [edge.to_stop for edge in edges]

    return LineResponse(
        id=line.id,
        name=line.name,
        stops=line_stops
    )

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
    route = next((r for r in lines.values() if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route with ID {route_id} not found")
    
    # Get events for this route
    events = [e for e in EVENTS_STORAGE if e.routeId == route_id]
    events.sort(key=lambda x: x.timestamp, reverse=True)
    
    return events

@router.get("/get_line_info/{line_id}", response_model=Line)
async def get_line_info(line_id: str):
    """Get detailed information about a specific line including its stops"""
    line = lines[line_id] if line_id in lines else None
    if not line:
        raise HTTPException(status_code=404, detail=f"Line with ID {line_id} not found")

    return line

@router.get("/get_stop_info/{stop_id}", response_model=Stop)
async def get_stop_info(stop_id: str):
    """Get detailed information about a specific bus stop"""
    stop = next((s for s in stops.values() if s.id == stop_id), None)
    if not stop:
        raise HTTPException(status_code=404, detail=f"Bus stop with ID {stop_id} not found")
    
    return stop

@router.get("/get_lines_for_stop/{stop_id}", response_model=List[Line])
async def get_lines_for_stop(stop_id: str):
    """Get all lines that pass through a specific stop"""
    # Find lines that include this stop
    lines = [l for l in lines.values() if any(stop.id == stop_id for stop in l.stops)]

    if not lines:
        raise HTTPException(status_code=404, detail=f"No lines found for stop ID {stop_id}")

    return lines

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
    """Get basic statistics about lines, stops, and events"""
    return {
        "total_lines": len(lines),
        "total_stops": len(stops),
        "total_events": len(EVENTS_STORAGE),
        "resolved_events": len([e for e in EVENTS_STORAGE if e.isResolved]),
        "unresolved_events": len([e for e in EVENTS_STORAGE if not e.isResolved]),
        "events_by_type": {
            incident_type.value: len([e for e in EVENTS_STORAGE if e.type == incident_type])
            for incident_type in IncidentType
        },
        "total_upvotes": sum(e.upvotes for e in EVENTS_STORAGE),
        "total_downvotes": sum(e.downvotes for e in EVENTS_STORAGE),
        "csv_data_loaded": len(stops) > 0 and len(lines) > 0
    }

@router.get("/lines")
async def get_all_lines():
    """Get all available line numbers from CSV data"""
    return [line.number for line in lines.values()]

@router.get("/stops_by_name/{stop_name}")
async def get_stops_by_name(stop_name: str):
    """Find stops by name (case-insensitive partial match)"""
    matching_stops = [
        stop for stop in stops.values()
        if stop_name.lower() in stop.name.lower()
    ]
    
    if not matching_stops:
        raise HTTPException(status_code=404, detail=f"No stops found matching '{stop_name}'")
    
    return matching_stops

@router.get("/route_by_number/{line_number}")
async def get_line_by_number(line_number: str):
    """Get line information by line number"""
    line = next((l for l in lines.values() if l.number == line_number), None)
    if not line:
        raise HTTPException(status_code=404, detail=f"Line {line_number} not found")
    
    return line

@router.get("/notifications/{user_id}")
async def get_user_notifications(user_id: str) -> list[Notification]:
    """Get notifications for a specific user (stub implementation)"""
    user_notifications = [n for n in notifications if n.user_id == user_id]
    return user_notifications



    