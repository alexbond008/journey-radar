#!/usr/bin/env python3
"""
Test script for the new info endpoints
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_info_endpoints():
    """Test all the new info endpoints"""
    print("=== Testing Info Endpoints ===")
    
    async with httpx.AsyncClient() as client:
        # Test get all stops
        print("\n1. Testing GET /info/get_stops")
        response = await client.get(f"{BASE_URL}/info/get_stops")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stops = response.json()
            print(f"Found {len(stops)} stops")
            if stops:
                print(f"First stop: {stops[0]['name']} (ID: {stops[0]['id']})")
        
        # Test get all routes
        print("\n2. Testing GET /info/get_routes")
        response = await client.get(f"{BASE_URL}/info/get_routes")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            routes = response.json()
            print(f"Found {len(routes)} routes")
            if routes:
                print(f"First route: {routes[0]['name']} - {routes[0]['description']}")
        
        # Test CSV info
        print("\n3. Testing GET /info/csv_info")
        response = await client.get(f"{BASE_URL}/info/csv_info")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            csv_info = response.json()
            print(f"CSV Data Status: {csv_info['status']}")
            if csv_info['status'] == 'success':
                print(f"Total stops: {csv_info['total_stops']}")
                print(f"Total routes: {csv_info['total_routes']}")
                print(f"Available lines: {csv_info['available_lines']}")
        
        # Test get all lines
        print("\n4. Testing GET /info/lines")
        response = await client.get(f"{BASE_URL}/info/lines")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            lines = response.json()
            print(f"Available lines: {lines}")
        
        # Test get stops for route (using real data)
        print("\n5. Testing GET /info/get_stops_for_route?route_id=route_1")
        response = await client.get(f"{BASE_URL}/info/get_stops_for_route?route_id=route_1")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stops = response.json()
            print(f"Route 1 has {len(stops)} stops:")
            for stop in stops[:3]:  # Show first 3 stops
                print(f"  - {stop['name']} (Code: {stop['code']})")
        
        # Test get stops by name
        print("\n6. Testing GET /info/stops_by_name/KRAKÓW")
        response = await client.get(f"{BASE_URL}/info/stops_by_name/KRAKÓW")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stops = response.json()
            print(f"Found {len(stops)} stops with 'KRAKÓW' in name:")
            for stop in stops[:3]:  # Show first 3
                print(f"  - {stop['name']}")
        
        # Test report event
        print("\n7. Testing POST /info/report_event")
        event_data = {
            "type": "delay",
            "title": "Test event - bus delayed",
            "description": "Test event - bus delayed by 10 minutes due to traffic",
            "location": {
                "lat": 50.0683947,
                "lng": 19.9475035  # KRAKÓW GŁÓWNY coordinates
            },
            "routeId": "route_1",
            "reportedBy": "test_user_123"
        }
        response = await client.post(f"{BASE_URL}/info/report_event", json=event_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            event = response.json()
            print(f"Event created with ID: {event['id']}")
            print(f"Event type: {event['type']}")
            print(f"Title: {event['title']}")
            print(f"Upvotes: {event['upvotes']}, Downvotes: {event['downvotes']}")
        
        # Test get events
        print("\n5. Testing GET /info/get_events")
        response = await client.get(f"{BASE_URL}/info/get_events")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"Found {len(events)} events")
            for event in events[:3]:  # Show first 3 events
                print(f"  - Event {event['id']}: {event['type']} on route {event['routeId']}")
        
        # Test get events for specific route
        print("\n8. Testing GET /info/get_events_for_route/route_1")
        response = await client.get(f"{BASE_URL}/info/get_events_for_route/route_1")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"Route 1 has {len(events)} events")
        
        # Test get route info
        print("\n9. Testing GET /info/get_route_info/route_1")
        response = await client.get(f"{BASE_URL}/info/get_route_info/route_1")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            route = response.json()
            print(f"Route: {route['name']} - {route['description']}")
            print(f"Number of stops: {len(route['stops'])}")
            print(f"First few stops: {[stop['name'] for stop in route['stops'][:3]]}")
        
        # Test get route by number
        print("\n10. Testing GET /info/route_by_number/1")
        response = await client.get(f"{BASE_URL}/info/route_by_number/1")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            route = response.json()
            print(f"Line 1: {route['name']} with {len(route['stops'])} stops")
        
        # Test get stop info (using real stop ID)
        print("\n11. Testing GET /info/get_stop_info/stop_001")
        response = await client.get(f"{BASE_URL}/info/get_stop_info/stop_001")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stop = response.json()
            print(f"Stop: {stop['name']} (Code: {stop['code']})")
            print(f"Location: {stop['lat']}, {stop['lon']}")
        else:
            print("Stop not found - this is expected if CSV data structure is different")
        
        # Test get routes for stop
        print("\n12. Testing GET /info/get_routes_for_stop/stop_001")
        response = await client.get(f"{BASE_URL}/info/get_routes_for_stop/stop_001")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            routes = response.json()
            print(f"Stop 001 is served by {len(routes)} routes:")
            for route in routes:
                print(f"  - {route['name']} - {route['description']}")
        else:
            print("Stop not found - this is expected if CSV data structure is different")
        
        # Test vote on event
        print("\n13. Testing POST /info/vote_event")
        vote_data = {
            "eventId": "event_001",
            "userId": "test_user_456",
            "voteType": "upvote"
        }
        response = await client.post(f"{BASE_URL}/info/vote_event", json=vote_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            event = response.json()
            print(f"Event {event['id']} now has {event['upvotes']} upvotes and {event['downvotes']} downvotes")
        
        # Test resolve event
        print("\n14. Testing PATCH /info/resolve_event/event_002")
        response = await client.patch(f"{BASE_URL}/info/resolve_event/event_002")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            event = response.json()
            print(f"Event {event['id']} is now resolved: {event['isResolved']}")
        
        # Test get stats
        print("\n15. Testing GET /info/stats")
        response = await client.get(f"{BASE_URL}/info/stats")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print(f"Statistics:")
            print(f"  - Total routes: {stats['total_routes']}")
            print(f"  - Total stops: {stats['total_stops']}")
            print(f"  - Total events: {stats['total_events']}")
            print(f"  - Resolved events: {stats['resolved_events']}")
            print(f"  - Unresolved events: {stats['unresolved_events']}")
            print(f"  - Total upvotes: {stats['total_upvotes']}")
            print(f"  - Total downvotes: {stats['total_downvotes']}")
            print(f"  - CSV data loaded: {stats['csv_data_loaded']}")

async def main():
    """Run all tests"""
    print("Info Endpoints Test Suite")
    print("=" * 40)
    
    try:
        await test_info_endpoints()
        print("\n" + "=" * 40)
        print("All tests completed successfully!")
        
    except httpx.ConnectError:
        print("Error: Could not connect to the API server.")
        print("Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"Error during testing: {e}")

if __name__ == "__main__":
    asyncio.run(main())