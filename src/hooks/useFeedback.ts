import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Feedback = Database['public']['Tables']['feedback']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
  user?: Database['public']['Tables']['profiles']['Row'];
};

type FeedbackInsert = Database['public']['Tables']['feedback']['Insert'];

export const useFeedback = (eventId?: string) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFeedback = async (filters?: {
    eventId?: string;
    userId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('feedback')
        .select(`
          *,
          event:events(
            id,
            title,
            start_date,
            location_name
          ),
          user:profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.eventId || eventId) {
        query = query.eq('event_id', filters?.eventId || eventId);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setFeedback(data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedbackData: Omit<FeedbackInsert, 'user_id'>): Promise<{ success: boolean; data?: Feedback; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          ...feedbackData,
          user_id: user.id
        })
        .select(`
          *,
          event:events(
            id,
            title,
            start_date,
            location_name
          ),
          user:profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setFeedback(prev => [data, ...prev]);

      return { success: true, data };
    } catch (err) {
      console.error('Error submitting feedback:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to submit feedback' 
      };
    }
  };

  const getFeedbackStats = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('overall_rating, organization_rating, content_rating, venue_rating, staff_rating, recommend')
        .eq('event_id', eventId);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          averageRating: 0,
          totalResponses: 0,
          recommendationRate: 0,
          aspectRatings: {
            organization: 0,
            content: 0,
            venue: 0,
            staff: 0
          }
        };
      }

      const totalResponses = data.length;
      const averageRating = data.reduce((sum, item) => sum + (item.overall_rating || 0), 0) / totalResponses;
      
      const recommendYes = data.filter(item => item.recommend === 'yes').length;
      const recommendationRate = (recommendYes / totalResponses) * 100;

      const aspectRatings = {
        organization: data.reduce((sum, item) => sum + (item.organization_rating || 0), 0) / totalResponses,
        content: data.reduce((sum, item) => sum + (item.content_rating || 0), 0) / totalResponses,
        venue: data.reduce((sum, item) => sum + (item.venue_rating || 0), 0) / totalResponses,
        staff: data.reduce((sum, item) => sum + (item.staff_rating || 0), 0) / totalResponses
      };

      return {
        averageRating,
        totalResponses,
        recommendationRate,
        aspectRatings
      };
    } catch (err) {
      console.error('Error getting feedback stats:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  return {
    feedback,
    loading,
    error,
    fetchFeedback,
    submitFeedback,
    getFeedbackStats,
    refetch: fetchFeedback
  };
};