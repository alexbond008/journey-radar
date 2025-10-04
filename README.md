x# Journey-Radar  

Journey-Radar is a commuter assistance application designed to help users plan and monitor their journeys in real time. The app focuses on identifying and displaying potential and confirmed issues along a route, helping commuters make better travel decisions.  

---

## Core Functionality  

### 1. User Login & Problem Reporting  
- Users can log in and report issues they encounter during their commute.  
- A **“Report Issue” button** opens a drop-down menu of problem types (e.g., crash, traffic, harsh weather).  
- Submitted reports are sent to the backend for processing and aggregation.  

### 2. Route Planning & Visualization  
- Users can enter a **start point** and **destination** to generate a route (e.g., Tarnów → Kraków).  
- The route is displayed on an **interactive map** powered by open-source mapping (e.g., OpenStreetMap).  
- The map overlays problems along the route:  
  - **Yellow markers** = potential issues.  
  - **Red markers** = confirmed issues.  
- Confirmed issues come from trusted sources (e.g., PKP, official train operators) or a high volume of similar user reports.  

### 3. Live Commute Tracking  
- During a journey, the app tracks the user’s **live location**.  
- The map updates in real time to show nearby problems or disturbances along the route.  

---

## Map & Visualization  
- The **map is the core of the application**, always visible as the main screen.  
- Users can interact with the map (pan, zoom, tap markers).  
- The UI highlights different problem levels with distinct icons and colors.  

---

## Region Focus (Demo Purpose)  
- For demonstration, the application is focused on the **Małopolska region of Poland**.  
- Example journey: **Tarnów → Kraków by train**.  

---

## Summary  
Journey-Radar provides commuters with a clear and reliable overview of possible disruptions during their travel. By combining **user reports** and **trusted data sources**, it helps distinguish between potential and confirmed incidents, improving trust and decision-making for daily commuters.  
