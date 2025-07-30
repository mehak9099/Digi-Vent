/*
  # Initial Database Schema for Digi-Vent

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `events` - Event management
    - `tasks` - Task management with Kanban functionality
    - `event_registrations` - User event registrations
    - `task_assignments` - Task assignments to users
    - `feedback` - Event feedback system
    - `expenses` - Budget and expense tracking
    - `notifications` - User notifications
    - `badges` - Gamification badges
    - `user_badges` - User earned badges
    - `skills` - Available skills
    - `user_skills` - User skill associations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Role-based access control
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'volunteer');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'progress', 'review', 'completed', 'blocked');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');
CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'volunteer',
  phone text,
  location text,
  bio text,
  date_of_birth date,
  experience_level text,
  availability_status text DEFAULT 'available',
  total_hours integer DEFAULT 0,
  events_completed integer DEFAULT 0,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  impact_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location_name text NOT NULL,
  location_address text NOT NULL,
  capacity integer NOT NULL DEFAULT 50,
  registered_count integer DEFAULT 0,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  status event_status DEFAULT 'draft',
  is_public boolean DEFAULT false,
  price decimal(10,2) DEFAULT 0,
  cover_image_url text,
  organizer_id uuid REFERENCES profiles(id) NOT NULL,
  requirements text[] DEFAULT '{}',
  target_audience text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  budget_total decimal(10,2) DEFAULT 0,
  budget_spent decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  status task_status DEFAULT 'backlog',
  priority task_priority DEFAULT 'medium',
  due_date timestamptz,
  estimated_hours integer DEFAULT 1,
  actual_hours integer DEFAULT 0,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags text[] DEFAULT '{}',
  dependencies uuid[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status registration_status DEFAULT 'pending',
  role text,
  motivation text,
  dietary_restrictions text,
  accessibility_needs text,
  emergency_contact text,
  registered_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  attended_at timestamptz,
  UNIQUE(event_id, user_id)
);

-- Task assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES profiles(id) NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  notes text,
  UNIQUE(task_id, user_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 5),
  organization_rating integer CHECK (organization_rating >= 1 AND organization_rating <= 5),
  content_rating integer CHECK (content_rating >= 1 AND content_rating <= 5),
  venue_rating integer CHECK (venue_rating >= 1 AND venue_rating <= 5),
  staff_rating integer CHECK (staff_rating >= 1 AND staff_rating <= 5),
  categories text[] DEFAULT '{}',
  comments text,
  recommend text CHECK (recommend IN ('yes', 'no', 'maybe')),
  recommend_reason text,
  is_anonymous boolean DEFAULT false,
  allow_contact boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date date NOT NULL,
  status expense_status DEFAULT 'pending',
  priority task_priority DEFAULT 'medium',
  payment_method text,
  vendor_name text,
  vendor_contact text,
  receipt_url text,
  notes text,
  submitted_by uuid REFERENCES profiles(id) NOT NULL,
  approved_by uuid REFERENCES profiles(id),
  submitted_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'info',
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- User skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level integer DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  rarity badge_rarity DEFAULT 'common',
  criteria jsonb,
  xp_reward integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view public events" ON events FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Organizers can create events" ON events FOR INSERT WITH CHECK (
  auth.uid() = organizer_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
);
CREATE POLICY "Organizers can update own events" ON events FOR UPDATE USING (
  auth.uid() = organizer_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Organizers can delete own events" ON events FOR DELETE USING (
  auth.uid() = organizer_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tasks policies
CREATE POLICY "Users can view tasks for events they're involved in" ON tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM event_registrations er WHERE er.event_id = e.id AND er.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);
CREATE POLICY "Organizers can manage tasks" ON tasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own registrations" ON event_registrations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Organizers can view event registrations" ON event_registrations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);

-- Task assignments policies
CREATE POLICY "Users can view own assignments" ON task_assignments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Organizers can manage assignments" ON task_assignments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tasks t
    JOIN events e ON e.id = t.event_id
    WHERE t.id = task_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);

-- Feedback policies
CREATE POLICY "Users can view feedback for public events" ON feedback FOR SELECT USING (
  NOT is_anonymous OR user_id = auth.uid()
);
CREATE POLICY "Users can submit feedback" ON feedback FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own feedback" ON feedback FOR UPDATE USING (user_id = auth.uid());

-- Expenses policies
CREATE POLICY "Users can view expenses for their events" ON expenses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM event_registrations er WHERE er.event_id = e.id AND er.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);
CREATE POLICY "Organizers can manage expenses" ON expenses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_id AND (
      e.organizer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Skills policies
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON skills FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User skills policies
CREATE POLICY "Users can view all user skills" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (user_id = auth.uid());

-- Badges policies
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User badges policies
CREATE POLICY "Users can view all user badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System can award badges" ON user_badges FOR INSERT WITH CHECK (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'volunteer')::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert initial data
INSERT INTO skills (name, description, category) VALUES
  ('Event Planning', 'Organizing and coordinating events', 'Management'),
  ('Audio/Visual', 'Setting up and managing AV equipment', 'Technical'),
  ('Team Leadership', 'Leading and coordinating teams', 'Management'),
  ('First Aid', 'Basic medical assistance and safety', 'Safety'),
  ('Photography', 'Event photography and documentation', 'Creative'),
  ('Social Media', 'Managing social media presence', 'Marketing'),
  ('Graphic Design', 'Creating visual materials', 'Creative'),
  ('Public Speaking', 'Presenting and speaking to audiences', 'Communication'),
  ('Customer Service', 'Assisting and helping attendees', 'Service'),
  ('Setup/Breakdown', 'Physical setup and cleanup', 'Operations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO badges (name, description, icon, rarity, xp_reward) VALUES
  ('Welcome', 'Completed your first event', '🎉', 'common', 50),
  ('Team Player', 'Collaborated on 5+ events', '🤝', 'common', 100),
  ('Dedicated Volunteer', 'Volunteered for 50+ hours', '⏰', 'rare', 200),
  ('Event Master', 'Organized 10+ events', '🏆', 'epic', 300),
  ('Community Champion', 'Made significant community impact', '❤️', 'legendary', 500),
  ('Skill Collector', 'Mastered 5+ skills', '🎯', 'rare', 150),
  ('Streak Master', 'Maintained 10+ event streak', '🔥', 'epic', 250),
  ('Feedback Hero', 'Provided valuable feedback', '💬', 'common', 75)
ON CONFLICT (name) DO NOTHING;