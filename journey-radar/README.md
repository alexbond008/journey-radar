# Journey-Radar

A React-based public transit incident reporting and route planning application for real-time commuter assistance.

## Features

- 🗺️ Interactive map with real-time incident markers
- 🚌 Route planning and transit stop search
- 📢 Incident reporting with categorization
- 👍 Community voting system for incident legitimacy
- 📱 Mobile-first responsive design
- 🌙 Dark theme UI

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Context API + React Hooks
- **HTTP Client**: Axios
- **Map Library**: Leaflet
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API running on port 8000 (FastAPI)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
pnpm build
```

Preview production build:

```bash
npm run preview
# or
pnpm preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_MAP_TILE_URL` | OpenStreetMap tile URL | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| `VITE_DEFAULT_CENTER_LAT` | Default map center latitude | `50.0647` (Kraków) |
| `VITE_DEFAULT_CENTER_LON` | Default map center longitude | `19.9450` (Kraków) |
| `VITE_DEFAULT_ZOOM` | Default map zoom level | `13` |

## Project Structure

```
src/
├── App.tsx                 # Main app component with routing
├── main.tsx               # Entry point
├── types/                 # TypeScript type definitions
├── pages/                 # Page components
│   ├── MapPage.tsx       # Main map view
│   ├── IncidentsPage.tsx # Incidents list
│   └── ProfilePage.tsx   # User profile
├── components/
│   ├── map/              # Map-related components
│   ├── route/            # Route selector components
│   ├── incident/         # Incident components
│   ├── layout/           # Layout components
│   ├── common/           # Reusable components
│   └── ui/               # UI component library
├── context/              # Context providers
├── hooks/                # Custom React hooks
├── services/             # API service layer
├── utils/                # Utility functions
└── styles/               # Global styles
```

## API Integration

The app expects the following API endpoints:

- `GET /get_stops/` - Retrieve all transit stops
- `GET /get_routes/` - Retrieve all bus/transit routes
- `GET /get_stops_for_route/?id={route_id}` - Get stops for a specific route
- `POST /report_event/` - Submit a new incident report
- `GET /get_events/` - Retrieve all active incidents

See `CLAUDE.md` for detailed API specifications.

## Features Overview

### Map View
- Interactive Leaflet map centered on Kraków
- Real-time incident markers with color coding
- Route polyline visualization
- User location tracking
- Click markers for incident details

### Route Planning
- Autocomplete stop search
- Multi-route suggestions
- Active incident warnings
- Estimated duration display

### Incident Reporting
- Six incident types: Delay, Crowding, Safety, Route Change, Accident, Breakdown
- Location detection
- Route association
- Community voting system

### Incidents List
- Filter by status (active/resolved)
- Sort by recent or most voted
- Filter by route
- Detailed incident information

## Contributing

See `CLAUDE.md` for detailed technical requirements and development guidelines.

## License

See LICENSE file for details.

