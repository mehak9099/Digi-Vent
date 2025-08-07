import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

// Local storage key
const NOTIFICATIONS_STORAGE_KEY = 'digi-vent-notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with mock data
  const initializeMockData = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        user_id: user?.id || 'demo-user',
        title: 'New Event Assignment',
        message: 'You have been assigned to help with TechFest 2025 setup.',
        type: 'info',
        is_read: false,
        action_url: '/admin/events/1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: '2',
        user_id: user?.id || 'demo-user',
        title: 'Task Completed',
        message: 'Great job completing the venue booking task!',
        type: 'success',
        is_read: false,
        action_url: '/tasks/board',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: '3',
        user_id: user?.id || 'demo-user',
        title: 'Upcoming Event Reminder',
        message: 'Community Food Drive is scheduled for tomorrow at 8:00 AM.',
        type: 'warning',
        is_read: true,
        action_url: '/event/2',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
      }
    ];

    const storageKey = `${NOTIFICATIONS_STORAGE_KEY}-${user?.id || 'guest'}`;
    const storedNotifications = localStorage.getItem(storageKey);
    if (!storedNotifications) {
      localStorage.setItem(storageKey, JSON.stringify(mockNotifications));
      return mockNotifications;
    }

    return JSON.parse(storedNotifications);
  };

  const fetchNotifications = async () => {
    try {
      if (!user) return;

      setLoading(true);
      setError(null);

      const userNotifications = initializeMockData();
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const storageKey = `${NOTIFICATIONS_STORAGE_KEY}-${user?.id || 'guest'}`;
      const storedNotifications = localStorage.getItem(storageKey);
      const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

      const updatedNotifications = currentNotifications.map((notification: Notification) => 
        notification.id === id 
          ? { ...notification, is_read: true }
          : notification
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to mark notification as read' 
      };
    }
  };

  const markAllAsRead = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const storageKey = `${NOTIFICATIONS_STORAGE_KEY}-${user.id}`;
      const storedNotifications = localStorage.getItem(storageKey);
      const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

      const updatedNotifications = currentNotifications.map((notification: Notification) => ({
        ...notification,
        is_read: true
      }));

      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      return { success: true };
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to mark all notifications as read' 
      };
    }
  };

  const createNotification = async (notificationData: Omit<NotificationInsert, 'user_id'>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        ...notificationData,
        user_id: user.id,
        is_read: false,
        created_at: new Date().toISOString()
      };

      const storageKey = `${NOTIFICATIONS_STORAGE_KEY}-${user.id}`;
      const storedNotifications = localStorage.getItem(storageKey);
      const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      const updatedNotifications = [newNotification, ...currentNotifications];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      return { success: true };
    } catch (err) {
      console.error('Error creating notification:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create notification' 
      };
    }
  };

  const deleteNotification = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const storageKey = `${NOTIFICATIONS_STORAGE_KEY}-${user?.id || 'guest'}`;
      const storedNotifications = localStorage.getItem(storageKey);
      const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

      const notification = currentNotifications.find((n: Notification) => n.id === id);
      const filteredNotifications = currentNotifications.filter((n: Notification) => n.id !== id);
      
      localStorage.setItem(storageKey, JSON.stringify(filteredNotifications));
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return { success: true };
    } catch (err) {
      console.error('Error deleting notification:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete notification' 
      };
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
    refetch: fetchNotifications
  };
};