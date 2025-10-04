from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid
import math
from models.database_models import Line, Stop, Route, Event, EventCreate, EventVote, IncidentType, LatLng, Notification, Train, Edge
from db.dicts import stops, lines, notifications, trains, edges

router = APIRouter(prefix="/trains", tags=["trains"])

def get_next_edge_for_train(train: Train) -> Optional[Edge]:
    """Get the next edge for a train on its line"""
    line = lines[train.line_id]
    current_edge_index = None
    
    # Find current edge index in the line
    for i, edge in enumerate(line.edges):
        if edge.id == train.current_edge:
            current_edge_index = i
            break
    
    if current_edge_index is None:
        return None
    
    # Check if we're at the end of the line
    if current_edge_index >= len(line.edges) - 1:
        return None
    
    # Return next edge
    return line.edges[current_edge_index + 1]

def move_train_to_next_edge(train_id: int) -> dict:
    """Move a train to its next edge"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    train = trains[train_id]
    next_edge = get_next_edge_for_train(train)
    
    if next_edge is None:
        return {
            "success": False,
            "message": f"Train {train_id} is at the end of line {train.line_id}",
            "train_id": train_id,
            "current_edge": train.current_edge,
        }
    
    # Move train to next edge
    old_edge = train.current_edge
    train.current_edge = next_edge.id
    
    # Get stop information
    from_stop = stops[next_edge.from_stop]
    to_stop = stops[next_edge.to_stop]
    
    return {
        "success": True,
        "message": f"Train {train_id} moved from edge {old_edge} to edge {next_edge.id}",
        "train_id": train_id,
        "old_edge": old_edge,
        "new_edge": next_edge.id,
        "from_stop": {
            "id": from_stop.id,
            "name": from_stop.name,
            "code": from_stop.code
        },
        "to_stop": {
            "id": to_stop.id,
            "name": to_stop.name,
            "code": to_stop.code
        }
    }

@router.post("/move_train/{train_id}")
async def move_train(train_id: int):
    """Move a train to its next edge on the line"""
    try:
        result = move_train_to_next_edge(train_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error moving train: {str(e)}")

@router.get("/", response_model=List[Train])
async def get_all_trains():
    """Get all trains"""
    return list(trains.values())

@router.get("/{train_id}", response_model=Train)
async def get_train_info(train_id: int):
    """Get information about a specific train"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    return trains[train_id]

@router.get("/{train_id}/status")
async def get_train_status(train_id: int):
    """Get detailed status of a train including current location"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    train = trains[train_id]
    line = lines[train.line_id]
    current_edge = edges[train.current_edge]
    from_stop = stops[current_edge.from_stop]
    to_stop = stops[current_edge.to_stop]
    
    return {
        "train_id": train_id,
        "line_id": train.line_id,
        "line_name": line.name,
        "current_edge": train.current_edge,
        "from_stop": {
            "id": from_stop.id,
            "name": from_stop.name,
            "code": from_stop.code
        },
        "to_stop": {
            "id": to_stop.id,
            "name": to_stop.name,
            "code": to_stop.code
        }
    }

@router.get("/{train_id}/next_stop")
async def get_train_next_stop(train_id: int):
    """Get the next stop for a train"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    train = trains[train_id]
    current_edge = edges[train.current_edge]
    next_stop = stops[current_edge.to_stop]
    
    return {
        "train_id": train_id,
        "next_stop": {
            "id": next_stop.id,
            "name": next_stop.name,
            "code": next_stop.code,
            "lat": next_stop.lat,
            "lon": next_stop.lon
        }
    }

@router.get("/on_line/{line_id}")
async def get_trains_on_line(line_id: int):
    """Get all trains currently on a specific line"""
    if line_id not in lines:
        raise HTTPException(status_code=404, detail=f"Line with ID {line_id} not found")
    
    trains_on_line = [train for train in trains.values() if train.line_id == line_id]
    
    return {
        "line_id": line_id,
        "line_name": lines[line_id].name,
        "trains": [
            {
                "train_id": train.id,
                "current_edge": train.current_edge,
            } for train in trains_on_line
        ],
        "total_trains": len(trains_on_line)
    }

@router.get("/{train_id}/route")
async def get_train_route(train_id: int):
    """Get the complete route for a train"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    train = trains[train_id]
    line = lines[train.line_id]
    
    # Get all stops in order
    route_stops = []
    for edge in line.edges:
        from_stop = stops[edge.from_stop]
        if not route_stops or route_stops[-1]['id'] != from_stop.id:
            route_stops.append({
                "id": from_stop.id,
                "name": from_stop.name,
                "code": from_stop.code,
                "lat": from_stop.lat,
                "lon": from_stop.lon
            })
    
    # Add the last stop
    last_edge = line.edges[-1]
    last_stop = stops[last_edge.to_stop]
    route_stops.append({
        "id": last_stop.id,
        "name": last_stop.name,
        "code": last_stop.code,
        "lat": last_stop.lat,
        "lon": last_stop.lon
    })
    
    return {
        "train_id": train_id,
        "line_id": train.line_id,
        "line_name": line.name,
        "total_stops": len(route_stops),
        "stops": route_stops
    }

@router.get("/{train_id}/current_location")
async def get_train_current_location(train_id: int):
    """Get the current location of a train"""
    if train_id not in trains:
        raise HTTPException(status_code=404, detail=f"Train with ID {train_id} not found")
    
    train = trains[train_id]
    current_edge = edges[train.current_edge]
    from_stop = stops[current_edge.from_stop]
    to_stop = stops[current_edge.to_stop]
    
    return {
        "train_id": train_id,
        "current_edge": train.current_edge,
        "from_stop": {
            "id": from_stop.id,
            "name": from_stop.name,
            "lat": from_stop.lat,
            "lon": from_stop.lon
        },
        "to_stop": {
            "id": to_stop.id,
            "name": to_stop.name,
            "lat": to_stop.lat,
            "lon": to_stop.lon
        }
    }
