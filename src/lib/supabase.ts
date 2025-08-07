// Mock Supabase client for demo mode
export const supabase = null;

// Database types (kept for TypeScript compatibility)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'organizer' | 'volunteer';
          phone: string | null;
          location: string | null;
          bio: string | null;
          date_of_birth: string | null;
          experience_level: string | null;
          availability_status: string;
          total_hours: number;
          events_completed: number;
          level: number;
          xp: number;
          streak: number;
          impact_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'organizer' | 'volunteer';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          experience_level?: string | null;
          availability_status?: string;
          total_hours?: number;
          events_completed?: number;
          level?: number;
          xp?: number;
          streak?: number;
          impact_score?: number;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'organizer' | 'volunteer';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          experience_level?: string | null;
          availability_status?: string;
          total_hours?: number;
          events_completed?: number;
          level?: number;
          xp?: number;
          streak?: number;
          impact_score?: number;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location_name: string;
          location_address: string;
          capacity: number;
          registered_count: number;
          category: string;
          tags: string[];
          status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          is_public: boolean;
          price: number;
          cover_image_url: string | null;
          organizer_id: string;
          requirements: string[];
          target_audience: string[];
          learning_objectives: string[];
          amenities: string[];
          budget_total: number;
          budget_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          location_name: string;
          location_address: string;
          capacity?: number;
          registered_count?: number;
          category: string;
          tags?: string[];
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          is_public?: boolean;
          price?: number;
          cover_image_url?: string | null;
          organizer_id: string;
          requirements?: string[];
          target_audience?: string[];
          learning_objectives?: string[];
          amenities?: string[];
          budget_total?: number;
          budget_spent?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          location_name?: string;
          location_address?: string;
          capacity?: number;
          registered_count?: number;
          category?: string;
          tags?: string[];
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          is_public?: boolean;
          price?: number;
          cover_image_url?: string | null;
          organizer_id?: string;
          requirements?: string[];
          target_audience?: string[];
          learning_objectives?: string[];
          amenities?: string[];
          budget_total?: number;
          budget_spent?: number;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_id: string | null;
          status: 'backlog' | 'todo' | 'progress' | 'review' | 'completed' | 'blocked';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string | null;
          estimated_hours: number;
          actual_hours: number;
          progress: number;
          tags: string[];
          dependencies: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          event_id?: string | null;
          status?: 'backlog' | 'todo' | 'progress' | 'review' | 'completed' | 'blocked';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          estimated_hours?: number;
          actual_hours?: number;
          progress?: number;
          tags?: string[];
          dependencies?: string[];
          created_by: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          event_id?: string | null;
          status?: 'backlog' | 'todo' | 'progress' | 'review' | 'completed' | 'blocked';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          estimated_hours?: number;
          actual_hours?: number;
          progress?: number;
          tags?: string[];
          dependencies?: string[];
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          role: string | null;
          motivation: string | null;
          dietary_restrictions: string | null;
          accessibility_needs: string | null;
          emergency_contact: string | null;
          registered_at: string;
          confirmed_at: string | null;
          attended_at: string | null;
        };
        Insert: {
          event_id: string;
          user_id: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          role?: string | null;
          motivation?: string | null;
          dietary_restrictions?: string | null;
          accessibility_needs?: string | null;
          emergency_contact?: string | null;
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          role?: string | null;
          motivation?: string | null;
          dietary_restrictions?: string | null;
          accessibility_needs?: string | null;
          emergency_contact?: string | null;
          confirmed_at?: string | null;
          attended_at?: string | null;
        };
      };
    };
  };
}