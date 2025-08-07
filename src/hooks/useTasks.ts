import { useState, useEffect } from 'react';
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

// Local storage keys
const TASKS_STORAGE_KEY = 'digi-vent-tasks';
const TASK_ASSIGNMENTS_STORAGE_KEY = 'digi-vent-task-assignments';

export const useTasks = (eventId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with mock data
  const initializeMockData = () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Setup registration booth',
        description: 'Prepare materials and signage for volunteer registration',
        event_id: '1',
        status: 'backlog',
        priority: 'medium',
        due_date: '2025-02-15T00:00:00Z',
        estimated_hours: 4,
        actual_hours: 0,
        progress: 0,
        tags: ['setup', 'registration'],
        dependencies: [],
        created_by: 'demo-organizer',
        created_at: '2025-01-20T00:00:00Z',
        updated_at: '2025-01-20T00:00:00Z'
      },
      {
        id: '2',
        title: 'Order catering supplies',
        description: 'Purchase food and beverages for volunteers',
        event_id: '1',
        status: 'todo',
        priority: 'high',
        due_date: '2025-02-10T00:00:00Z',
        estimated_hours: 2,
        actual_hours: 0,
        progress: 0,
        tags: ['catering', 'supplies'],
        dependencies: [],
        created_by: 'demo-organizer',
        created_at: '2025-01-19T00:00:00Z',
        updated_at: '2025-01-19T00:00:00Z'
      },
      {
        id: '3',
        title: 'Create volunteer schedule',
        description: 'Assign volunteers to specific time slots and roles',
        event_id: '1',
        status: 'progress',
        priority: 'high',
        due_date: '2025-02-12T00:00:00Z',
        estimated_hours: 6,
        actual_hours: 2,
        progress: 60,
        tags: ['scheduling', 'volunteers'],
        dependencies: ['1'],
        created_by: 'demo-organizer',
        created_at: '2025-01-18T00:00:00Z',
        updated_at: '2025-01-21T00:00:00Z'
      },
      {
        id: '4',
        title: 'Design event flyers',
        description: 'Create promotional materials for social media and print',
        event_id: '1',
        status: 'review',
        priority: 'medium',
        due_date: '2025-02-08T00:00:00Z',
        estimated_hours: 8,
        actual_hours: 8,
        progress: 100,
        tags: ['design', 'marketing'],
        dependencies: [],
        created_by: 'demo-organizer',
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-22T00:00:00Z'
      },
      {
        id: '5',
        title: 'Book event venue',
        description: 'Secure location and sign rental agreement',
        event_id: '1',
        status: 'completed',
        priority: 'high',
        due_date: '2025-01-30T00:00:00Z',
        estimated_hours: 4,
        actual_hours: 5,
        progress: 100,
        tags: ['venue', 'booking'],
        dependencies: [],
        created_by: 'demo-organizer',
        created_at: '2025-01-05T00:00:00Z',
        updated_at: '2025-01-25T00:00:00Z'
      }
    ];

    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!storedTasks) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(mockTasks));
      return mockTasks;
    }

    return JSON.parse(storedTasks);
  };

  const fetchTasks = async (filters?: {
    eventId?: string;
    status?: string;
    assignedToMe?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const allTasks = initializeMockData();
      
      // Apply filters
      let filtered = allTasks;
      if (filters?.eventId || eventId) {
        filtered = filtered.filter(task => task.event_id === (filters?.eventId || eventId));
      }
      if (filters?.status) {
        filtered = filtered.filter(task => task.status === filters.status);
      }
      if (filters?.assignedToMe && user) {
        // In a real app, this would check task assignments
        // For demo, we'll show all tasks
        filtered = allTasks;
      }

      setTasks(filtered);
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

      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...taskData,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];
      const updatedTasks = [newTask, ...currentTasks];
      
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(prev => [newTask, ...prev]);

      return { success: true, data: newTask };
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
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      const taskIndex = currentTasks.findIndex((task: Task) => task.id === id);
      if (taskIndex === -1) {
        return { success: false, error: 'Task not found' };
      }

      const updatedTask = {
        ...currentTasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      currentTasks[taskIndex] = updatedTask;
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(currentTasks));
      
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));

      return { success: true, data: updatedTask };
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

      const newAssignment = {
        id: `assignment-${Date.now()}`,
        task_id: taskId,
        user_id: userId,
        assigned_by: user.id,
        assigned_at: new Date().toISOString(),
        accepted_at: null,
        completed_at: null,
        notes: null
      };

      const storedAssignments = localStorage.getItem(TASK_ASSIGNMENTS_STORAGE_KEY);
      const currentAssignments = storedAssignments ? JSON.parse(storedAssignments) : [];
      const updatedAssignments = [newAssignment, ...currentAssignments];
      
      localStorage.setItem(TASK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updatedAssignments));

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

      const storedAssignments = localStorage.getItem(TASK_ASSIGNMENTS_STORAGE_KEY);
      const currentAssignments = storedAssignments ? JSON.parse(storedAssignments) : [];

      const updatedAssignments = currentAssignments.map((assignment: any) => 
        assignment.task_id === taskId && assignment.user_id === user.id
          ? { ...assignment, accepted_at: new Date().toISOString() }
          : assignment
      );

      localStorage.setItem(TASK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updatedAssignments));

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
      await updateTask(taskId, { 
        status: 'completed',
        progress: 100
      });

      // Update assignment
      const storedAssignments = localStorage.getItem(TASK_ASSIGNMENTS_STORAGE_KEY);
      const currentAssignments = storedAssignments ? JSON.parse(storedAssignments) : [];

      const updatedAssignments = currentAssignments.map((assignment: any) => 
        assignment.task_id === taskId && assignment.user_id === user.id
          ? { ...assignment, completed_at: new Date().toISOString() }
          : assignment
      );

      localStorage.setItem(TASK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updatedAssignments));

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