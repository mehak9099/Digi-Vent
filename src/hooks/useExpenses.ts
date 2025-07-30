import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
  submitter?: Database['public']['Tables']['profiles']['Row'];
  approver?: Database['public']['Tables']['profiles']['Row'];
};

type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

export const useExpenses = (eventId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExpenses = async (filters?: {
    eventId?: string;
    status?: string;
    category?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('expenses')
        .select(`
          *,
          event:events(
            id,
            title,
            budget_total,
            budget_spent
          ),
          submitter:profiles!expenses_submitted_by_fkey(
            id,
            full_name,
            avatar_url
          ),
          approver:profiles!expenses_approved_by_fkey(
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
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: Omit<ExpenseInsert, 'submitted_by'>): Promise<{ success: boolean; data?: Expense; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          submitted_by: user.id
        })
        .select(`
          *,
          event:events(
            id,
            title,
            budget_total,
            budget_spent
          ),
          submitter:profiles!expenses_submitted_by_fkey(
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
      setExpenses(prev => [data, ...prev]);

      return { success: true, data };
    } catch (err) {
      console.error('Error creating expense:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create expense' 
      };
    }
  };

  const updateExpense = async (id: string, updates: ExpenseUpdate): Promise<{ success: boolean; data?: Expense; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          event:events(
            id,
            title,
            budget_total,
            budget_spent
          ),
          submitter:profiles!expenses_submitted_by_fkey(
            id,
            full_name,
            avatar_url
          ),
          approver:profiles!expenses_approved_by_fkey(
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
      setExpenses(prev => prev.map(expense => expense.id === id ? data : expense));

      return { success: true, data };
    } catch (err) {
      console.error('Error updating expense:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update expense' 
      };
    }
  };

  const approveExpense = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh expenses
      await fetchExpenses();

      return { success: true };
    } catch (err) {
      console.error('Error approving expense:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to approve expense' 
      };
    }
  };

  const rejectExpense = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh expenses
      await fetchExpenses();

      return { success: true };
    } catch (err) {
      console.error('Error rejecting expense:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to reject expense' 
      };
    }
  };

  const getBudgetSummary = async (eventId: string) => {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('amount, status, category')
        .eq('event_id', eventId);

      if (error) {
        throw error;
      }

      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('budget_total')
        .eq('id', eventId)
        .single();

      if (eventError) {
        throw eventError;
      }

      const totalBudget = event.budget_total || 0;
      const totalSpent = expenses
        .filter(exp => exp.status === 'approved' || exp.status === 'paid')
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      const pendingAmount = expenses
        .filter(exp => exp.status === 'pending')
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      const categoryBreakdown = expenses.reduce((acc, exp) => {
        const category = exp.category;
        if (!acc[category]) {
          acc[category] = { spent: 0, pending: 0 };
        }
        
        if (exp.status === 'approved' || exp.status === 'paid') {
          acc[category].spent += Number(exp.amount);
        } else if (exp.status === 'pending') {
          acc[category].pending += Number(exp.amount);
        }
        
        return acc;
      }, {} as Record<string, { spent: number; pending: number }>);

      return {
        totalBudget,
        totalSpent,
        pendingAmount,
        remaining: totalBudget - totalSpent,
        categoryBreakdown
      };
    } catch (err) {
      console.error('Error getting budget summary:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [eventId]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    approveExpense,
    rejectExpense,
    getBudgetSummary,
    refetch: fetchExpenses
  };
};