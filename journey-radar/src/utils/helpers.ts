import { IncidentType } from '@/types';
import { INCIDENT_COLORS, INCIDENT_ICONS } from './constants';

export const getIncidentColor = (type: IncidentType): string => {
  const colors: Record<IncidentType, string> = {
    [IncidentType.DELAY]: INCIDENT_COLORS.delay,
    [IncidentType.CANCELLATION]: INCIDENT_COLORS.cancellation,
    [IncidentType.CROWDING]: INCIDENT_COLORS.crowding,
    [IncidentType.TECHNICAL_ISSUE]: INCIDENT_COLORS.technical_issue,
    [IncidentType.ACCIDENT]: INCIDENT_COLORS.accident,
    [IncidentType.ROAD_WORKS]: INCIDENT_COLORS.road_works,
    [IncidentType.WEATHER]: INCIDENT_COLORS.weather,
    [IncidentType.OTHER]: INCIDENT_COLORS.other,
  };
  return colors[type] || INCIDENT_COLORS.other;
};

export const getIncidentIcon = (type: IncidentType): string => {
  const icons: Record<IncidentType, string> = {
    [IncidentType.DELAY]: INCIDENT_ICONS.delay,
    [IncidentType.CANCELLATION]: INCIDENT_ICONS.cancellation,
    [IncidentType.CROWDING]: INCIDENT_ICONS.crowding,
    [IncidentType.TECHNICAL_ISSUE]: INCIDENT_ICONS.technical_issue,
    [IncidentType.ACCIDENT]: INCIDENT_ICONS.accident,
    [IncidentType.ROAD_WORKS]: INCIDENT_ICONS.road_works,
    [IncidentType.WEATHER]: INCIDENT_ICONS.weather,
    [IncidentType.OTHER]: INCIDENT_ICONS.other,
  };
  return icons[type] || INCIDENT_ICONS.other;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};


