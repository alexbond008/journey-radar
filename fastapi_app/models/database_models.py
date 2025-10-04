from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class IncidentType(str, Enum):
    DELAY = "delay"
    CANCELLATION = "cancellation"
    CROWDING = "crowding"
    TECHNICAL_ISSUE = "technical_issue"
    ACCIDENT = "accident"
    ROAD_WORKS = "road_works"
    WEATHER = "weather"
    OTHER = "other"

class LatLng(BaseModel):
    lat: float
    lng: float

class Stop(BaseModel):
    id: str
    code: str  # stop number/code
    name: str
    description: Optional[str] = None
    lat: float
    lon: float

class Route(BaseModel):
    id: str
    name: str
    number: str
    description: Optional[str] = None
    stops: List[Stop] = []

class Event(BaseModel):
    id: str
    type: IncidentType
    title: str
    description: str
    timestamp: datetime
    location: LatLng
    routeId: str
    upvotes: int = 0
    downvotes: int = 0
    isResolved: bool = False
    reportedBy: str
    edge_affected: Optional[int] = None
    time: Optional[datetime] = None
    event_type: Optional[str] = None

class EventCreate(BaseModel):
    type: IncidentType
    title: str
    description: str
    location: LatLng
    routeId: str
    reportedBy: str

class EventVote(BaseModel):
    eventId: str
    userId: str
    voteType: str  # "upvote" or "downvote"

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


