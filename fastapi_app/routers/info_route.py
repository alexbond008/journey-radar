from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid
from models.database_models import Line, LineResponse, Stop, Route, Event, EventCreate, EventVote, IncidentType, LatLng, Notification, User
import db.dicts
from db.dicts import stops, lines, notifications, edges, users, trains, events
from repositiories.route_finding import find_nearest_edge, get_best_route
from repositiories.user_repository import update_user_level
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

router = APIRouter(prefix="/info", tags=["info"])

# Events storage (in production this would be a database)
# Initialize with seed events from db.dicts
EVENTS_STORAGE: List[Event] = list(events.values())

def notify_user(user_id: str, message: str):
    notifications.append(Notification(user_id=user_id, message=message, timestamp=datetime.now()))


@router.get("/get_stops", response_model=List[Stop])
async def get_all_stops():
    """Get all bus stops from CSV data"""
    return list(stops.values())

@router.get("/get_lines", response_model=List[Line])
async def get_all_lines():
    """Get all bus routes from CSV data with stops populated"""
    result = []
    for line in lines.values():
        # Extract stops from edges
        if line.edges:
            line_stops = []
            # Add first stop (from_stop of first edge)
            first_edge = line.edges[0]
            first_stop = stops.get(first_edge.from_stop)
            if first_stop:
                line_stops.append(first_stop)
            
            # Add all to_stops
            for edge in line.edges:
                to_stop = stops.get(edge.to_stop)
                if to_stop:
                    line_stops.append(to_stop)
            
            # Create line with stops populated
            line_with_stops = Line(
                id=line.id,
                name=line.name,
                number=line.number if line.number else str(line.id),
                edges=line.edges,
                stops=line_stops
            )
            result.append(line_with_stops)
        else:
            result.append(line)
    
    return result

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

    edge_id = find_nearest_edge(event_data.location, stops)

    
    # Create new event
    new_event = Event(
        id=len(EVENTS_STORAGE) + 1,
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

    edge = edges[edge_id]
    # todo maybe later
    # all_events_on_edge_with_type = [e for e in EVENTS_STORAGE if 
    #                                 e.edge_affected == edge_id and 
    #                                 e.type == event_data.type 
    #                                 and not e.isResolved]
    
    for user in users.values():
        train = trains[user.current_train_id]
        line = lines[train.line_id]
        if edge in line.edges:
            notify_user(user.id, f"New event reported on your route {line.name}: {event_data.title}")
    
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
        update_user_level(vote_data.userId, True)
    elif vote_data.voteType == "downvote":
        event.downvotes += 1
        update_user_level(vote_data.userId, False)
    else:
        raise HTTPException(status_code=400, detail="voteType must be 'upvote' or 'downvote'")
    
    return event

@router.patch("/resolve_event/{event_id}", response_model=Event)
async def resolve_event(event_id: str):
    """Mark an event as resolved"""
    # Convert string event_id to int for comparison
    try:
        event_id_int = int(event_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid event ID: {event_id}")
    
    event = next((e for e in EVENTS_STORAGE if e.id == event_id_int), None)
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
async def get_all_line_numbers():
    """Get all available line numbers from CSV data"""
    return [line.number if line.number else str(line.id) for line in lines.values()]

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




@router.get("/users")
async def get_all_users() -> list[User]:
    """Get all users (stub implementation)"""
    return list(users.values())

@router.get("/prompt")
async def get_llm_answer(prompt: str) -> str:
    """Get answer from LLM with transport context"""
    
    system_prompt = f"""
    Kontekst:
    Opóźnienia i utrudnienia w transporcie publicznym to codzienność milionów pasażerów. 
    Informacje o nich często docierają zbyt późno, są niepełne lub rozproszone pomiędzy różne źródła. 
    Brak spójnej i szybkiej wymiany danych między przewoźnikami, systemami dyspozytorskimi i pasażerami powoduje, 
    że podróżni muszą polegać na fragmentarycznych komunikatach, a planowanie trasy staje się grą w zgadywanie.
    Współczesne technologie pozwalają gromadzić informacje w czasie rzeczywistym, jednak wyzwaniem pozostaje ich integracja, 
    weryfikacja i przekazywanie w formie, która faktycznie pomaga podróżnym.

    Zadanie:
    Jesteś inteligentnym asystentem pasażera komunikacji publicznej. 
    Twoim zadaniem jest dostarczanie aktualnych, zrozumiałych i praktycznych informacji o opóźnieniach, 
    utrudnieniach oraz możliwych alternatywnych trasach przejazdu. 
    Pomagasz użytkownikowi w szybkim podejmowaniu decyzji i reagowaniu na zmiany w czasie rzeczywistym.

    Odpowiedz na poniższe pytanie użytkownika w sposób zwięzły, przyjazny i konkretny.

    Use context from rag_context if needed.
    Kontekst:
    rag_context = {events}
    lines = {lines}
    stops = {stops}
    trains = {trains}
"""




    response = client.responses.create(
    model="gpt-4o",
    instructions=system_prompt,
    input=prompt
    )
    from pprint import pprint
    return response.output[0].content[0].text

    
@router.post("/get_route")
async def get_route(start:Stop, end:Stop):
    return get_best_route(start=start, end=end)


    