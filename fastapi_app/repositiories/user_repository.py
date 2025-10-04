from models.schemes import User, Train, Stop, Line, Edge, Event, Coordinates
from datetime import datetime
from typing import Dict, List
from db.dicts import users, trains, stops, events,  edges, lines

class UserRepository():
    def get_all_users(self,) -> List[User]:
        """Zwraca listę wszystkich użytkowników"""
        return list(users.values())

    def get_user_by_id(self,user_id: int) -> User:
        """Zwraca użytkownika po ID"""
        return users[user_id]

    def get_train_by_id(self,train_id: int) -> Train:
        """Zwraca pociąg po ID"""
        return trains[train_id]

    def get_stop_by_id(self,stop_id: int) -> Stop:
        """Zwraca przystanek po ID"""
        return stops[stop_id]

    def get_line_by_id(self,line_id: int) -> Line:
        """Zwraca linię po ID"""
        return lines[line_id]

    def get_edge_by_id(self,edge_id: int) -> Edge:
        """Zwraca krawędź po ID"""
        return edges[edge_id]

    def get_events_by_edge(self,edge_id: int) -> List[Event]:
        """Zwraca wszystkie eventy dla danej krawędzi"""
        return [event for event in events.values() if event.edge_affected == edge_id]

    def get_active_trains(self) -> List[Train]:
        """Zwraca wszystkie aktywne pociągi"""
        return list(trains.values())

    def get_users_on_line(self,line_id: int) -> List[User]:
        """Zwraca listę użytkowników, którzy są obecnie na danej linii"""
        users_on_line = []
        
        for user in users.values():
            if user.current_train_id:
                train = trains.get(user.current_train_id)
                if train and train.line_id == line_id:
                    users_on_line.append(user)
        
        return users_on_line