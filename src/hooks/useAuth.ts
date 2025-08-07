import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'organizer' | 'volunteer';
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  date_of_birth?: string;
  experience_level?: string;
  availability_status?: string;
  total_hours?: number;
  events_completed?: number;
  level?: number;
  xp?: number;
  streak?: number;
  impact_score?: number;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'organizer' | 'volunteer';
    phone?: string;
    location?: string;
    dateOfBirth?: string;
    experienceLevel?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('digi-vent-user');
        const storedProfile = localStorage.getItem('digi-vent-profile');
        
        if (storedUser && storedProfile) {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('digi-vent-user');
        localStorage.removeItem('digi-vent-profile');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Demo authentication - check for demo accounts
      const demoAccounts = {
        'admin@demo.com': { role: 'admin', name: 'Admin User' },
        'organizer@demo.com': { role: 'organizer', name: 'Event Organizer' },
        'volunteer@demo.com': { role: 'volunteer', name: 'Volunteer User' }
      };

      const demoAccount = demoAccounts[email as keyof typeof demoAccounts];
      
      if (demoAccount) {
        const mockUser: User = {
          id: `demo-${demoAccount.role}`,
          email,
          user_metadata: {
            full_name: demoAccount.name,
            role: demoAccount.role,
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
          }
        };

        const mockProfile: Profile = {
          id: mockUser.id,
          email,
          full_name: demoAccount.name,
          role: demoAccount.role as 'admin' | 'organizer' | 'volunteer',
          avatar_url: mockUser.user_metadata?.avatar_url,
          availability_status: 'available',
          total_hours: 156,
          events_completed: 23,
          level: 7,
          xp: 1250,
          streak: 5,
          impact_score: 92,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Store in localStorage
        localStorage.setItem('digi-vent-user', JSON.stringify(mockUser));
        localStorage.setItem('digi-vent-profile', JSON.stringify(mockProfile));

        setUser(mockUser);
        setProfile(mockProfile);

        // Navigate based on role
        setTimeout(() => {
          if (demoAccount.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (demoAccount.role === 'organizer') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard/volunteer');
          }
        }, 100);

        return { success: true };
      }

      // For non-demo accounts, simulate authentication
      if (email && password) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: {
            full_name: email.split('@')[0],
            role: 'volunteer',
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
          }
        };

        const mockProfile: Profile = {
          id: mockUser.id,
          email,
          full_name: email.split('@')[0],
          role: 'volunteer',
          avatar_url: mockUser.user_metadata?.avatar_url,
          availability_status: 'available',
          total_hours: 0,
          events_completed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          impact_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        localStorage.setItem('digi-vent-user', JSON.stringify(mockUser));
        localStorage.setItem('digi-vent-profile', JSON.stringify(mockProfile));

        setUser(mockUser);
        setProfile(mockProfile);

        setTimeout(() => {
          navigate('/dashboard/volunteer');
        }, 100);

        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'organizer' | 'volunteer';
    phone?: string;
    location?: string;
    dateOfBirth?: string;
    experienceLevel?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Simulate registration
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        user_metadata: {
          full_name: data.fullName,
          role: data.role,
          avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        }
      };

      const mockProfile: Profile = {
        id: mockUser.id,
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        avatar_url: mockUser.user_metadata?.avatar_url,
        phone: data.phone,
        location: data.location,
        date_of_birth: data.dateOfBirth,
        experience_level: data.experienceLevel,
        availability_status: 'available',
        total_hours: 0,
        events_completed: 0,
        level: 1,
        xp: 0,
        streak: 0,
        impact_score: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('digi-vent-user', JSON.stringify(mockUser));
      localStorage.setItem('digi-vent-profile', JSON.stringify(mockProfile));

      setUser(mockUser);
      setProfile(mockProfile);

      // Navigate based on role
      setTimeout(() => {
        if (data.role === 'admin' || data.role === 'organizer') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard/volunteer');
        }
      }, 100);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('digi-vent-user');
      localStorage.removeItem('digi-vent-profile');
      setUser(null);
      setProfile(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };
};