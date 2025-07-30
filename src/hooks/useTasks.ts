import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
  assignments?: (Database['public']['Tables']['task_assignments']['Row'] & {
    user?: Database['public']['Tables']['profiles']['Row'];
  })[];
};

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export const useTasks = (eventId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async (filters?: {
    eventId?: string;
    status?: string;
    assignedToMe?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tasks')
        .select(`
          *,
          event:events(
            id,
            title,
            start_date,
            location_name
          ),
          assignments:task_assignments(
            id,
            user_id,
            assigned_at,
            accepted_at,
            completed_at,
            user:profiles(
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.eventId || eventId) {
        query = query.eq('event_id', filters?.eventId || eventId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.assignedToMe && user) {
        query = query.in('id', 
          supabase
            .from('task_assignments')
            .select('task_id')
            .eq('user_id', user.id)
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskInsert): Promise<{ success: boolean; data?: Task; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by: user.id
        })
        .select(`
          *,
          event:events(
            id,
            title,
            start_date,
            location_name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(prev => [data, ...prev]);

      return { success: true, data };
    } catch (err) {
      console.error('Error creating task:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create task' 
      };
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate): Promise<{ success: boolean; data?: Task; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          event:events(
            id,
            title,
            start_date,
            location_name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(prev => prev.map(task => task.id === id ? data : task));

      return { success: true, data };
    } catch (err) {
      console.error('Error updating task:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update task' 
      };
    }
  };

  const assignTask = async (taskId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('task_assignments')
        .insert({
          task_id: taskId,
          user_id: userId,
          assigned_by: user.id
        });

      if (error) {
        throw error;
      }

      // Refresh tasks to get updated assignments
      await fetchTasks();

      return { success: true };
    } catch (err) {
      console.error('Error assigning task:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign task' 
      };
    }
  };

  const acceptTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('task_assignments')
        .update({ accepted_at: new Date().toISOString() })
        .eq('task_id', taskId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Refresh tasks
      await fetchTasks();

      return { success: true };
    } catch (err) {
      console.error('Error accepting task:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to accept task' 
      };
    }
  };

  const completeTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update task status
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          progress: 100
        })
        .eq('id', taskId);

      if (taskError) {
        throw taskError;
      }

      // Update assignment
      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .update({ completed_at: new Date().toISOString() })
        .eq('task_id', taskId)
        .eq('user_id', user.id);

      if (assignmentError) {
        throw assignmentError;
      }

      // Refresh tasks
      await fetchTasks();

      return { success: true };
    } catch (err) {
      console.error('Error completing task:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to complete task' 
      };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    assignTask,
    acceptTask,
    completeTask,
    refetch: fetchTasks
  };
};