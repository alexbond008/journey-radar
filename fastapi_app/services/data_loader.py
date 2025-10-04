import csv
import os
from typing import List, Dict, Set
from models.database_models import Stop, Route, LatLng

class DataLoader:
    def __init__(self, csv_file_path: str = "lines.csv"):
        self.csv_file_path = csv_file_path
        self.stops: List[Stop] = []
        self.routes: List[Route] = []
        
    def load_data(self) -> tuple[List[Stop], List[Route]]:
        """Load stops and routes from CSV file"""
        if not os.path.exists(self.csv_file_path):
            raise FileNotFoundError(f"CSV file not found: {self.csv_file_path}")
        
        # Parse CSV data
        csv_data = self._parse_csv()
        
        # Create stops (unique by name and coordinates)
        self.stops = self._create_stops(csv_data)
        
        # Create routes grouped by line number
        self.routes = self._create_routes(csv_data)
        
        return self.stops, self.routes
    
    def _parse_csv(self) -> List[Dict]:
        """Parse CSV file and return list of dictionaries"""
        data = []
        with open(self.csv_file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data.append({
                    'stop_lat': float(row['stop_lat']),
                    'stop_lon': float(row['stop_lon']),
                    'stop_name': row['stop_name'].strip(),
                    'linia': row['linia'].strip()
                })
        return data
    
    def _create_stops(self, csv_data: List[Dict]) -> List[Stop]:
        """Create unique stops from CSV data"""
        stops_dict = {}
        stop_counter = 1
        
        for row in csv_data:
            # Create a unique key based on name and coordinates
            key = f"{row['stop_name']}_{row['stop_lat']}_{row['stop_lon']}"
            
            if key not in stops_dict:
                stops_dict[key] = Stop(
                    id=f"stop_{stop_counter:03d}",
                    code=f"{stop_counter:03d}",
                    name=row['stop_name'],
                    description=f"Przystanek {row['stop_name']}",
                    lat=row['stop_lat'],
                    lon=row['stop_lon']
                )
                stop_counter += 1
        
        return list(stops_dict.values())
    
    def _create_routes(self, csv_data: List[Dict]) -> List[Route]:
        """Create routes grouped by line number"""
        routes_dict = {}
        
        # Group stops by line number
        for row in csv_data:
            line_number = row['linia']
            
            if line_number not in routes_dict:
                routes_dict[line_number] = {
                    'stops': [],
                    'stop_names': set()
                }
            
            # Add stop if not already added (avoid duplicates)
            stop_name = row['stop_name']
            if stop_name not in routes_dict[line_number]['stop_names']:
                routes_dict[line_number]['stops'].append({
                    'name': stop_name,
                    'lat': row['stop_lat'],
                    'lon': row['stop_lon']
                })
                routes_dict[line_number]['stop_names'].add(stop_name)
        
        # Create Route objects
        routes = []
        route_counter = 1
        
        for line_number, route_data in routes_dict.items():
            # Find corresponding Stop objects
            route_stops = []
            for stop_data in route_data['stops']:
                # Find the stop in our stops list
                matching_stop = next(
                    (stop for stop in self.stops 
                     if stop.name == stop_data['name'] 
                     and abs(stop.lat - stop_data['lat']) < 0.0001 
                     and abs(stop.lon - stop_data['lon']) < 0.0001),
                    None
                )
                if matching_stop:
                    route_stops.append(matching_stop)
            
            # Create route
            route = Route(
                id=f"route_{line_number}",
                name=f"Linia {line_number}",
                number=line_number,
                description=f"Trasa linii {line_number}",
                stops=route_stops
            )
            routes.append(route)
            route_counter += 1
        
        return routes
    
    def get_stop_by_name(self, name: str) -> Stop | None:
        """Find stop by name"""
        return next((stop for stop in self.stops if stop.name == name), None)
    
    def get_stops_by_line(self, line_number: str) -> List[Stop]:
        """Get all stops for a specific line"""
        route = next((route for route in self.routes if route.number == line_number), None)
        return route.stops if route else []
    
    def get_route_by_number(self, line_number: str) -> Route | None:
        """Get route by line number"""
        return next((route for route in self.routes if route.number == line_number), None)
    
    def get_all_lines(self) -> List[str]:
        """Get all line numbers"""
        return [route.number for route in self.routes]
    
    def get_stats(self) -> Dict:
        """Get statistics about loaded data"""
        total_stops = len(self.stops)
        total_routes = len(self.routes)
        
        # Count stops per route
        stops_per_route = {route.number: len(route.stops) for route in self.routes}
        
        return {
            "total_stops": total_stops,
            "total_routes": total_routes,
            "stops_per_route": stops_per_route,
            "lines": self.get_all_lines()
        }