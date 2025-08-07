import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Event = Database['public']['Tables']['events']['Row'] & {
  organizer?: Database['public']['Tables']['profiles']['Row'];
  registrations?: Database['public']['Tables']['event_registrations']['Row'][];
};

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

// Local storage keys
const EVENTS_STORAGE_KEY = 'digi-vent-events';
const REGISTRATIONS_STORAGE_KEY = 'digi-vent-registrations';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with mock data
  const initializeMockData = () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'TechFest 2025',
        description: 'Annual technology festival featuring workshops, demos, and networking opportunities.',
        start_date: '2025-08-10T10:00:00Z',
        end_date: '2025-08-10T18:00:00Z',
        location_name: 'Convention Center',
        location_address: '123 Main St, Downtown',
        capacity: 500,
        registered_count: 234,
        category: 'Technology',
        tags: ['tech', 'networking', 'workshops'],
        status: 'published',
        is_public: true,
        price: 0,
        cover_image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        organizer_id: 'demo-organizer',
        requirements: ['Laptop recommended', 'Basic programming knowledge'],
        target_audience: ['Developers', 'Students', 'Tech enthusiasts'],
        learning_objectives: ['Learn new technologies', 'Network with peers', 'Hands-on workshops'],
        amenities: ['WiFi', 'Refreshments', 'Parking'],
        budget_total: 50000,
        budget_spent: 25000,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        organizer: {
          id: 'demo-organizer',
          full_name: 'Tech Events Inc.',
          avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          email: 'organizer@techfest.com',
          role: 'organizer',
          phone: null,
          location: null,
          bio: null,
          date_of_birth: null,
          experience_level: null,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      },
      {
        id: '2',
        title: 'Community Food Drive',
        description: 'Monthly food distribution event serving local families in need.',
        start_date: '2025-08-15T08:00:00Z',
        end_date: '2025-08-15T14:00:00Z',
        location_name: 'Central Park Pavilion',
        location_address: 'Central Park, City Center',
        capacity: 150,
        registered_count: 89,
        category: 'Community Service',
        tags: ['community', 'food', 'volunteer'],
        status: 'published',
        is_public: true,
        price: 0,
        cover_image_url: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        organizer_id: 'demo-organizer-2',
        requirements: ['Physical activity tolerance'],
        target_audience: ['Community volunteers', 'Local residents'],
        learning_objectives: ['Community service', 'Teamwork', 'Social impact'],
        amenities: ['Parking', 'Restrooms', 'Water stations'],
        budget_total: 15000,
        budget_spent: 8500,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        organizer: {
          id: 'demo-organizer-2',
          full_name: 'Community Care Foundation',
          avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          email: 'contact@communitycare.org',
          role: 'organizer',
          phone: null,
          location: null,
          bio: null,
          date_of_birth: null,
          experience_level: null,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      },
      {
        id: '3',
        title: 'Youth Workshop Series',
        description: 'Educational workshop series designed to empower local youth with valuable skills.',
        start_date: '2025-08-20T13:00:00Z',
        end_date: '2025-08-20T17:00:00Z',
        location_name: 'Community Learning Center',
        location_address: '456 Education Ave, Learning District',
        capacity: 75,
        registered_count: 45,
        category: 'Education',
        tags: ['education', 'youth', 'skills'],
        status: 'published',
        is_public: true,
        price: 0,
        cover_image_url: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        organizer_id: 'demo-organizer-3',
        requirements: ['Age 16-25', 'Interest in learning'],
        target_audience: ['Youth', 'Students', 'Career seekers'],
        learning_objectives: ['Skill development', 'Career guidance', 'Personal growth'],
        amenities: ['Materials provided', 'Certificates', 'Refreshments'],
        budget_total: 8000,
        budget_spent: 3200,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        organizer: {
          id: 'demo-organizer-3',
          full_name: 'Youth Development Society',
          avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          email: 'info@youthdev.org',
          role: 'organizer',
          phone: null,
          location: null,
          bio: null,
          date_of_birth: null,
          experience_level: null,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      }
    ];

    // Initialize localStorage with mock data if empty
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(mockEvents));
      return mockEvents;
    }

    return JSON.parse(storedEvents);
  };

  const fetchEvents = async (filters?: {
    isPublic?: boolean;
    category?: string;
    organizerId?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const allEvents = initializeMockData();
      
      // Apply filters
      let filtered = allEvents;
      if (filters?.isPublic !== undefined) {
        filtered = filtered.filter(event => event.is_public === filters.isPublic);
      }
      if (filters?.category) {
        filtered = filtered.filter(event => event.category === filters.category);
      }
      if (filters?.status) {
        filtered = filtered.filter(event => event.status === filters.status);
      }
      if (filters?.organizerId) {
        filtered = filtered.filter(event => event.organizer_id === filters.organizerId);
      }
      
      setEvents(filtered);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: EventInsert): Promise<{ success: boolean; data?: Event; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const newEvent: Event = {
        id: `event-${Date.now()}`,
        ...eventData,
        organizer_id: user.id,
        registered_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          email: user.email || '',
          role: user.user_metadata?.role as 'admin' | 'organizer' | 'volunteer' || 'volunteer',
          phone: null,
          location: null,
          bio: null,
          date_of_birth: null,
          experience_level: null,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const updatedEvents = [newEvent, ...currentEvents];
      
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      setEvents(updatedEvents);

      return { success: true, data: newEvent };
    } catch (err) {
      console.error('Error creating event:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create event' 
      };
    }
  };

  const updateEvent = async (id: string, updates: EventUpdate): Promise<{ success: boolean; data?: Event; error?: string }> => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      
      const eventIndex = currentEvents.findIndex((event: Event) => event.id === id);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const updatedEvent = {
        ...currentEvents[eventIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      currentEvents[eventIndex] = updatedEvent;
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(currentEvents));
      
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));

      return { success: true, data: updatedEvent };
    } catch (err) {
      console.error('Error updating event:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update event' 
      };
    }
  };

  const deleteEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      
      const filteredEvents = currentEvents.filter((event: Event) => event.id !== id);
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
      
      setEvents(prev => prev.filter(event => event.id !== id));

      return { success: true };
    } catch (err) {
      console.error('Error deleting event:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete event' 
      };
    }
  };

  const registerForEvent = async (eventId: string, registrationData?: {
    role?: string;
    motivation?: string;
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    emergencyContact?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Get current registrations
      const storedRegistrations = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      const currentRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];

      // Check if already registered
      const existingRegistration = currentRegistrations.find(
        (reg: any) => reg.event_id === eventId && reg.user_id === user.id
      );

      if (existingRegistration) {
        return { success: false, error: 'Already registered for this event' };
      }

      // Create new registration
      const newRegistration = {
        id: `reg-${Date.now()}`,
        event_id: eventId,
        user_id: user.id,
        status: 'pending',
        registered_at: new Date().toISOString(),
        ...registrationData
      };

      currentRegistrations.push(newRegistration);
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(currentRegistrations));

      // Update event registered count
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const updatedEvents = currentEvents.map((event: Event) => 
        event.id === eventId 
          ? { ...event, registered_count: event.registered_count + 1 }
          : event
      );
      
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      setEvents(updatedEvents);

      return { success: true };
    } catch (err) {
      console.error('Error registering for event:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to register for event' 
      };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    refetch: fetchEvents
  };
};