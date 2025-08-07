import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Feedback = Database['public']['Tables']['feedback']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
  user?: Database['public']['Tables']['profiles']['Row'];
};

type FeedbackInsert = Database['public']['Tables']['feedback']['Insert'];

// Local storage key
const FEEDBACK_STORAGE_KEY = 'digi-vent-feedback';

export const useFeedback = (eventId?: string) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with mock data
  const initializeMockData = () => {
    const mockFeedback: Feedback[] = [
      {
        id: '1',
        event_id: '1',
        user_id: 'demo-volunteer',
        overall_rating: 5,
        organization_rating: 5,
        content_rating: 4,
        venue_rating: 5,
        staff_rating: 5,
        categories: ['Event Organization', 'Content Quality'],
        comments: 'Amazing event! The workshops were incredibly informative and well-organized.',
        recommend: 'yes',
        recommend_reason: 'Great learning experience',
        is_anonymous: false,
        allow_contact: true,
        created_at: '2025-01-20T00:00:00Z'
      },
      {
        id: '2',
        event_id: '2',
        user_id: 'demo-volunteer-2',
        overall_rating: 5,
        organization_rating: 5,
        content_rating: 5,
        venue_rating: 4,
        staff_rating: 5,
        categories: ['Event Organization', 'Volunteer Support'],
        comments: 'Great organization and wonderful volunteers. Made a real difference!',
        recommend: 'yes',
        recommend_reason: 'Meaningful community impact',
        is_anonymous: false,
        allow_contact: true,
        created_at: '2025-01-18T00:00:00Z'
      }
    ];

    const storedFeedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!storedFeedback) {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(mockFeedback));
      return mockFeedback;
    }

    return JSON.parse(storedFeedback);
  };

  const fetchFeedback = async (filters?: {
    eventId?: string;
    userId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const allFeedback = initializeMockData();
      
      // Apply filters
      let filtered = allFeedback;
      if (filters?.eventId || eventId) {
        filtered = filtered.filter(fb => fb.event_id === (filters?.eventId || eventId));
      }
      if (filters?.userId) {
        filtered = filtered.filter(fb => fb.user_id === filters.userId);
      }

      setFeedback(filtered);
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

      const newFeedback: Feedback = {
        id: `feedback-${Date.now()}`,
        ...feedbackData,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const storedFeedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const currentFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
      const updatedFeedback = [newFeedback, ...currentFeedback];
      
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
      setFeedback(prev => [newFeedback, ...prev]);

      return { success: true, data: newFeedback };
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
      const storedFeedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const allFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
      const eventFeedback = allFeedback.filter((fb: Feedback) => fb.event_id === eventId);

      if (!eventFeedback || eventFeedback.length === 0) {
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

      const totalResponses = eventFeedback.length;
      const averageRating = eventFeedback.reduce((sum: number, item: Feedback) => sum + (item.overall_rating || 0), 0) / totalResponses;
      
      const recommendYes = eventFeedback.filter((item: Feedback) => item.recommend === 'yes').length;
      const recommendationRate = (recommendYes / totalResponses) * 100;

      const aspectRatings = {
        organization: eventFeedback.reduce((sum: number, item: Feedback) => sum + (item.organization_rating || 0), 0) / totalResponses,
        content: eventFeedback.reduce((sum: number, item: Feedback) => sum + (item.content_rating || 0), 0) / totalResponses,
        venue: eventFeedback.reduce((sum: number, item: Feedback) => sum + (item.venue_rating || 0), 0) / totalResponses,
        staff: eventFeedback.reduce((sum: number, item: Feedback) => sum + (item.staff_rating || 0), 0) / totalResponses
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