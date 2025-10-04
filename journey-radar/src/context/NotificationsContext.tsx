import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/types';
import { notificationsService } from '@/services/notificationsService';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  removeNotification: (notificationId: number) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const POLL_INTERVAL = 5000; // 5 seconds

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    const newNotifications = await notificationsService.getNotifications(user.id);
    setNotifications(newNotifications);
  }, [user?.id]);

  const removeNotification = useCallback((notificationId: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    // Only poll when authenticated
    if (isAuthenticated && user?.id) {
      // Fetch immediately on mount
      fetchNotifications();

      // Set up polling interval
      intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      
      // Clear interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

