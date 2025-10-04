from models.database_models import User, Train, Stop, Line, Edge, Event, LatLng
from datetime import datetime
from typing import Dict, List

users: Dict[int, User] = {
    1: User(
        id=1,
        name="Jan Kowalski",
        email="jan.kowalski@email.com",
        current_train_id=101
    ),
    2: User(
        id=2,
        name="Anna Nowak",
        email="anna.nowak@email.com",
        current_train_id=None
    ),
    3: User(
        id=3,
        name="Piotr Wiśniewski",
        email="piotr.wisniewski@email.com",
        current_train_id=102
    ),
}

# Tabela Trains
trains: Dict[int, Train] = {
    101: Train(
        id=101,
        line_id=1,
        current_edge=1,
        position=0.3
    ),
    102: Train(
        id=102,
        line_id=2,
        current_edge=4,
        position=0.7
    ),
    103: Train(
        id=103,
        line_id=1,
        current_edge=2,
        position=0.1
    ),
}

# Tabela Stops
stops: Dict[int, Stop] = {
    1: Stop(
        id="1",
        code="WAR_001",
        name="Warszawa Centralna",
        lat=52.2297,
        lon=21.0122
    ),
    2: Stop(
        id="2",
        code="WAR_002",
        name="Warszawa Wschodnia",
        lat=52.2374,
        lon=21.0095
    ),
    3: Stop(
        id="3",
        code="KRK_001",
        name="Kraków Główny",
        lat=50.0614,
        lon=19.9372
    ),
    4: Stop(
        id="4",
        code="WRO_001",
        name="Wrocław Główny",
        lat=51.1079,
        lon=17.0385
    ),
    5: Stop(
        id="5",
        code="SZC_001",
        name="Szczecin Główny",
        lat=53.4285,
        lon=14.5530
    ),
}

# Tabela Edges
edges: Dict[int, Edge] = {
    1: Edge(
        id=1,
        from_stop=1,
        to_stop=2,
        distance=2.5
    ),
    2: Edge(
        id=2,
        from_stop=2,
        to_stop=3,
        distance=295.0
    ),
    3: Edge(
        id=3,
        from_stop=2,
        to_stop=4,
        distance=315.0
    ),
    4: Edge(
        id=4,
        from_stop=4,
        to_stop=5,
        distance=385.0
    ),
    5: Edge(
        id=5,
        from_stop=1,
        to_stop=3,
        distance=297.5
    ),
}

# Tabela Lines
lines: Dict[int, Line] = {
    1: Line(
        id=1,
        name="Warszawa - Kraków",
        edges=[edges[1], edges[2]]
    ),
    2: Line(
        id=2,
        name="Wrocław - Szczecin",
        edges=[edges[3], edges[4]]
    ),
    3: Line(
        id=3,
        name="Warszawa - Kraków Direct",
        edges=[edges[5]]
    ),
}

# Tabela Events
events: Dict[int, Event] = {
    1: Event(
        id="event_1",
        type="delay",
        title="Opóźnienie pociągu",
        description="Pociąg opóźniony o 30 minut",
        timestamp=datetime(2024, 1, 15, 14, 30),
        location=LatLng(lat=52.2322, lng=21.0095),
        routeId="1",
        edge_affected=1,
        time=datetime(2024, 1, 15, 14, 30),
        event_type="delay",
        reportedBy="system"
    ),
    2: Event(
        id="event_2",
        type="technical_issue",
        title="Prace konserwacyjne",
        description="Prace na torowisku",
        timestamp=datetime(2024, 1, 15, 16, 45),
        location=LatLng(lat=50.0614, lng=19.9372),
        routeId="1",
        edge_affected=2,
        time=datetime(2024, 1, 15, 16, 45),
        event_type="maintenance",
        reportedBy="admin"
    ),
    3: Event(
        id="event_3",
        type="cancellation",
        title="Odwołany kurs",
        description="Kurs odwołany z powodu remontu",
        timestamp=datetime(2024, 1, 15, 10, 15),
        location=LatLng(lat=51.1079, lng=17.0385),
        routeId="3",
        edge_affected=3,
        time=datetime(2024, 1, 15, 10, 15),
        event_type="cancellation",
        reportedBy="system"
    ),
}

# Funkcje pomocnicze do manipulacji danymi
