import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { useEvents } from '../hooks/useEvents';
import { 
  DollarSign, 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  Zap,
  Bell,
  Settings,
  LogOut,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

interface ExpenseFormData {
  eventId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  paymentMethod: string;
  vendorName: string;
  vendorContact: string;
  notes: string;
}

const BudgetExpenses = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { expenses, loading, createExpense, updateExpense, approveExpense, rejectExpense, getBudgetSummary } = useExpenses();
  const { events } = useEvents();
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [budgetSummary, setBudgetSummary] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [expenseForm, setExpenseForm] = useState<ExpenseFormData>({
    eventId: '',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    paymentMethod: '',
    vendorName: '',
    vendorContact: '',
    notes: ''
  });

  const categories = [
    'Venue', 'Catering', 'Equipment', 'Marketing', 'Transportation', 
    'Supplies', 'Staff', 'Entertainment', 'Decorations', 'Other'
  ];

  const paymentMethods = [
    'Cash', 'Credit Card', 'Bank Transfer', 'Check', 'Digital Wallet', 'Other'
  ];

  useEffect(() => {
    if (selectedEvent !== 'all') {
      loadBudgetSummary(selectedEvent);
    }
  }, [selectedEvent]);

  const loadBudgetSummary = async (eventId: string) => {
    const summary = await getBudgetSummary(eventId);
    setBudgetSummary(summary);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createExpense({
        event_id: expenseForm.eventId,
        category: expenseForm.category,
        description: expenseForm.description,
        amount: expenseForm.amount,
        date: expenseForm.date,
        priority: expenseForm.priority,
        payment_method: expenseForm.paymentMethod,
        vendor_name: expenseForm.vendorName,
        vendor_contact: expenseForm.vendorContact,
        notes: expenseForm.notes,
        status: 'pending'
      });

      if (result.success) {
        setShowExpenseModal(false);
        setExpenseForm({
          eventId: '',
          category: '',
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          priority: 'medium',
          paymentMethod: '',
          vendorName: '',
          vendorContact: '',
          notes: ''
        });
        alert('Expense created successfully!');
      } else {
        alert(result.error || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveExpense = async (expenseId: string) => {
    try {
      const result = await approveExpense(expenseId);
      if (result.success) {
        alert('Expense approved successfully!');
      } else {
        alert(result.error || 'Failed to approve expense');
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      alert('Failed to approve expense');
    }
  };

  const handleRejectExpense = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to reject this expense?')) {
      try {
        const result = await rejectExpense(expenseId);
        if (result.success) {
          alert('Expense rejected successfully!');
        } else {
          alert(result.error || 'Failed to reject expense');
        }
      } catch (error) {
        console.error('Error rejecting expense:', error);
        alert('Failed to reject expense');
      }
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      alert(`Expense ${expenseId} would be deleted`);
    }
  };

  const handleEditExpense = (expenseId: string) => {
    alert(`Edit expense ${expenseId} functionality would be implemented here`);
  };

  const handleViewExpense = (expenseId: string) => {
    alert(`View expense ${expenseId} details would be implemented here`);
  };

  const handleExportData = () => {
    alert('Export functionality would be implemented here');
  };

  const handleImportData = () => {
    alert('Import functionality would be implemented here');
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesEvent = selectedEvent === 'all' || expense.event_id === selectedEvent;
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus;
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesEvent && matchesCategory && matchesStatus && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = sortedExpenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = sortedExpenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Budget & Expenses</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefreshData}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">{profile?.role || 'Admin'}</p>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {totalExpenses.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  All time
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {approvedExpenses.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Ready to pay
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {pendingExpenses.toLocaleString()}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Awaiting approval
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Budget Remaining</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {(125000 - totalExpenses).toLocaleString()}</p>
                <p className="text-sm text-purple-600 mt-1">
                  <Target className="w-4 h-4 inline mr-1" />
                  {Math.round(((125000 - totalExpenses) / 125000) * 100)}% left
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleExportData}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={handleImportData}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button 
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Expenses ({sortedExpenses.length})</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="category">Sort by Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                        {expense.vendor_name && (
                          <div className="text-sm text-gray-500">{expense.vendor_name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs. {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(expense.priority)}`}>
                        {expense.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewExpense(expense.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditExpense(expense.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {expense.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveExpense(expense.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Expense"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Expense"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateExpense} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event *
                  </label>
                  <select
                    value={expenseForm.eventId}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter expense description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={expenseForm.priority}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={expenseForm.vendorName}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, vendorName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vendor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Contact
                  </label>
                  <input
                    type="text"
                    value={expenseForm.vendorContact}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, vendorContact: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Additional notes or comments"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default BudgetExpenses;