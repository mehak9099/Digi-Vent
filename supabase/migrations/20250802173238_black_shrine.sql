/*
  # Fix profiles table columns

  1. New Columns
    - Add missing columns to profiles table that may have been referenced incorrectly
    - Ensure all columns have proper defaults and constraints
  
  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add any missing columns to profiles table if they don't exist
DO $$
BEGIN
  -- Check and add availability_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN availability_status text DEFAULT 'available';
  END IF;

  -- Check and add total_hours column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_hours'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_hours integer DEFAULT 0;
  END IF;

  -- Check and add events_completed column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'events_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN events_completed integer DEFAULT 0;
  END IF;

  -- Check and add level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN level integer DEFAULT 1;
  END IF;

  -- Check and add xp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'xp'
  ) THEN
    ALTER TABLE profiles ADD COLUMN xp integer DEFAULT 0;
  END IF;

  -- Check and add streak column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak integer DEFAULT 0;
  END IF;

  -- Check and add impact_score column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'impact_score'
  ) THEN
    ALTER TABLE profiles ADD COLUMN impact_score integer DEFAULT 0;
  END IF;
END $$;