from models.schemes import User, Train, Stop, Line, Edge, Event, Coordinates
from datetime import datetime
from typing import Dict, List

# Simulacja tabel bazodanowych jako słowniki
# Klucze to ID, wartości to obiekty modeli

# Tabela Users
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
        id=1,
        coordinates=Coordinates(latitude=52.2297, longitude=21.0122),
        name="Warszawa Centralna"
    ),
    2: Stop(
        id=2,
        coordinates=Coordinates(latitude=52.2374, longitude=21.0095),
        name="Warszawa Wschodnia"
    ),
    3: Stop(
        id=3,
        coordinates=Coordinates(latitude=50.0614, longitude=19.9372),
        name="Kraków Główny"
    ),
    4: Stop(
        id=4,
        coordinates=Coordinates(latitude=51.1079, longitude=17.0385),
        name="Wroclaw Główny"
    ),
    5: Stop(
        id=5,
        coordinates=Coordinates(latitude=53.4285, longitude=14.5530),
        name="Szczecin Główny"
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
        id=1,
        coordinates=Coordinates(latitude=52.2322, longitude=21.0095),
        edge_affected=1,
        time=datetime(2024, 1, 15, 14, 30),
        event_type="delay"
    ),
    2: Event(
        id=2,
        coordinates=Coordinates(latitude=50.0614, longitude=19.9372),
        edge_affected=2,
        time=datetime(2024, 1, 15, 16, 45),
        event_type="maintenance"
    ),
    3: Event(
        id=3,
        coordinates=Coordinates(latitude=51.1079, longitude=17.0385),
        edge_affected=3,
        time=datetime(2024, 1, 15, 10, 15),
        event_type="cancellation"
    ),
}

# Funkcje pomocnicze do manipulacji danym
