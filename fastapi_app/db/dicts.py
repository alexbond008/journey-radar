from pydantic import BaseModel
from models.database_models import Notification, User, Train, Stop, Line, Edge, Event, LatLng, IncidentType
from datetime import datetime
from typing import Dict, List

# Simulacja tabel bazodanowych jako słowniki
# Klucze to ID, wartości to obiekty modeli

# Tabela Users
users: Dict[int, User] = {
    
}

# Tabela Stops - unikalne przystanki z lines.csv
# Każdy przystanek ma unikalny ID nawet jeśli występuje w wielu liniach
stops: Dict[int, Stop] = {
    # Przystanki z różnych linii z unikalnymi ID
    1: Stop(id=1, code="001", name="OŚWIĘCIM", lat=50.0411342, lon=19.1991955),
    2: Stop(id=2, code="002", name="DWORY", lat=50.0455786, lon=19.2854139),
    3: Stop(id=3, code="003", name="WŁOSIENICA", lat=50.0229022, lon=19.3291674),
    4: Stop(id=4, code="004", name="PRZECISZÓW", lat=50.0132897, lon=19.3696046),
    5: Stop(id=5, code="005", name="ZATOR PARK ROZRYWKI", lat=50.0053428, lon=19.4063413),
    6: Stop(id=6, code="006", name="ZATOR", lat=50.002439, lon=19.4280259),
    7: Stop(id=7, code="007", name="SPYTKOWICE", lat=49.9950725, lon=19.4764965),
    8: Stop(id=8, code="008", name="SPYTKOWICE KĘPKI", lat=49.9987488, lon=19.5228164),
    9: Stop(id=9, code="009", name="RYCZÓW", lat=49.9893095, lon=19.5399543),
    10: Stop(id=10, code="010", name="PÓŁWIEŚ", lat=49.9761216, lon=19.5764597),
    11: Stop(id=11, code="011", name="BRZEŹNICA", lat=49.9673471, lon=19.6289564),
    12: Stop(id=12, code="012", name="JAŚKOWICE", lat=49.9617745, lon=19.6752134),
    13: Stop(id=13, code="013", name="WIELKIE DROGI", lat=49.9595323, lon=19.7109099),
    14: Stop(id=14, code="014", name="ZELCZYNA", lat=49.9610742, lon=19.7460175),
    15: Stop(id=15, code="015", name="PODBORY SKAWIŃSKIE", lat=49.9664369, lon=19.7722936),
    16: Stop(id=16, code="016", name="SKAWINA ZACHODNIA", lat=49.9731614, lon=19.7927902),
    17: Stop(id=17, code="017", name="SKAWINA", lat=49.97714, lon=19.8218725),
    18: Stop(id=18, code="018", name="SKAWINA JAGIELNIA", lat=49.9812614, lon=19.8414692),
    19: Stop(id=19, code="019", name="KRAKÓW SIDZINA", lat=49.9855704, lon=19.874778),
    20: Stop(id=20, code="020", name="KRAKÓW OPATKOWICE", lat=49.9888151, lon=19.8994277),
    21: Stop(id=21, code="021", name="KRAKÓW SWOSZOWICE", lat=50.0004047, lon=19.9280566),
    22: Stop(id=22, code="022", name="KRAKÓW ZABŁOCIE", lat=50.0484386, lon=19.956833),
    23: Stop(id=23, code="023", name="KRAKÓW GRZEGÓRZKI", lat=50.0575340858249, lon=19.9479190782688),
    24: Stop(id=24, code="024", name="KRAKÓW GŁÓWNY", lat=50.0683947, lon=19.9475035),
    25: Stop(id=25, code="025", name="KRAKÓW ŁOBZÓW", lat=50.0819062, lon=19.9172491),
    26: Stop(id=26, code="026", name="KRAKÓW BRONOWICE", lat=50.0828134, lon=19.8919081),
    
    # Linia 2 przystanki
    27: Stop(id=27, code="027", name="MIECHÓW", lat=50.3546514, lon=20.0112144),
    28: Stop(id=28, code="028", name="KAMIEŃCZYCE", lat=50.3272584, lon=20.0057885),
    29: Stop(id=29, code="029", name="SZCZEPANOWICE", lat=50.3010946, lon=20.0246682),
    30: Stop(id=30, code="030", name="SMROKÓW", lat=50.2747111, lon=20.0466248),
    31: Stop(id=31, code="031", name="SŁOMNIKI", lat=50.2483244, lon=20.0640672),
    32: Stop(id=32, code="032", name="SŁOMNIKI MIASTO", lat=50.2358343, lon=20.0763817),
    33: Stop(id=33, code="033", name="NIEDŹWIEDŹ", lat=50.2057717, lon=20.08153),
    34: Stop(id=34, code="034", name="GOSZCZA", lat=50.1849737, lon=20.0609405),
    35: Stop(id=35, code="035", name="ŁUCZYCE", lat=50.1626561, lon=20.0744024),
    36: Stop(id=36, code="036", name="BARANÓWKA", lat=50.1467234, lon=20.0953619),
    37: Stop(id=37, code="037", name="ZASTÓW", lat=50.121563, lon=20.0648136),
    38: Stop(id=38, code="038", name="KRAKÓW PIASTÓW", lat=50.1069817, lon=20.0141072),
    39: Stop(id=39, code="039", name="KRAKÓW BATOWICE", lat=50.1074617, lon=19.9954911),
    40: Stop(id=40, code="040", name="KRAKÓW LOTNISKO", lat=50.0708948, lon=19.8014213),
    
    # Linia 3/4 przystanki Wieliczka
    41: Stop(id=41, code="041", name="WIELICZKA RYNEK-KOPALNIA", lat=49.985686, lon=20.056641),
    42: Stop(id=42, code="042", name="WIELICZKA PARK", lat=49.9890933, lon=20.0494485),
    43: Stop(id=43, code="043", name="WIELICZKA BOGUCICE", lat=49.9984505, lon=20.0366077),
    44: Stop(id=44, code="044", name="KRAKÓW BIEŻANÓW DROŻDŻOWNIA", lat=50.0101025, lon=20.0353932),
    45: Stop(id=45, code="045", name="KRAKÓW BIEŻANÓW", lat=50.0212218, lon=20.0296782),
    46: Stop(id=46, code="046", name="KRAKÓW PROKOCIM", lat=50.0265037, lon=19.9989288),
    47: Stop(id=47, code="047", name="KRAKÓW PŁASZÓW", lat=50.0349845, lon=19.9750423),
    48: Stop(id=48, code="048", name="KRAKÓW MŁYNÓWKA", lat=50.0817813, lon=19.8585219),
    49: Stop(id=49, code="049", name="KRAKÓW ZAKLIKI", lat=50.079771, lon=19.849453),
    50: Stop(id=50, code="050", name="KRAKÓW OLSZANICA", lat=50.0764518, lon=19.8254701),
}

# Tabela Edges - bez pola distance (zgodnie z database_models.py)
edges: Dict[int, Edge] = {
    # Linia 1: Oświęcim - Kraków Bronowice (25 przystanków)
    1: Edge(id=1, from_stop=1, to_stop=2),
    2: Edge(id=2, from_stop=2, to_stop=3),
    3: Edge(id=3, from_stop=3, to_stop=4),
    4: Edge(id=4, from_stop=4, to_stop=5),
    5: Edge(id=5, from_stop=5, to_stop=6),
    6: Edge(id=6, from_stop=6, to_stop=7),
    7: Edge(id=7, from_stop=7, to_stop=8),
    8: Edge(id=8, from_stop=8, to_stop=9),
    9: Edge(id=9, from_stop=9, to_stop=10),
    10: Edge(id=10, from_stop=10, to_stop=11),
    11: Edge(id=11, from_stop=11, to_stop=12),
    12: Edge(id=12, from_stop=12, to_stop=13),
    13: Edge(id=13, from_stop=13, to_stop=14),
    14: Edge(id=14, from_stop=14, to_stop=15),
    15: Edge(id=15, from_stop=15, to_stop=16),
    16: Edge(id=16, from_stop=16, to_stop=17),
    17: Edge(id=17, from_stop=17, to_stop=18),
    18: Edge(id=18, from_stop=18, to_stop=19),
    19: Edge(id=19, from_stop=19, to_stop=20),
    20: Edge(id=20, from_stop=20, to_stop=21),
    21: Edge(id=21, from_stop=21, to_stop=22),
    22: Edge(id=22, from_stop=22, to_stop=23),
    23: Edge(id=23, from_stop=23, to_stop=24),
    24: Edge(id=24, from_stop=24, to_stop=25),
    25: Edge(id=25, from_stop=25, to_stop=26),
    
    # Linia 2: Miechów - Kraków Lotnisko
    26: Edge(id=26, from_stop=27, to_stop=28),
    27: Edge(id=27, from_stop=28, to_stop=29),
    28: Edge(id=28, from_stop=29, to_stop=30),
    29: Edge(id=29, from_stop=30, to_stop=31),
    30: Edge(id=30, from_stop=31, to_stop=32),
    31: Edge(id=31, from_stop=32, to_stop=33),
    32: Edge(id=32, from_stop=33, to_stop=34),
    33: Edge(id=33, from_stop=34, to_stop=35),
    34: Edge(id=34, from_stop=35, to_stop=36),
    35: Edge(id=35, from_stop=36, to_stop=37),
    36: Edge(id=36, from_stop=37, to_stop=38),
    37: Edge(id=37, from_stop=38, to_stop=39),
    38: Edge(id=38, from_stop=39, to_stop=21), # KRAKÓW BATOWICE -> KRAKÓW OPATKOWICE (połączenie linii)
    39: Edge(id=39, from_stop=21, to_stop=47), # KRAKÓW OPATKOWICE -> KRAKÓW PŁASZÓW
    40: Edge(id=40, from_stop=47, to_stop=22), # KRAKÓW PŁASZÓW -> KRAKÓW ZABŁOCIE
    41: Edge(id=41, from_stop=22, to_stop=23), # KRAKÓW ZABŁOCIE -> KRAKÓÓW GRZEGÓRZKI
    42: Edge(id=42, from_stop=23, to_stop=24), # KРАKÓW GRZEGÓRZKI -> KRAKÓW GŁÓWNY
    43: Edge(id=43, from_stop=24, to_stop=25), # KRAKÓÓW GŁÓWNY -> KRAKÓW ŁOBZÓW
    44: Edge(id=44, from_stop=25, to_stop=26), # KRAKÓÓW ŁOBZÓW -> KRAKÓW BRONOWICE
    45: Edge(id=45, from_stop=26, to_stop=40), # KRAKÓW BRONOWICE -> KRAKÓW LOTNISKO
    
    # Linia 3: Wieliczka - Kraków Lotnisko
    46: Edge(id=46, from_stop=41, to_stop=42),
    47: Edge(id=47, from_stop=42, to_stop=43),
    48: Edge(id=48, from_stop=43, to_stop=44),
    49: Edge(id=49, from_stop=44, to_stop=45),
    50: Edge(id=50, from_stop=45, to_stop=46),
    51: Edge(id=51, from_stop=46, to_stop=47),
    52: Edge(id=52, from_stop=47, to_stop=22), # KRAKÓW PŁASZÓW -> KRAKÓW ZABŁOCIE (wspólny przystanek)
    53: Edge(id=53, from_stop=22, to_stop=23), # KRAKÓÓW ZABŁOCIE -> KRAKÓW GRZEGÓRZKI (wspólny)
    54: Edge(id=54, from_stop=23, to_stop=24), # KRAKÓW GRZEGÓRZKI -> КRAKÓW GŁÓWNY (wspólny)
    55: Edge(id=55, from_stop=24, to_stop=25), # KRAKÓW GŁÓWNY -> KRAKÓW ŁOBZÓW (wspólny)
    56: Edge(id=56, from_stop=25, to_stop=26), # KRAKÓW ŁOBZÓW -> KRAKÓW BRONOWICE (wspólny)
    57: Edge(id=57, from_stop=26, to_stop=40), # KRAKÓW BRONOWICE -> KRAKÓÓW LOTNISKO (wspólny)
    
    # Linia 4: Wieliczka - Kraków (przez Olszanicę) - tylko różniące się części
    58: Edge(id=58, from_stop=26, to_stop=48), # KRAKÓÓW BRONOWICE -> KRAKÓW MŁYNÓWKA
    59: Edge(id=59, from_stop=48, to_stop=49), # KRAKÓW MŁYNÓWKA -> KRAKÓW ZAKLIKI
    60: Edge(id=60, from_stop=49, to_stop=50), # KRAKÓW ZAKLIKI -> KRAKÓW OLSZANICA
    61: Edge(id=61, from_stop=50, to_stop=40), # KRAKÓW OLSZANICA -> KRAKÓW LOTNISKO
}

# Tabela Lines
lines: Dict[int, Line] = {
    1: Line(
        id=1,
        name="Linia Oświęcim - Kraków",
        edges=[edges[i] for i in range(1, 26)]
    ),
    2: Line(
        id=2,
        name="Linia Miechów - Kraków Lotnisko",
        edges=[edges[i] for i in range(26, 46)]
    ),
    3: Line(
        id=3,
        name="Linia Wieliczka - Kraków Lotnisko",
        edges=[edges[i] for i in range(46, 58)]
    ),
    4: Line(
        id=4,
        name="Linia Wieliczka - Kraków (przez Olszanicę)",
        edges=[edges[i] for i in range(46, 52)] + [edges[i] for i in range(58, 62)]
    ),
}

# Tabela Trains
trains: Dict[int, Train] = {
    101: Train(
        id=101,
        line_id=1,
        current_edge=15,
        position=0.3
    ),
    102: Train(
        id=102,
        line_id=2,
        current_edge=32,
        position=0.7
    ),
    103: Train(
        id=103,
        line_id=3,
        current_edge=46,
        position=0.1
    ),
}

# Tabela Events
events: Dict[int, Event] = {
    1: Event(
        id=1,
        type=IncidentType.DELAY,
        title="Opóźnienie pociągu",
        description="Pociąg opóźniony o 30 minut",
        timestamp=datetime(2024, 1, 15, 14, 30),
        location=LatLng(lat=50.0484386, lng=19.956833),
        edge_affected=22,
        time=datetime(2024, 1, 15, 14, 30),
        event_type="delay",
        reportedBy="system"
    ),
    2: Event(
        id=2,
        type=IncidentType.TECHNICAL_ISSUE,
        title="Prace konserwacyjne",
        description="Prace na torowisku",
        timestamp=datetime(2024, 1, 15, 16, 45),
        location=LatLng(lat=50.0683947, lng=19.9475035),
        edge_affected=23,
        time=datetime(2024, 1, 15, 16, 45),
        event_type="maintenance",
        reportedBy="admin"
    ),
    3: Event(
        id=3,
        type=IncidentType.CANCELLATION,
        title="Odwołany kurs",
        description="Kurs odwołany z powodu remontu",
        timestamp=datetime(2024, 1, 15, 10, 15),
        location=LatLng(lat=50.0828134, lng=19.8919081),
        edge_affected=25,
        time=datetime(2024, 1, 15, 10, 15),
        event_type="cancellation",
        reportedBy="system"
    ),
}
notifications: List[Notification] = [
    Notification(user_id=2, message="Nowy event na twojej linii: Prace konserwacyjne.", timestamp=datetime.now()),
]

# Funkcje pomocnicze do manipulacji danymi
def get_all_users() -> List[User]:
    """Zwraca listę wszystkich użytkowników"""
    return list(users.values())

def get_user_by_id(user_id: int) -> User:
    """Zwraca użytkownika po ID"""
    return users[user_id]

def get_train_by_id(train_id: int) -> Train:
    """Zwraca pociąg po ID"""
    return trains[train_id]

def get_stop_by_id(stop_id: int) -> Stop:
    """Zwraca przystanek po ID"""
    return stops[stop_id]

def get_line_by_id(line_id: int) -> Line:
    """Zwraca linię po ID"""
    return lines[line_id]

def get_edge_by_id(edge_id: int) -> Edge:
    """Zwraca krawędź po ID"""
    return edges[edge_id]

def get_events_by_edge(edge_id: int) -> List[Event]:
    """Zwraca wszystkie eventy dla danej krawędzi"""
    return [event for event in events.values() if event.edge_affected == edge_id]

def get_active_trains() -> List[Train]:
    """Zwraca wszystkie aktywne pociągi"""
    return list(trains.values())

def get_users_on_line(line_id: int) -> List[User]:
    """Zwraca listę użytkowników, którzy są obecnie na danej linii"""
    users_on_line = []
    
    for user in users.values():
        if user.current_train_id:
            train = trains.get(user.current_train_id)
            if train and train.line_id == line_id:
                users_on_line.append(user)
    
    return users_on_line