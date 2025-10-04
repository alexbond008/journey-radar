from models.database_models import LatLng, Stop, Line, Schedule
from repositiories.user_repository import get_stop_by_id
from db.dicts import lines
from typing import List, Optional, Dict
from datetime import time, datetime
from queue import PriorityQueue
import math

def calculate_distance(point1: LatLng, point2: LatLng) -> float:
    """
    Oblicza odległość między dwoma punktami geograficznymi używając formuły Haversine.
    Zwraca odległość w kilometrach.
    """
    # Konwersja stopni na radiany
    lat1_rad = math.radians(point1.lat)
    lat2_rad = math.radians(point2.lat)
    delta_lat = math.radians(point2.lat - point1.lat)
    delta_lon = math.radians(point2.lng - point1.lng)
    
    # Format Haversine
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * 
         math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Promień Ziemi w kilometrach
    earth_radius = 6371
    
    return earth_radius * c

def find_nearest_edge(location: LatLng, stops: List[Stop]) -> int:
    """Znajduje najbliższy przystanek do danego punktu"""
    nearest_stop = 1  # Domyślny przystanek
    nearest_distance = float('inf')
    
    for stop in stops:
        stop_location = LatLng(lat=stop.lat, lng=stop.lon)
        distance = calculate_distance(location, stop_location)
        if distance < nearest_distance:
            nearest_distance = distance
            nearest_stop = stop.id
    
    return nearest_stop


def get_next_prev_stop(line: Line, stop: Stop):
    """Znajduje sąsiednie przystanki dla danego przystanku w linii"""
    res = []
    if line and line.edges:
        for edge in line.edges:
            if edge.from_stop == stop.id:
                res.append(edge.to_stop)
            elif edge.to_stop == stop.id:
                res.append(edge.from_stop)
    return res

def get_possible_connect(current_stop: Stop, current_time: time):
    """Znajduje możliwe połączenia z danego przystanku"""
    possible_arriving = []
    current_stop_id = current_stop.id

    for line in lines.values():
        # Sprawdź czy przystanek jest w tej linii
        neighbours = get_next_prev_stop(line, current_stop)
        if not neighbours:
            continue
            
        if line.time_table:
            for schedule in line.time_table:
                stop_to_time = schedule.stop_to_time
                
                # Sprawdź czy przystanek jest w harmonogramie
                if current_stop.id not in stop_to_time:
                    continue
                    
                current_stop_time = stop_to_time[current_stop.id]
                
                # Znajdź następny przystanek w harmonogramie
                for next_stop_id in neighbours:
                    if next_stop_id not in stop_to_time:
                        continue
                        
                    next_stop_time = stop_to_time[next_stop_id]
                    
                    # Sprawdź czy to jest następny przystanek w harmonogramie
                    if next_stop_time > current_stop_time:
                        # Sprawdź czy możemy złapać ten pociąg
                        if current_stop_time >= current_time:
                            # Oblicz czas oczekiwania i podróży
                            waiting_time = (current_stop_time.hour * 60 + current_stop_time.minute) - (current_time.hour * 60 + current_time.minute)
                            travel_time = (next_stop_time.hour * 60 + next_stop_time.minute) - (current_stop_time.hour * 60 + current_stop_time.minute)
                            total_time = waiting_time + travel_time
                            
                            possible_arriving.append((total_time, schedule, next_stop_time, next_stop_id, line))
    
    return possible_arriving

def get_best_route(start: Stop, end: Stop, start_time: time = time(6, 0)) -> Optional[Dict[int, Line]]:
    """Znajduje najlepszą trasę między dwoma przystankami używając algorytmu Dijkstry"""
    visited = set()
    prev = {}  # poprzednik: stop_id -> poprzedni stop_id
    line_info = {}  # stop_id -> (line, schedule) używane do dotarcia
    times = {start.id: 0}  # najlepszy znany czas dojścia w minutach
    q = PriorityQueue()
    q.put((0, start.id, start_time))

    while not q.empty():
        total_time, current_stop_id, current_time = q.get()
        
        if current_stop_id in visited:
            continue
        visited.add(current_stop_id)
        
        current_stop = get_stop_by_id(current_stop_id)

        if current_stop_id == end.id:
            # Rekonstrukcja trasy jako segmenty linii
            return _reconstruct_route_segments(start, end, prev, line_info)

        for diff_time, schedule, arrive_time, next_stop_id, line in get_possible_connect(current_stop, current_time):
            if next_stop_id in visited:
                continue

            new_total_time = total_time + diff_time

            # Jeśli znaleziono lepszy czas
            if next_stop_id not in times or new_total_time < times[next_stop_id]:
                times[next_stop_id] = new_total_time
                prev[next_stop_id] = current_stop_id
                line_info[next_stop_id] = (line, schedule)
                q.put((new_total_time, next_stop_id, arrive_time))

    return None  # brak połączenia

def _reconstruct_route_segments(start: Stop, end: Stop, prev: Dict[int, int], line_info: Dict[int, tuple]) -> Dict[int, Line]:
    """Rekonstruuje trasę jako segmenty linii z przystankami i harmonogramami"""
    # Rekonstrukcja ścieżki
    path = []
    current = end.id
    while current in prev:
        path.append(get_stop_by_id(current))
        current = prev[current]
    path.append(start)
    path.reverse()
    
    # Grupowanie przystanków według linii
    segments = {}
    current_segment = 1
    current_line = None
    current_schedule = None
    segment_stops = []
    
    for i, stop in enumerate(path):
        if i == 0:
            # Pierwszy przystanek - znajdź linię
            if stop.id in line_info:
                current_line, current_schedule = line_info[stop.id]
            else:
                # Znajdź linię zawierającą ten przystanek
                for line in lines.values():
                    if line and line.edges and any(edge.from_stop == stop.id or edge.to_stop == stop.id for edge in line.edges):
                        current_line = line
                        current_schedule = line.time_table[0] if line.time_table else None
                        break
            segment_stops.append(stop)
        else:
            # Sprawdź czy przystanek jest w tej samej linii
            if stop.id in line_info:
                line, schedule = line_info[stop.id]
                if current_line and line.id != current_line.id:
                    # Nowa linia - zapisz poprzedni segment z przystankiem przesiadkowym
                    if current_line and segment_stops and current_schedule:
                        # Dodaj przystanek przesiadkowy na koniec poprzedniego segmentu
                        segment_stops.append(stop)
                        segments[current_segment] = _create_line_segment(current_line, segment_stops, current_schedule)
                        current_segment += 1
                        # Rozpocznij nowy segment od przystanku przesiadkowego
                        segment_stops = [stop]
                        current_line = line
                        current_schedule = schedule
                    else:
                        segment_stops.append(stop)
                else:
                    segment_stops.append(stop)
            else:
                # Sprawdź czy przystanek jest w obecnej linii
                if current_line and current_line.edges and any(edge.from_stop == stop.id or edge.to_stop == stop.id for edge in current_line.edges):
                    segment_stops.append(stop)
                else:
                    # Znajdź nową linię
                    for line in lines.values():
                        if line and line.edges and any(edge.from_stop == stop.id or edge.to_stop == stop.id for edge in line.edges):
                            if current_line and segment_stops and current_schedule:
                                # Dodaj przystanek przesiadkowy na koniec poprzedniego segmentu
                                segment_stops.append(stop)
                                segments[current_segment] = _create_line_segment(current_line, segment_stops, current_schedule)
                                current_segment += 1
                            # Rozpocznij nowy segment od przystanku przesiadkowego
                            segment_stops = [stop]
                            current_line = line
                            current_schedule = line.time_table[0] if line.time_table else None
                            break
    
    # Dodaj ostatni segment
    if current_line and segment_stops and current_schedule:
        segments[current_segment] = _create_line_segment(current_line, segment_stops, current_schedule)
    
    return segments

def _create_line_segment(original_line: Line, stops: List[Stop], schedule: Schedule) -> Line:
    """Tworzy segment linii z podanymi przystankami i harmonogramem"""
    # Filtrowanie harmonogramu tylko dla przystanków w segmencie
    stop_ids = [stop.id for stop in stops]
    filtered_schedule = Schedule(
        id=schedule.id,
        stop_to_time={stop_id: time for stop_id, time in schedule.stop_to_time.items() if stop_id in stop_ids}
    )
    
    return Line(
        id=original_line.id,
        name=original_line.name,
        edges=None,  # edges = None zgodnie z wymaganiem
        time_table=[filtered_schedule],
        stops=stops  # uzupełniamy stops w kolejności jak w trasie
    )

