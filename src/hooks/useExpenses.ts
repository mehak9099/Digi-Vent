import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
  submitter?: Database['public']['Tables']['profiles']['Row'];
  approver?: Database['public']['Tables']['profiles']['Row'];
};

type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

// Local storage key
const EXPENSES_STORAGE_KEY = 'digi-vent-expenses';

export const useExpenses = (eventId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with mock data
  const initializeMockData = () => {
    const mockExpenses: Expense[] = [
      {
        id: 'EXP-001',
        event_id: '1',
        category: 'Venue',
        description: 'Main auditorium rental',
        amount: 45000,
        date: '2025-07-15',
        status: 'approved',
        priority: 'high',
        payment_method: 'Bank Transfer',
        vendor_name: 'Convention Center',
        vendor_contact: '+92 42 1234567',
        receipt_url: '/receipts/venue-receipt.pdf',
        notes: 'For TechFest 2025 main event',
        submitted_by: 'demo-admin',
        approved_by: 'demo-admin',
        submitted_at: '2025-07-10T00:00:00Z',
        approved_at: '2025-07-12T00:00:00Z',
        created_at: '2025-07-10T00:00:00Z'
      },
      {
        id: 'EXP-002',
        event_id: '1',
        category: 'Catering',
        description: 'Lunch for 200 attendees',
        amount: 28000,
        date: '2025-07-18',
        status: 'pending',
        priority: 'medium',
        payment_method: 'Cash',
        vendor_name: 'Spice Garden Catering',
        vendor_contact: '+92 42 9876543',
        receipt_url: null,
        notes: 'Pakistani cuisine + beverages',
        submitted_by: 'demo-organizer',
        approved_by: null,
        submitted_at: '2025-07-15T00:00:00Z',
        approved_at: null,
        created_at: '2025-07-15T00:00:00Z'
      }
    ];

    const storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!storedExpenses) {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(mockExpenses));
      return mockExpenses;
    }

    return JSON.parse(storedExpenses);
  };

  const fetchExpenses = async (filters?: {
    eventId?: string;
    status?: string;
    category?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const allExpenses = initializeMockData();
      
      // Apply filters
      let filtered = allExpenses;
      if (filters?.eventId || eventId) {
        filtered = filtered.filter(expense => expense.event_id === (filters?.eventId || eventId));
      }
      if (filters?.status) {
        filtered = filtered.filter(expense => expense.status === filters.status);
      }
      if (filters?.category) {
        filtered = filtered.filter(expense => expense.category === filters.category);
      }

      setExpenses(filtered);
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

      const newExpense: Expense = {
        id: `EXP-${Date.now()}`,
        ...expenseData,
        submitted_by: user.id,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        approved_by: null,
        approved_at: null
      };

      const storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const currentExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      const updatedExpenses = [newExpense, ...currentExpenses];
      
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
      setExpenses(prev => [newExpense, ...prev]);

      return { success: true, data: newExpense };
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
      const storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const currentExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      
      const expenseIndex = currentExpenses.findIndex((expense: Expense) => expense.id === id);
      if (expenseIndex === -1) {
        return { success: false, error: 'Expense not found' };
      }

      const updatedExpense = {
        ...currentExpenses[expenseIndex],
        ...updates
      };

      currentExpenses[expenseIndex] = updatedExpense;
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(currentExpenses));
      
      setExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));

      return { success: true, data: updatedExpense };
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

      return await updateExpense(id, {
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString()
      });
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
      return await updateExpense(id, { status: 'rejected' });
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
      const storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const allExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      const eventExpenses = allExpenses.filter((exp: Expense) => exp.event_id === eventId);

      const totalBudget = 50000; // Mock budget
      const totalSpent = eventExpenses
        .filter((exp: Expense) => exp.status === 'approved' || exp.status === 'paid')
        .reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0);
      
      const pendingAmount = eventExpenses
        .filter((exp: Expense) => exp.status === 'pending')
        .reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0);

      const categoryBreakdown = eventExpenses.reduce((acc: any, exp: Expense) => {
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
      }, {});

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