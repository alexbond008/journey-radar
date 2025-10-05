# Journey Radar

A comprehensive public transportation monitoring and incident reporting system for the Małopolska region in Poland. Journey Radar provides real-time route information, incident reporting, and community-driven event tracking for bus and train services.

## 🚀 Features

- **Interactive Map View**: Real-time visualization of transportation routes and incidents
- **Incident Reporting**: Community-driven reporting system for delays, cancellations, and other issues
- **Route Finding**: Find optimal routes between stops with real-time incident awareness
- **Event Voting**: Community validation of reported incidents through upvoting/downvoting
- **Real-time Updates**: Live incident tracking and status updates
- **Mobile-First Design**: Responsive interface optimized for mobile devices
- **A chatbot based on a RAG (Retrieval-Augmented Generation) architecture, capable of understanding and interpreting documents and data from transport operators and other official sources.**

## 🏗️ Architecture

Journey Radar is built as a full-stack application with the following components:

### Backend (FastAPI)
- **Technology**: Python 3.13, FastAPI, uv
- **Port**: 8080
- **Features**:
  - RESTful API for routes, stops, and events
  - Real-time incident management
  - Community voting system
  - Route finding algorithms

### Frontend (React + TypeScript)
- **Technology**: React 18, TypeScript, Vite, Tailwind CSS
- **Port**: 3000
- **Features**:
  - Interactive Leaflet maps
  - Modern UI components with Radix UI
  - Real-time data synchronization
  - Mobile-responsive design

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose v2.0+

### Running with Docker Compose

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd journey-radar
   ```

2. **Start both services:**
   ```bash
   docker-compose up
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/docs

### Development Setup

#### Backend Development
```bash
cd fastapi_app
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend Development
```bash
cd journey-radar
npm install
npm run dev
```

## 🎯 Core Functionality

### Route Management
- **Lines**: 4 main transportation lines covering Małopolska region
- **Stops**: Comprehensive stop database with GPS coordinates
- **Route Finding**: Algorithm to find optimal paths between stops

### Incident Reporting System
- **Event Types**: Delay, Cancellation, Crowding, Technical Issues, Accidents, Road Works, Weather, Other
- **Community Validation**: Upvote/downvote system for incident verification
- **Real-time Updates**: Live incident status tracking
- **Geographic Mapping**: Incidents displayed on interactive maps

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13
- **Package Manager**: uv
- **Data Storage**: In-memory (development), extensible for database integration

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Maps**: Leaflet with React-Leaflet
- **State Management**: React Context API
- **HTTP Client**: Axios

### Development Tools
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, TypeScript
- **Package Managers**: npm/pnpm (frontend), uv (backend)

## 🔧 Configuration

### Environment Variables

#### Backend
- `OPENAI_API_KEY`: OpenAI API key for AI features (optional)

#### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8080)
- `VITE_DEFAULT_CENTER_LAT`: Default map center latitude
- `VITE_DEFAULT_CENTER_LON`: Default map center longitude

### Docker Configuration
The application uses Docker Compose for orchestration with:
- Hot reload enabled for development
- Volume mounting for live code updates
- Network mode host for local development

## 📊 Data Coverage

### Transportation Lines
1. **Line 1**: Oświęcim - Kraków
2. **Line 2**: Miechów - Kraków Lotnisko  
3. **Line 3**: Kraków - Zakopane
4. **Line 4**: Kraków - Nowy Sącz

### Geographic Coverage
- **Region**: Małopolska (Lesser Poland)
- **Major Cities**: Kraków, Oświęcim, Miechów, Zakopane, Nowy Sącz
- **Stops**: 50+ transportation stops with GPS coordinates

## 🚨 Incident Types

The system supports reporting and tracking of various incident types:

- 🕒 **Delay**: Service running behind schedule
- 🚫 **Cancellation**: Service cancelled
- 👥 **Crowding**: Overcrowded vehicles
- 🔧 **Technical Issue**: Vehicle or infrastructure problems
- 🚨 **Accident**: Traffic accidents affecting service
- 🚧 **Road Works**: Construction affecting routes
- 🌧️ **Weather**: Weather-related service disruptions
- 📍 **Other**: Miscellaneous incidents

## 🔄 Development Workflow

1. **Code Changes**: Edit files in local directories
2. **Auto-reload**: Both frontend and backend automatically reload on file changes
3. **Testing**: Access frontend at http://localhost:3000 and backend at http://localhost:8080
4. **API Testing**: Use the interactive API docs at http://localhost:8080/docs

## 🐛 Troubleshooting

### Common Issues

**Port Conflicts**: If ports 3000 or 8080 are in use, modify `docker-compose.yml` port mappings.

**Frontend-Backend Connection**: Ensure both containers are running and `VITE_API_URL` is correctly configured.

**Container Issues**: Use `docker-compose logs [service-name]` to debug container problems.

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build

# Stop services
docker-compose down
```

## 📄 Documentation

- [Docker Setup Guide](DOCKER_SETUP.md) - Detailed Docker configuration
- [Events Integration Summary](EVENTS_INTEGRATION_SUMMARY.md) - Incident reporting system
- [Fixes Summary](FIXES_SUMMARY.md) - Recent bug fixes and improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues, questions, or contributions, please refer to the project documentation or create an issue in the repository.

---

**Journey Radar** - Making public transportation more reliable and transparent for the Małopolska community.
