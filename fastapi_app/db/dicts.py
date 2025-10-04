from models.database_models import Notification, User, Train, Stop, Line, Edge, Event, LatLng, IncidentType
from datetime import datetime
from typing import Dict, List

# Simulacja tabel bazodanowych jako słowniki
# Klucze to ID, wartości to obiekty modeli

# Tabela Users
users: Dict[int, User] = {}

# Tabela Stops - UNIKALNE przystanki (każdy pojawia się tylko raz, niezależnie od liczby linii)
stops: Dict[int, Stop] = {
    # Wszystkie unikalne przystanki z CSV z jednolitym ID
    1: Stop(id=1, code="OSW01", name="OŚWIĘCIM", lat=50.0411342, lon=19.1991955),
    2: Stop(id=2, code="DWORY", name="DWORY", lat=50.0455786, lon=19.2854139),
    3: Stop(id=3, code="WLOS01", name="WŁOSIENICA", lat=50.0229022, lon=19.3291674),
    4: Stop(id=4, code="PRZE01", name="PRZECISZÓW", lat=50.0132897, lon=19.3696046),
    5: Stop(id=5, code="ZATR01", name="ZATOR PARK ROZRYWKI", lat=50.0053428, lon=19.4063413),
    6: Stop(id=6, code="ZATO01", name="ZATOR", lat=50.002439, lon=19.4280259),
    7: Stop(id=7, code="SPYT01", name="SPYTKOWICE", lat=49.9950725, lon=19.4764965),
    8: Stop(id=8, code="SPKT01", name="SPYTKOWICE KĘPKI", lat=49.9987488, lon=19.5228164),
    9: Stop(id=9, code="RYCZ01", name="RYCZÓW", lat=49.9893095, lon=19.5399543),
    10: Stop(id=10, code="POLW01", name="PÓŁWIEŚ", lat=49.9761216, lon=19.5764597),
    11: Stop(id=11, code="BRZE01", name="BRZEŹNICA", lat=49.9673471, lon=19.6289564),
    12: Stop(id=12, code="JASK01", name="JAŚKOWICE", lat=49.9617745, lon=19.6752134),
    13: Stop(id=13, code="WDRO01", name="WIELKIE DROGI", lat=49.9595323, lon=19.7109099),
    14: Stop(id=14, code="ZELC01", name="ZELCZYNA", lat=49.9610742, lon=19.7460175),
    15: Stop(id=15, code="PODS01", name="PODBORY SKAWIŃSKIE", lat=49.9664369, lon=19.7722936),
    16: Stop(id=16, code="SKAZ01", name="SKAWINA ZACHODNIA", lat=49.9731614, lon=19.7927902),
    17: Stop(id=17, code="SKAW01", name="SKAWINA", lat=49.97714, lon=19.8218725),
    18: Stop(id=18, code="SKAG01", name="SKAWINA JAGIELNIA", lat=49.9812614, lon=19.8414692),
    19: Stop(id=19, code="KSID01", name="KRAKÓW SIDZINA", lat=49.9855704, lon=19.874778),
    20: Stop(id=20, code="KOPA01", name="KRAKÓW OPATKOWICE", lat=49.9888151, lon=19.8994277),
    21: Stop(id=21, code="KSWO01", name="KRAKÓW SWOSZOWICE", lat=50.0004047, lon=19.9280566),
    22: Stop(id=22, code="KZAB01", name="KRAKÓW ZABŁOCIE", lat=50.0484386, lon=19.956833),
    23: Stop(id=23, code="KGRE01", name="KRAKÓW GRZEGÓRZKI", lat=50.0575340858249, lon=19.9479190782688),
    24: Stop(id=24, code="KGL01", name="KRAKÓW GŁÓWNY", lat=50.0683947, lon=19.9475035),
    25: Stop(id=25, code="KLOB01", name="KRAKÓW ŁOBZÓW", lat=50.0819062, lon=19.9172491),
    26: Stop(id=26, code="KBRO01", name="KRAKÓW BRONOWICE", lat=50.0828134, lon=19.8919081),
    
    # Linia 2 - unikalne przystanki Miłchów-Lotnisko  
    30: Stop(id=30, code="MIE01", name="MIECHÓW", lat=50.3546514, lon=20.0112144),
    31: Stop(id=31, code="KAM01", name="KAMIEŃCZYCE", lat=50.3272584, lon=20.0057885),
    32: Stop(id=32, code="SZCZ01", name="SZCZEPANOWICE", lat=50.3010946, lon=20.0246682),
    33: Stop(id=33, code="SMRO01", name="SMROKÓW", lat=50.2747111, lon=20.0466248),
    34: Stop(id=34, code="SLOM01", name="SŁOMNIKI", lat=50.2483244, lon=20.0640672),
    35: Stop(id=35, code="SLMI01", name="SŁOMNIKI MIASTO", lat=50.2358343, lon=20.0763817),
    36: Stop(id=36, code="NIE01", name="NIEDŹWIEDŹ", lat=50.2057717, lon=20.08153),
    37: Stop(id=37, code="GOS01", name="GOSZCZA", lat=50.1849737, lon=20.0609405),
    38: Stop(id=38, code="LUC01", name="ŁUCZYCE", lat=50.1626561, lon=20.0744024),
    39: Stop(id=39, code="BAR01", name="BARANÓWKA", lat=50.1467234, lon=20.0953619),
    40: Stop(id=40, code="ZAS01", name="ZASTÓW", lat=50.121563, lon=20.0648136),
    41: Stop(id=41, code="KPIA01", name="KRAKÓW PIASTÓW", lat=50.1069817, lon=20.0141072),
    42: Stop(id=42, code="KBAT01", name="KRAKÓW BATOWICE", lat=50.1074617, lon=19.9954911),
    43: Stop(id=43, code="KLOT01", name="KRAKÓW LOTNISKO", lat=50.0708948, lon=19.8014213),
    
    # Linia 3/Wieliczka - unikalne przystanki
    50: Stop(id=50, code="WRYN01", name="WIELICZKA RYNEK-KOPALNIA", lat=49.985686, lon=20.056641),
    51: Stop(id=51, code="WPARK01", name="WIELICZKA PARK", lat=49.9890933, lon=20.0494485),
    52: Stop(id=52, code="WBOG01", name="WIELICZKA BOGUCICE", lat=49.9984505, lon=20.0366077),
    53: Stop(id=53, code="KBIE01", name="KRAKÓW BIEŻANÓW DROŻDŻOWNIA", lat=50.0101025, lon=20.0353932),
    54: Stop(id=54, code="KBII01", name="KRAKÓW BIEŻANÓW", lat=50.0212218, lon=20.0296782),
    55: Stop(id=55, code="KPRO01", name="KRAKÓW PROKOCIM", lat=50.0265037, lon=19.9989288),
    56: Stop(id=56, code="KPLA01", name="KRAKÓW PŁASZÓW", lat=50.0349845, lon=19.9750423),
    57: Stop(id=57, code="KMLY01", name="KRAKÓW MŁYNÓWKA", lat=50.0817813, lon=19.8585219),
    58: Stop(id=58, code="KZKL01", name="KRAKÓW ZAKLIKI", lat=50.079771, lon=19.849453),
    59: Stop(id=59, code="KOLS01", name="KRAKÓW OLSZANICA", lat=50.0764518, lon=19.8254701),
}

# Tabela Edges - SEKWENCJA DOKŁADNIE ZA CSV
edges: Dict[int, Edge] = {
    # Linia 1: Oświęcim → Kraków Bronowice (25 edges)
    1: Edge(id=1, from_stop=1, to_stop=2),   # OŚWIĘCIM → DWORY
    2: Edge(id=2, from_stop=2, to_stop=3),   # DWORY → WŁOSIENICA
    3: Edge(id=3, from_stop=3, to_stop=4),   # WŁOSIENICA → PRZECISZÓW
    4: Edge(id=4, from_stop=4, to_stop=5),   # PRZECISZÓW → ZATOR PARK ROZRYWKI
    5: Edge(id=5, from_stop=5, to_stop=6),   # ZATOR PARK ROZRYWKI → ZATOR
    6: Edge(id=6, from_stop=6, to_stop=7),   # ZATOR → SPYTKOWICE
    7: Edge(id=7, from_stop=7, to_stop=8),   # SPYTKOWICE → SPYTKOWICE KĘPKI
    8: Edge(id=8, from_stop=8, to_stop=9),   # SPYTKOWICE KĘPKI → RYCZÓW
    9: Edge(id=9, from_stop=9, to_stop=10),  # RYCZÓW → PÓŁWIEŚ
    10: Edge(id=10, from_stop=10, to_stop=11), # PÓŁWIEŚ → BRZEŹNICA
    11: Edge(id=11, from_stop=11, to_stop=12), # BRZEŹNICA → JAŚKOWICE
    12: Edge(id=12, from_stop=12, to_stop=13), # JAŚKOWICE → WIELKIE DROGI
    13: Edge(id=13, from_stop=13, to_stop=14), # WIELKIE DROGI → ZELCZYNA
    14: Edge(id=14, from_stop=14, to_stop=15), # ZELCZYNA → PODBORY SKAWIŃSKIE
    15: Edge(id=15, from_stop=15, to_stop=16), # PODBORY SKAWIŃSKIE → SKAWINA ZACHODNIA
    16: Edge(id=16, from_stop=16, to_stop=17), # SKAWINA ZACHODNIA → SKAWINA
    17: Edge(id=17, from_stop=17, to_stop=18), # SKAWINA → SKAWINA JAGIELNIA
    18: Edge(id=18, from_stop=18, to_stop=19), # SKAWINA JAGIELNIA → KRAKÓW SIDZINA
    19: Edge(id=19, from_stop=19, to_stop=20), # KRAKÓW SIDZINA → KRAKÓW OPATKOWICE
    20: Edge(id=20, from_stop=20, to_stop=21), # KRAKÓW OPATKOWICE → KRAKÓW SWOSZOWICE
    21: Edge(id=21, from_stop=21, to_stop=22), # KRAKÓW SWOSZOWICE → KRAKÓW ZABŁOCIE
    22: Edge(id=22, from_stop=22, to_stop=23), # KRAKÓW ZABŁOCIE → KRAKÓW GRZEGÓRZKI
    23: Edge(id=23, from_stop=23, to_stop=24), # KRAKÓW GRZEGÓRZKI → KRAKÓW GŁÓWNY
    24: Edge(id=24, from_stop=24, to_stop=25), # KRAKÓW GŁÓWNY → KRAKÓW ŁOBZÓW
    25: Edge(id=25, from_stop=25, to_stop=26), # KRAKÓW ŁOBZÓW → KRAKÓÓW BRONOWICE
    
    # Linia 2: Miechów → Kraków Lotnisko (18 edges)
    30: Edge(id=30, from_stop=30, to_stop=31), # MIECHÓW → KAMIEŃCZYCE
    31: Edge(id=31, from_stop=31, to_stop=32), # KAMIEŃCZYCE → SZCZEPANOWICE
    32: Edge(id=32, from_stop=32, to_stop=33), # SZCZEPANOWICE → SMROKÓW
    33: Edge(id=33, from_stop=33, to_stop=34), # SMROKÓW → SŁOMNIKI
    34: Edge(id=34, from_stop=34, to_stop=35), # SŁOMNIKI → SŁOMNIKI MIASTO
    35: Edge(id=35, from_stop=35, to_stop=36), # SŁOMNIKI MIASTO → NIEDŹWIEDŹ
    36: Edge(id=36, from_stop=36, to_stop=37), # NIEDŹWIEDŹ → GOSZCZA
    37: Edge(id=37, from_stop=37, to_stop=38), # GOSZCZA → ŁUCZYCE
    38: Edge(id=38, from_stop=38, to_stop=39), # ŁUCZYCE → BARANÓWKA
    39: Edge(id=39, from_stop=39, to_stop=40), # BARANÓWKA → ZASTÓW
    40: Edge(id=40, from_stop=40, to_stop=41), # ZASTÓW → KRAKÓW PIASTÓW
    41: Edge(id=41, from_stop=41, to_stop=42), # KRAKÓW PIASTÓW → KRAKÓW BATOWICE
    42: Edge(id=42, from_stop=42, to_stop=22), # KRAKÓW BATOWICE → KRAKÓW ZABŁOCIE (wspólny!)
    43: Edge(id=43, from_stop=22, to_stop=23), # KRAKÓW ZABŁOCIE → KRAKÓW GRZEGÓRZKI (wspólny!)
    44: Edge(id=44, from_stop=23, to_stop=24), # KRAKÓW GRZEGÓRZKI → KRAKÓW GŁÓWNY (wspólny!)
    45: Edge(id=45, from_stop=24, to_stop=25), # KRAKÓW GŁÓWNY → KRAKÓW ŁOBZÓW (wspólny!)
    46: Edge(id=46, from_stop=25, to_stop=26), # KRAKÓW ŁOBZÓW → KRAKÓW BRONOWICE (wspólny!)
    47: Edge(id=47, from_stop=26, to_stop=43), # KRAKÓW BRONOWICE → KRAKÓW LOTNISKO
    
    # Linia 3: Wieliczka RYNEK-KOPALNIA → Kraków Lotnisko (11 edges)
    50: Edge(id=50, from_stop=50, to_stop=51), # WIELICZKA RYNEK-KOPALNIA → WIELICZKA PARK
    51: Edge(id=51, from_stop=51, to_stop=52), # WIELICZKA PARK → WIELICZKA BOGUCICE
    52: Edge(id=52, from_stop=52, to_stop=53), # WIELICZKA BOGUCICE → KRAKÓW BIEŻANÓW DROŻDŻOWNIA
    53: Edge(id=53, from_stop=53, to_stop=54), # KRAKÓW BIEŻANÓW DROŻDŻOWNIA → KRAKÓW BIEŻANÓW
    54: Edge(id=54, from_stop=54, to_stop=55), # KRAKÓW BIEŻANÓW → KRAKÓW PROKOCIM
    55: Edge(id=55, from_stop=55, to_stop=56), # KRAKÓW PROKOCIM → KRAKÓW PŁASZÓW
    56: Edge(id=56, from_stop=56, to_stop=22), # KRAKÓW PŁASZÓW → KRAKÓW ZABŁOCIE (wspólny!)
    57: Edge(id=57, from_stop=22, to_stop=23), # KRAKÓW ZABŁOCIE → KRAKÓW GRZEGÓRZKI (wspólny!)
    58: Edge(id=58, from_stop=23, to_stop=24), # KRAKÓÓW GRZEGÓRZKI → KRAKÓW GŁÓWNY (wspólny!)
    59: Edge(id=59, from_stop=24, to_stop=25), # KRAKÓÓW GŁÓWNY → KRAKÓW ŁOBZÓW (wspólny!)
    60: Edge(id=60, from_stop=25, to_stop=26), # KRAKÓW ŁOBZÓW → KRAKÓW BRONOWICE (wspólny!)
    61: Edge(id=61, from_stop=26, to_stop=57), # KRAKÓÓW BRONOWICE → KRAKÓÓW MŁYNÓWKA
    62: Edge(id=62, from_stop=57, to_stop=58), # KRAKÓÓW MŁYNÓWKA → KRAKÓW ZAKLIKI
    63: Edge(id=63, from_stop=58, to_stop=59), # KRAKÓW ZAKLIKI → KRAKÓW OLSZANICA
    64: Edge(id=64, from_stop=59, to_stop=43),  # KRAKÓÓW OLSZANICA → KRAKÓÓW LOTNISKO
    
    # Linia 4: KRAKÓW OPATKOWICE → WIELICZKA RYNEK-KOPALNIA (8 edges)
    70: Edge(id=70, from_stop=20, to_stop=21), # KRAKÓW OPATKOWICE → KRAKÓW SWOSZOWICE
    71: Edge(id=71, from_stop=21, to_stop=56), # KRAKÓW SWOSZOWICE → KRAKÓW PŁASZÓW
    72: Edge(id=72, from_stop=56, to_stop=55), # KRAKÓW PŁASZÓW → KRAKÓW PROKOCIM
    73: Edge(id=73, from_stop=55, to_stop=54), # KRAKÓW PROKOCIM → KRAKÓÓW BIEŻANÓW
    74: Edge(id=74, from_stop=54, to_stop=53), # KRAKÓW BIEŻANÓW → KRAKÓW BIEŻANÓW DROŻDŻOWNIA
    75: Edge(id=75, from_stop=53, to_stop=52), # KRAKÓW BIEŻANÓW DROŻDŻOWNIA → WIELICZKA BOGUCICE
    76: Edge(id=76, from_stop=52, to_stop=51), # WIELICZKA BOGUCICE → WIELICZKA PARK
    77: Edge(id=77, from_stop=51, to_stop=50), # WIELICZKA PARK → WIELICZKA RYNEK-KOPALNIA
}

# Tabela Lines - kompletne ranges według CSV
lines: Dict[int, Line] = {
    1: Line(
        id=1,
        name="Linia Oświęcim - Kraków",
        edges=[edges[i] for i in range(1, 26)]
    ),
    2: Line(
        id=2,
        name="Linia Miechów - Kraków Lotnisko",
        edges=[edges[i] for i in range(30, 48)]
    ),
    3: Line(
        id=3,
        name="Linia Wieliczka - Kraków Lotnisko",
        edges=[edges[i] for i in range(50, 65)]
    ),
    4: Line(
        id=4,
        name="Linia KRAKÓW OPATKOWICE - WIELICZKA",
        edges=[edges[i] for i in range(70, 78)]
    ),
}

# Tabela Trains
trains: Dict[int, Train] = {
    101: Train(id=101, line_id=1, current_edge=15, position=0.3),
    102: Train(id=102, line_id=2, current_edge=36, position=0.7),
    103: Train(id=103, line_id=3, current_edge=50, position=0.1),
    104: Train(id=104, line_id=4, current_edge=70, position=0.8),
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

def my_print(lines_dict: Dict[int, Line]):
    """Wypisuje po kolei nazwy przystanków dla każdej linii"""
    for line_id, line in lines_dict.items():
        print(f"\n🚆 LINIA {line_id}: {line.name}")
        print("=" * 60)
        
        # Zbieramy przystanki w kolejności edges
        stations_in_order = []
        for edge in line.edges:
            from_stop = stops.get(edge.from_stop)
            if from_stop and len(stations_in_order) == 0:
                # Dodaj pierwszy przystanek
                stations_in_order.append(from_stop.name)
            
            to_stop = stops.get(edge.to_stop)
            if to_stop:
                stations_in_order.append(to_stop.name)
        
        # Wypisujemy po kolei
        for i, station_name in enumerate(stations_in_order, 1):
            print(f"   {i:2d}. {station_name}")
        
        print(f"   📊 Łącznie: {len(stations_in_order)} przystanków")

notifications: list[Notification] = []

if __name__ == "__main__":
    my_print(lines)