import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'organizer' | 'volunteer';
  phone?: string;
  location?: string;
  dateOfBirth?: string;
  experienceLevel?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase is not configured, use demo mode
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        setAuthError(null);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setAuthError('Failed to initialize session');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setAuthError(null);
          // Navigate to home on logout
          navigate('/');
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setAuthError(null);
      if (!supabase) return; // Skip in demo mode
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setAuthError('Failed to load user profile');
        return;
      }

      setProfile(data);
      
      // Navigate after profile is fetched
      if (data) {
        // Only navigate if we're currently on auth pages
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/auth' || currentPath === '/signin' || currentPath === '/register' || currentPath === '/signup') {
          if (data.role === 'admin' || data.role === 'organizer') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard/volunteer');
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setAuthError('Failed to load user profile');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Demo mode - simulate login
      setAuthError(null);
      if (!supabase) {
        const demoUser = {
          id: 'demo-user-id',
          email: email.trim(),
          user_metadata: {
            full_name: 'Demo User',
            role: email.includes('admin') ? 'admin' : email.includes('organizer') ? 'organizer' : 'volunteer'
          }
        } as User;
        
        const demoProfile = {
          id: 'demo-user-id',
          email: email.trim(),
          full_name: 'Demo User',
          role: email.includes('admin') ? 'admin' : email.includes('organizer') ? 'organizer' : 'volunteer',
          avatar_url: null,
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
        } as Profile;
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        // Navigate immediately in demo mode
        setTimeout(() => {
          if (email.includes('admin') || email.includes('organizer')) {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard/volunteer');
          }
        }, 100);
        }
        
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Profile will be fetched and navigation will happen in the auth state change handler
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login exception:', error);
      setAuthError('An unexpected error occurred during login');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthError(null);
      
      // Demo mode - simulate registration
      if (!supabase) {
        const demoUser = {
          id: 'demo-user-id',
          email: userData.email.trim(),
          user_metadata: {
            full_name: userData.fullName,
            role: userData.role
          }
        } as User;
        
        const demoProfile = {
          id: 'demo-user-id',
          email: userData.email.trim(),
          full_name: userData.fullName,
          role: userData.role,
          avatar_url: null,
          phone: userData.phone || null,
          location: userData.location || null,
          bio: null,
          date_of_birth: userData.dateOfBirth || null,
          experience_level: userData.experienceLevel || null,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        // Navigate immediately in demo mode
        setTimeout(() => {
          if (userData.role === 'admin' || userData.role === 'organizer') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard/volunteer');
          }
        }, 100);
        
        return { success: true };
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
            phone: userData.phone,
            location: userData.location,
            date_of_birth: userData.dateOfBirth,
            experience_level: userData.experienceLevel
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Profile will be created automatically by the trigger
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration exception:', error);
      setAuthError('An unexpected error occurred during registration');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthError(null);
      
      // Demo mode - just clear state
      if (!supabase) {
        setUser(null);
        setProfile(null);
        setSession(null);
        navigate('/');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        setAuthError('Failed to logout');
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Logout exception:', error);
      setAuthError('An unexpected error occurred during logout');
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        setAuthError('Not authenticated');
        return { success: false, error: 'Not authenticated' };
      }

      // Demo mode - simulate profile update
      if (!supabase) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return { success: true };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error('Profile update exception:', error);
      setAuthError('An unexpected error occurred during profile update');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return {
    user,
    profile,
    session,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    isAuthenticated: !!user
  };
};

export { AuthContext };