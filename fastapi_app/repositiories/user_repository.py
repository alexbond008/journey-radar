from models.database_models import User, Train, Stop, Line, Edge, Event, LatLng, Schedule
from datetime import time, datetime
from typing import Dict, List, Optional
from db.dicts import users, trains, stops, events,  edges, lines, schedules

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
    
    return users_on_lines

def update_user_level(user_id: int, flag: bool) -> User:
    """Aktualizuje poziom użytkownika"""
    
    user = get_user_by_id(user_id)

    if flag:
        user.level += 1
    else:
        user.level -= 1

    users[user_id] = user

    if user.level < 0:
        user.reputation = "czarna lista"
    elif user.level < 10:
        user.reputation = "początkujący podróżnik"
    elif user.level < 20:
        user.reputation = "podróżnik"
    elif user.level < 30:
        user.reputation = "ekspert podróży"
    elif user.level < 40:
        user.reputation = "mistrz podróży"
    elif user.level < 50:
        user.reputation = "legenda podróży"
    else:
        user.reputation = "guru podróży"

    return user

def get_all_stops() -> List[Stop]:
    """Zwraca listę wszystkich przystanków"""

    stops_list = list(stops.values())
    return stops_list

def get_schedules_by_line(line_id: int) -> List[Schedule]:
    """Zwraca listę harmonogramów dla danej linii"""
    line = lines.get(line_id)
    if line:
        return line.time_table
    return []

def get_schedule_by_id(schedule_id: int) -> Schedule:
    """Zwraca harmonogram po ID"""
    return schedules[schedule_id]

