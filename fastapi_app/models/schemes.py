from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class Stop(BaseModel):
    id: int
    coordinates: Coordinates
    name: Optional[str] = None


class Edge(BaseModel):
    id: int
    from_stop: int  # Stop ID
    to_stop: int    # Stop ID
    distance: float


class Line(BaseModel):
    id: int
    name: str
    edges: List[Edge]


class Train(BaseModel):
    id: int
    line_id: int
    current_edge: int  # Edge ID
    position: float    # Position on current edge (0.0 to 1.0)


class User(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    current_train_id: Optional[int] = None


class Event(BaseModel):
    id: int
    coordinates: Coordinates
    edge_affected: int  
    time: datetime
    event_type: Optional[str] = None  # e.g., "delay", "cancellation", "maintenance"