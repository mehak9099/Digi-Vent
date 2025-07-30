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