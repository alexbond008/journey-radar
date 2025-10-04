from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, time
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
    id: int
    code: str  # stop number/code
    name: str
    description: Optional[str] = None
    lat: float
    lon: float

    def __hash__(self) -> int:
        return self.id
    
    def __eq__(self, value: object) -> bool:
        return super().__eq__(id)

class Route(BaseModel):
    id: int
    name: str
    number: str
    description: Optional[str] = None
    stops: List[Stop] = []

class Event(BaseModel):
    id: int
    type: IncidentType
    title: str
    description: str
    timestamp: datetime
    location: LatLng
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
    reportedBy: str

class EventVote(BaseModel):
    eventId: int
    userId: int
    voteType: str  # "upvote" or "downvote"

class Edge(BaseModel):
    id: int
    from_stop: int  # Stop ID
    to_stop: int    # Stop ID


class Schedule(BaseModel):
    id: int
    stop_to_time: dict[int, time]

class LineResponse(BaseModel):
    id: int
    name: str
    stops: list[Stop]

class Line(BaseModel):
    id: int
    name: str
    number: Optional[str] = None
    edges: Optional[list[Edge]] = None
    time_table: Optional[List[Schedule]] = None
    stops: Optional[List[Stop]] = None


class Train(BaseModel):
    id: int
    line_id: int
    current_edge: int  # Edge ID


class User(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    current_train_id: Optional[int] = None
    level: int = 0
    reputation: str

class Notification(BaseModel):
    user_id: int
    message: str
    timestamp: datetime

