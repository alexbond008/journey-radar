from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="Krakow Bus Tracker", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TTSS API base URL for Krakow buses
TTSS_BASE_URL = "https://ttss.mpk.krakow.pl/internetservice/"

class VehiclePosition(BaseModel):
    vehicle_id: str
    line: str
    latitude: float
    longitude: float
    heading: Optional[float] = None
    speed: Optional[float] = None
    delay: Optional[int] = None
    timestamp: Optional[str] = None

class BusResponse(BaseModel):
    route: str
    vehicle_count: int
    vehicles: List[VehiclePosition]
    timestamp: str

@app.get("/")
async def root():
    return {
        "message": "Krakow Bus Tracker API",
        "endpoints": {
            "/bus/501": "Get real-time positions of all buses on route 501",
            "/bus/{route_number}": "Get real-time positions for any bus route"
        }
    }

@app.get("/bus/{route_number}", response_model=BusResponse)
async def get_bus_positions(route_number: str):
    """
    Get real-time positions of buses for a specific route in Krakow
    
    Args:
        route_number: Bus route number (e.g., "501", "208", etc.)
    
    Returns:
        BusResponse with vehicle positions and metadata
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Query the TTSS API for vehicle positions
            # The geoJson endpoint returns all vehicles with their positions
            url = f"{TTSS_BASE_URL}/geoserviceDispatcher/services/vehicleinfo/vehicles"
            params = {
                "positionType": "CORRECTED",
                "colorType": "ROUTE_BASED"
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Filter vehicles for the specific route
            import logging
            # logging.error(data)
            vehicles = []
            for vehicle in data["vehicles"]:
                
                if vehicle.get("name"):
                    logging.error(vehicle.get("name").split(' ')[0])
                    if vehicle.get("name").split(' ')[0] == route_number:
                        vehicles.append(VehiclePosition(
                                vehicle_id=vehicle.get("id", "unknown"),
                                line=vehicle.get("name", route_number),
                                latitude=vehicle.get("latitude", 0) / 3600000,  # Convert to degrees
                                longitude=vehicle.get("longitude", 0) / 3600000,  # Convert to degrees
                                heading=vehicle.get("heading"),
                                speed=vehicle.get("speed"),
                                delay=vehicle.get("delay"),
                                timestamp=vehicle.get("timestamp")
                            ))
                        logging.error(vehicles)
            
            if not vehicles:
                raise HTTPException(
                    status_code=404,
                    detail=f"No buses found on route {route_number}. The route might not be active right now."
                )
            
            return BusResponse(
                route=route_number,
                vehicle_count=len(vehicles),
                vehicles=vehicles,
                timestamp=datetime.now().isoformat()
            )
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Error connecting to TTSS API: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/routes")
async def get_available_routes():
    """Get list of all available bus routes with active vehicles"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{TTSS_BASE_URL}/geoserviceDispatcher/services/vehicleinfo/vehicles"
            params = {
                "positionType": "CORRECTED",
                "colorType": "ROUTE_BASED"
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Extract unique route numbers
            routes = set()
            if "vehicles" in data:
                for vehicle in data["vehicles"]:
                    route_name = vehicle.get("name")
                    if route_name:
                        routes.add(route_name)
            
            return {
                "routes": sorted(list(routes)),
                "count": len(routes),
                "timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching routes: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)