# Docker Setup Guide

This guide explains how to run the Journey Radar application using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

## Quick Start

1. **Start both services:**
   ```bash
   docker-compose up
   ```

2. **Start in detached mode (background):**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Services

### Backend (FastAPI)
- **Container:** journey-radar-backend
- **Port:** 8080
- **Technology:** Python 3.13, FastAPI, uv
- **Hot reload:** Enabled (mounted volume)

### Frontend (React + Vite)
- **Container:** journey-radar-frontend
- **Port:** 3000
- **Technology:** Node.js 20, React, TypeScript, Vite
- **Hot reload:** Enabled (mounted volume)
- **API URL:** Configured to connect to backend at http://localhost:8080

## Configuration

### Environment Variables

The frontend is configured to communicate with the backend using the `VITE_API_URL` environment variable.

You can customize environment variables in the `docker-compose.yml` file:

```yaml
environment:
  - VITE_API_URL=http://localhost:8080
  - VITE_DEFAULT_CENTER_LAT=50.0647
  - VITE_DEFAULT_CENTER_LON=19.9450
```

## Common Commands

### Start services
```bash
docker-compose up
```

### Stop services
```bash
docker-compose down
```

### Rebuild containers (after dependency changes)
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Restart a service
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Execute commands in a container
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

## Development Workflow

1. **Code changes:** Make changes to your code in the local directories
2. **Auto-reload:** Both frontend and backend will automatically reload when you save files
3. **View changes:** Refresh your browser to see frontend changes

## Troubleshooting

### Port already in use
If ports 3000 or 8080 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port from 3000 to 3001
```

### Frontend can't connect to backend
1. Ensure both containers are running: `docker-compose ps`
2. Check backend is accessible: `curl http://localhost:8080`
3. Verify VITE_API_URL in docker-compose.yml

### Container won't start
1. Check logs: `docker-compose logs [service-name]`
2. Rebuild: `docker-compose up --build`
3. Remove old containers: `docker-compose down -v`

### Changes not reflecting
1. For dependency changes, rebuild: `docker-compose up --build`
2. For environment variable changes, restart: `docker-compose restart`
3. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

## Production Considerations

For production deployment, consider:

1. **Build optimized frontend:**
   - Modify frontend Dockerfile to use `npm run build`
   - Serve with nginx or similar

2. **Environment variables:**
   - Use `.env` file for sensitive data
   - Don't commit secrets to version control

3. **Remove volume mounts:**
   - Code is baked into the image
   - No hot reload needed

4. **Add database service:**
   - PostgreSQL, MongoDB, etc.
   - Configure connection strings

5. **Add reverse proxy:**
   - Nginx for routing and SSL termination
   - Single entry point for frontend and API

## Network Architecture

```
┌─────────────────────────────────────┐
│   journey-radar-network (bridge)   │
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │ Frontend │──────│ Backend  │   │
│  │  :3000   │      │  :8080   │   │
│  └──────────┘      └──────────┘   │
│       │                  │         │
└───────┼──────────────────┼─────────┘
        │                  │
        │                  │
    Port 3000          Port 8080
        │                  │
        └──────────────────┘
              Host
```

## License

See main project LICENSE file.

