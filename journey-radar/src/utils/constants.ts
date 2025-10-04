// Map configuration
export const MAP_CONFIG = {
  defaultCenter: {
    lat: Number(import.meta.env.VITE_DEFAULT_CENTER_LAT) || 50.0647,
    lon: Number(import.meta.env.VITE_DEFAULT_CENTER_LON) || 19.9450,
  },
  defaultZoom: Number(import.meta.env.VITE_DEFAULT_ZOOM) || 13,
  tileUrl: import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
};

// Incident type colors
export const INCIDENT_COLORS = {
  delay: '#FF9800',              // Orange
  cancellation: '#E91E63',       // Pink
  crowding: '#FFC107',           // Yellow
  technical_issue: '#FF9800',    // Orange
  accident: '#F44336',           // Red
  road_works: '#9C27B0',         // Purple
  weather: '#2196F3',            // Blue
  other: '#757575',              // Grey
};

// Incident type icons
export const INCIDENT_ICONS = {
  delay: '🕒',
  cancellation: '🚫',
  crowding: '👥',
  technical_issue: '🔧',
  accident: '🚨',
  road_works: '🚧',
  weather: '🌧️',
  other: '📍',
};


