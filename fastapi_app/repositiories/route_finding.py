from models.database_models import LatLng, Stop
from typing import List
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
    nearest_stop = None
    nearest_distance = float('inf')
    
    for stop in stops.values():
        stop_location = LatLng(lat=stop.lat, lng=stop.lon)
        distance = calculate_distance(location, stop_location)
        if distance < nearest_distance:
            nearest_distance = distance
            nearest_stop = stop.id
    
    return nearest_stop
    