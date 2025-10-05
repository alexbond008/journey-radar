import api from './api';
import { Notification } from '@/types';

export const notificationsService = {
  /**
   * Get notifications for a specific user
   */
  getNotifications: async (userId: number): Promise<Notification[]> => {
    try {
      const response = await api.get<Notification[]>(`/info/notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
};

