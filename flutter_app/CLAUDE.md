# Public Transit Incident Reporting App - Development Guide

## Project Overview
A mobile-first Flutter application demonstrating a "Waze-like" incident reporting system for public transportation users. This is a **mock/prototype application** designed to showcase three core user stories with interactive UI, without backend integration.

## Core User Stories
1. **Event Creation**: Users can report transit incidents from predefined categories
2. **Event Rating**: Users can view and rate the legitimacy of reported incidents
3. **Route Finding**: Users can select routes and view potential disruptions based on reported events

## Tech Stack
- **Framework**: Flutter (mobile-first)
- **Map Provider**: OpenStreetMap via `flutter_map` package (simpler than Google Maps, no API key required for basic usage)
  - Alternative: Mapbox (if more styling control needed)
- **State Management**: keep it super simple
- **Mock Data**: Local JSON files or hardcoded data structures

## Project Structure
```
lib/
├── main.dart
├── models/
│   ├── incident.dart
│   ├── bus_route.dart
│   ├── bus_position.dart
│   └── user_profile.dart
├── screens/
│   ├── home_screen.dart (map + route finder)
│   ├── report_incident_screen.dart
│   ├── incident_detail_screen.dart
│   ├── route_selection_screen.dart
│   └── profile_screen.dart
├── widgets/
│   ├── map_widget.dart
│   ├── incident_marker.dart
│   ├── route_overlay.dart
│   ├── incident_card.dart
│   └── notification_popup.dart
├── services/
│   ├── mock_data_service.dart
│   └── notification_service.dart
├── utils/
│   └── constants.dart
└── theme/
    └── app_theme.dart
```

## Design Guidelines

### Visual Style
- **Modern & Clean**: Minimalist design, ample white space, no unnecessary elements
- **Color Scheme**: 
  - Primary: Blue (#2196F3) for trust and navigation
  - Secondary: Orange (#FF9800) for incidents/alerts
  - Success: Green (#4CAF50) for resolved incidents
  - Danger: Red (#F44336) for critical incidents
  - Background: White/Light gray (#FAFAFA)
- **Typography**: Use Material Design typography, clear hierarchy
- **Icons**: Material Icons or Feather Icons for consistency

### UI Components
- Bottom navigation bar for main sections (Map, Incidents, Profile)
- Floating action button (FAB) for quick incident reporting
- Card-based layouts for incident lists
- Modal bottom sheets for forms and details
- Snackbars/Toast for feedback messages
- Custom popup notifications for real-time alerts

## Mock Backend API Structure

### Suggested Endpoints (for reference, not implemented)
```
GET  /api/incidents              - List all incidents
POST /api/incidents              - Create new incident
GET  /api/incidents/{id}         - Get incident details
POST /api/incidents/{id}/vote    - Upvote/downvote incident
PUT  /api/incidents/{id}/resolve - Mark incident as resolved

GET  /api/routes                 - List available bus routes
GET  /api/routes/{id}            - Get route details with stops
GET  /api/routes/search          - Find routes (from A to B)

GET  /api/buses                  - Get live bus positions
GET  /api/buses/{id}             - Get specific bus location

GET  /api/user/profile           - Get user profile
PUT  /api/user/profile           - Update user profile
```

### Mock Data Structures

#### Incident Model
```dart
class Incident {
  String id;
  IncidentType type;
  String title;
  String description;
  DateTime timestamp;
  LatLng location;
  String routeId;
  int upvotes;
  int downvotes;
  bool isResolved;
  String reportedBy;
}

enum IncidentType {
  delay,
  crowding,
  safety,
  routeChange,
  accident,
  breakdown
}
```

#### Bus Route Model
```dart
class BusRoute {
  String id;
  String name;
  String number;
  List<RouteStop> stops;
  List<LatLng> polyline;
  int estimatedDuration; // minutes
  List<String> activeIncidents; // incident IDs
}

class RouteStop {
  String id;
  String name;
  LatLng location;
  int order;
}
```

#### Bus Position Model
```dart
class BusPosition {
  String busId;
  String routeId;
  LatLng location;
  double heading; // direction in degrees
  DateTime lastUpdate;
  int occupancyLevel; // 0-100%
}
```

## Feature Implementation Details

### 1. Event Creation (User Story 1)
**Flow:**
1. User taps FAB or "Report Incident" button
2. Modal/screen appears with incident form
3. User selects incident type (chips or dropdown)
4. User adds title and optional description
5. Location auto-filled from current map view (or manual selection)
6. User submits → Shows success message → Returns to map with new marker

**UI Components:**
- Category selection with icons (chips or grid)
- Text fields for title/description
- Location preview on mini-map
- Submit button with loading state

### 2. Event Rating (User Story 2)
**Flow:**
1. User taps on incident marker on map OR selects from incident list
2. Bottom sheet/detail screen shows incident details
3. User can upvote/downvote for legitimacy
4. User can mark as resolved (optional)
5. Vote updates in real-time visually

**UI Components:**
- Incident detail card with all info
- Vote buttons (thumb up/down) with count
- "Mark as Resolved" button
- Reporter info and timestamp
- Comments section (optional, can be placeholder)

### 3. Route Finding (User Story 3)
**Flow:**
1. User enters "From" and "To" locations (search or map tap)
2. System shows 2-3 route options with timing
3. Each route displays active incidents as warnings
4. User selects a route → Map shows full route with incident markers
5. Optional: Show live notification popup for new incident on selected route

**UI Components:**
- Search bars with autocomplete (mock data)
- Route option cards with:
  - Bus number/name
  - Duration estimate
  - Incident warnings (count + icons)
  - Transfer information
- Map route overlay with polyline
- Incident badges along route

### Live Notification Feature
**Implementation:**
- Use `flutter_local_notifications` or custom overlay
- Trigger notification 5-10 seconds after route selection (simulated)
- Show popup: "New incident reported: Heavy traffic on Route 42"
- Tappable to view incident details
- Auto-dismiss after 5 seconds

## Map Implementation

### Using flutter_map (OpenStreetMap)
```yaml
dependencies:
  flutter_map: ^6.0.0
  latlong2: ^0.9.0
```

**Map Features:**
- Center on user location (mock coordinates)
- Zoom controls
- Custom markers for:
  - Incidents (color-coded by type)
  - Bus positions (with direction indicator)
  - Bus stops
  - User location
- Route polylines (color-coded)
- Tap handlers for markers

**Mock Coordinates** (example city):
- Center: Warsaw (52.2297, 21.0122)
- Add 10-15 mock incidents around the city
- Add 3-4 bus routes with stops
- Add 5-8 moving buses

## State Management Approach

Use **Provider** for simplicity:
- `IncidentProvider`: Manages incident list, votes, creation
- `RouteProvider`: Manages route search, selection
- `MapProvider`: Manages map state, markers, zoom
- `NotificationProvider`: Manages notification queue

## Mock Data Service

Create a `MockDataService` class that:
- Generates realistic incident data
- Simulates bus positions that update every 3-5 seconds
- Provides route search results
- Handles vote updates locally
- Stores data in memory (no persistence needed)

## Development Guidelines

### Code Style
- Follow Flutter/Dart style guide
- Use meaningful variable names
- Comment complex logic
- Keep widgets small and focused
- Extract reusable components

### Mock Data Best Practices
- Use realistic names and descriptions
- Include timestamp variety (some recent, some old)
- Mix incident types and severities
- Show different vote counts (some controversial, some clear)
- Include resolved and active incidents

### Testing the User Stories
1. **Event Creation**: Verify new incident appears on map immediately
2. **Event Rating**: Verify vote counts update, visual feedback works
3. **Route Finding**: Verify routes show incidents, notification appears

## Animation & Interactions
- Smooth map panning and zooming
- Marker animations when added
- Bottom sheet slide-up animations
- Button press feedback (ripple effect)
- Loading states for all actions
- Notification slide-in animation

## Deliverables Checklist
- [ ] Home screen with interactive map
- [ ] Incident reporting flow (full form)
- [ ] Incident detail view with voting
- [ ] Route search and selection
- [ ] Mock notification popup on route selection
- [ ] Profile screen (basic info display)
- [ ] At least 10 mock incidents on map
- [ ] At least 3 bus routes with stops
- [ ] Smooth animations and transitions
- [ ] Responsive layout for different screen sizes

## Notes for AI Agents
- This is a PROTOTYPE/MOCK - no real backend integration needed
- Focus on UI/UX polish and smooth interactions
- Use hardcoded/mock data throughout
- Simulate real-time updates with timers
- Prioritize visual appeal and ease of demonstration
- All three user stories should be fully interactive
- Keep dependencies minimal
- No authentication or user management needed
- Test on mobile viewport primarily

## Quick Start Commands
```bash
flutter create transit_incident_app
cd transit_incident_app
flutter pub add flutter_map latlong2 provider
flutter run
```