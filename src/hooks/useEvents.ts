import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Event = Database['public']['Tables']['events']['Row'] & {
  organizer?: Database['public']['Tables']['profiles']['Row'];
  registrations?: Database['public']['Tables']['event_registrations']['Row'][];
};

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async (filters?: {
    isPublic?: boolean;
    category?: string;
    organizerId?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Demo mode - return mock data
      if (!supabase) {
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
              email: 'organizer@techfest.com'
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
              email: 'contact@communitycare.org'
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
              email: 'info@youthdev.org'
            }
          }
        ];
        
        // Apply filters
        let filtered = mockEvents;
        if (filters?.isPublic !== undefined) {
          filtered = filtered.filter(event => event.is_public === filters.isPublic);
        }
        if (filters?.category) {
          filtered = filtered.filter(event => event.category === filters.category);
        }
        if (filters?.status) {
          filtered = filtered.filter(event => event.status === filters.status);
        }
        
        setEvents(filtered);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          ),
          registrations:event_registrations(
            id,
            user_id,
            status,
            registered_at
          )
        `)
        .order('start_date', { ascending: true });

      // Apply filters
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.organizerId) {
        query = query.eq('organizer_id', filters.organizerId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setEvents(data || []);
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

      // Demo mode - simulate event creation
      if (!supabase) {
        const newEvent = {
          id: `demo-event-${Date.now()}`,
          ...eventData,
          organizer_id: user.id,
          registered_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organizer: {
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Demo User',
            avatar_url: user.user_metadata?.avatar_url || null,
            email: user.email || ''
          }
        } as Event;
        
        setEvents(prev => [newEvent, ...prev]);
        return { success: true, data: newEvent };
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organizer_id: user.id
        })
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setEvents(prev => [...prev, data]);

      return { success: true, data };
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
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setEvents(prev => prev.map(event => event.id === id ? data : event));

      return { success: true, data };
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
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

      // Demo mode - simulate registration
      if (!supabase) {
        // Update registered count in demo mode
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, registered_count: event.registered_count + 1 }
            : event
        ));
        return { success: true };
      }

      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: 'pending',
          ...registrationData
        });

      if (error) {
        throw error;
      }

      // Update registered count
      const { error: updateError } = await supabase.rpc('increment_event_registration', {
        event_id: eventId
      });

      if (updateError) {
        console.error('Error updating registration count:', updateError);
      }

      // Refresh events to get updated data
      await fetchEvents();

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