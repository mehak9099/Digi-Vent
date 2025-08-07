import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Building, 
  CreditCard, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  PieChart,
  BarChart3,
  Receipt,
  Wallet,
  Target,
  Activity
} from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  eventId: string;
  eventName: string;
  status: 'approved' | 'pending' | 'rejected' | 'paid';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  paymentMethod: string;
  vendorName?: string;
  vendorContact?: string;
  receiptUrl?: string;
  notes?: string;
  submittedBy: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
  color: string;
}

const BudgetExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    event: '',
    category: '',
    status: '',
    dateRange: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockExpenses: Expense[] = [
    {
      id: 'EXP-001',
      date: '2025-07-15',
      category: 'Venue',
      description: 'Main auditorium rental',
      amount: 45000,
      eventId: 'techfest-2025',
      eventName: 'TechFest 2025',
      status: 'approved',
      priority: 'high',
      paymentMethod: 'Bank Transfer',
      vendorName: 'Convention Center',
      vendorContact: '+92 42 1234567',
      receiptUrl: '/receipts/venue-receipt.pdf',
      notes: 'For TechFest 2025 main event',
      submittedBy: 'Admin',
      submittedDate: '2025-07-10',
      approvedBy: 'Finance Manager',
      approvedDate: '2025-07-12'
    },
    {
      id: 'EXP-002',
      date: '2025-07-18',
      category: 'Catering',
      description: 'Lunch for 200 attendees',
      amount: 28000,
      eventId: 'techfest-2025',
      eventName: 'TechFest 2025',
      status: 'pending',
      priority: 'medium',
      paymentMethod: 'Cash',
      vendorName: 'Spice Garden Catering',
      vendorContact: '+92 42 9876543',
      notes: 'Pakistani cuisine + beverages',
      submittedBy: 'Event Manager',
      submittedDate: '2025-07-15'
    },
    {
      id: 'EXP-003',
      date: '2025-07-20',
      category: 'Marketing',
      description: 'Social media promotion',
      amount: 12500,
      eventId: 'workshop-series',
      eventName: 'Workshop Series',
      status: 'paid',
      priority: 'low',
      paymentMethod: 'Credit Card',
      vendorName: 'Digital Marketing Agency',
      vendorContact: 'contact@digitalagency.com',
      receiptUrl: '/receipts/marketing-receipt.pdf',
      notes: 'Facebook and Instagram ads',
      submittedBy: 'Marketing Team',
      submittedDate: '2025-07-18',
      approvedBy: 'Admin',
      approvedDate: '2025-07-19'
    }
  ];

  const budgetData = {
    totalBudget: 250000,
    totalSpent: 147500,
    remaining: 102500,
    pendingApprovals: 7,
    pendingAmount: 23000
  };

  const budgetAllocations: BudgetAllocation[] = [
    { category: 'Venue & Logistics', allocated: 87500, spent: 65000, percentage: 35, color: 'bg-blue-500' },
    { category: 'Catering', allocated: 62500, spent: 45000, percentage: 25, color: 'bg-green-500' },
    { category: 'Media & Marketing', allocated: 50000, spent: 25000, percentage: 20, color: 'bg-purple-500' },
    { category: 'Equipment', allocated: 37500, spent: 12500, percentage: 15, color: 'bg-red-500' },
    { category: 'Other', allocated: 12500, spent: 0, percentage: 5, color: 'bg-yellow-500' }
  ];

  const events = [
    { id: 'techfest-2025', name: 'TechFest 2025' },
    { id: 'workshop-series', name: 'Workshop Series' },
    { id: 'annual-gala', name: 'Annual Gala 2025' }
  ];

  const categories = [
    'Venue', 'Catering', 'Marketing', 'Equipment', 'Transportation', 
    'Security', 'Materials', 'Speakers', 'Miscellaneous'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExpenses(mockExpenses);
      setFilteredExpenses(mockExpenses);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           expense.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           expense.eventName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEvent = !filters.event || expense.eventId === filters.event;
      const matchesCategory = !filters.category || expense.category === filters.category;
      const matchesStatus = !filters.status || expense.status === filters.status;

      return matchesSearch && matchesEvent && matchesCategory && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'date':
            aValue = new Date(a.date);
            bValue = new Date(b.date);
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

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [expenses, searchQuery, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getCurrentPageExpenses = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExpenses.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="w-3 h-3 mr-1" />;
      case 'pending': return <Clock className="w-3 h-3 mr-1" />;
      case 'rejected': return <X className="w-3 h-3 mr-1" />;
      case 'paid': return <CreditCard className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'venue': return <Building className="w-4 h-4 mr-1" />;
      case 'catering': return <Receipt className="w-4 h-4 mr-1" />;
      case 'marketing': return <TrendingUp className="w-4 h-4 mr-1" />;
      case 'equipment': return <Settings className="w-4 h-4 mr-1" />;
      default: return <Tag className="w-4 h-4 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xl font-bold text-white">Digi-Vent Admin</span>
              </div>
            </div>

            <div className="hidden md:flex space-x-6">
              <a href="/admin/dashboard" className="text-indigo-100 hover:text-white transition-colors">
                Dashboard
              </a>
              <a href="/admin/events" className="text-indigo-100 hover:text-white transition-colors">
                Events
              </a>
              <a href="/admin/volunteers" className="text-indigo-100 hover:text-white transition-colors">
                Volunteers
              </a>
              <a href="/admin/expenses" className="text-white font-semibold border-b-2 border-white pb-1">
                Budget & Expenses
              </a>
              <a href="/feedback" className="text-indigo-100 hover:text-white transition-colors">
                Feedback
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative text-indigo-100 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2 text-white">
                <img 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <span className="hidden md:block">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex text-sm text-gray-500 mb-2">
            <a href="/admin/dashboard" className="hover:text-indigo-600">Dashboard</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Budget & Expenses</span>
          </nav>
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Event Budget & Expenses</h2>
              <p className="text-gray-600 mt-1">Comprehensive financial management for all events</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-gray-500">Last Updated</p>
              <p className="text-gray-900 font-medium">July 27, 2025, 2:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
              <select 
                value={filters.event}
                onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input 
                type="date" 
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({ event: '', category: '', status: '', dateRange: '' });
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1-{Math.min(itemsPerPage, filteredExpenses.length)}</span> of <span className="font-medium">{filteredExpenses.length}</span> expenses
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
            <button 
              onClick={() => setShowBudgetModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Budget Setup</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Dashboard */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                  <p className="text-3xl font-bold">Rs. {budgetData.totalBudget.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Wallet className="w-4 h-4 mr-2 text-blue-200" />
                    <span className="text-sm text-blue-100">Across 3 events</span>
                  </div>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                  <PieChart className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold">Rs. {budgetData.totalSpent.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-2 text-red-200" />
                    <span className="text-sm text-red-100">{Math.round((budgetData.totalSpent / budgetData.totalBudget) * 100)}% of budget</span>
                  </div>
                </div>
                <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Remaining</p>
                  <p className="text-3xl font-bold">Rs. {budgetData.remaining.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Target className="w-4 h-4 mr-2 text-green-200" />
                    <span className="text-sm text-green-100">{Math.round((budgetData.remaining / budgetData.totalBudget) * 100)}% available</span>
                  </div>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Approvals</p>
                  <p className="text-3xl font-bold">{budgetData.pendingApprovals}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 mr-2 text-yellow-200" />
                    <span className="text-sm text-yellow-100">Rs. {budgetData.pendingAmount.toLocaleString()} total</span>
                  </div>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Budget Allocation */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Allocation by Category</h3>
            <div className="space-y-4">
              {budgetAllocations.map((allocation, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${allocation.color} rounded`}></div>
                    <span className="text-gray-700 font-medium">{allocation.category}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${allocation.color} h-2 rounded-full`} 
                        style={{ width: `${(allocation.spent / allocation.allocated) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-900 font-semibold">Rs. {allocation.spent.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm"> / Rs. {allocation.allocated.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">({allocation.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search expenses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Bulk Actions
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortConfig.key === 'date' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    Category
                    {sortConfig.key === 'category' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    {sortConfig.key === 'amount' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageExpenses().map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryIcon(expense.category)}
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{expense.description}</div>
                      {expense.notes && (
                        <div className="text-gray-500 text-xs">{expense.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Rs. {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                        {expense.eventName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.receiptUrl ? (
                        <button 
                          onClick={() => {
                            setSelectedExpense(expense);
                            setShowReceiptModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                          <Receipt className="w-4 h-4 mr-1" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No receipt</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Edit">
                        <button 
                          onClick={() => alert('Edit expense feature coming soon!')}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert('Expense approved!')}
                          className="text-green-600 hover:text-green-800 p-1 rounded" 
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => confirm('Are you sure you want to delete this expense?') && alert('Expense deleted!')}
                          className="text-red-600 hover:text-red-800 p-1 rounded" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert('More options coming soon!')}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded" 
                          title="More"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries per page</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === page 
                        ? 'bg-indigo-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Expense</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Date *
                  </label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Amount (PKR) *
                  </label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Category *
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Event *
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-gray-400 inline" />
                  Description *
                </label>
                <input 
                  type="text" 
                  placeholder="Brief description of the expense" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Any additional details, vendor information, etc." 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Priority
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Payment Method
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="cash">Cash</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt/Invoice
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drop files here or <span className="text-indigo-600 font-medium cursor-pointer">browse</span></p>
                  <p className="text-sm text-gray-500 mt-1">Support: PDF, JPG, PNG (Max 5MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Vendor Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Vendor or supplier name" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 inline" />
                    Vendor Contact
                  </label>
                  <input 
                    type="text" 
                    placeholder="Phone number or email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                </div>
              </div>
            </form>
            
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-1 inline" />
                All expenses require admin approval before processing
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Save Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Setup Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Budget Setup & Allocation</h3>
              <button 
                onClick={() => setShowBudgetModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Event Budget (PKR)</label>
                <input 
                  type="number" 
                  placeholder="250000" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation by Category</h4>
                <div className="space-y-4">
                  {budgetAllocations.map((allocation, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-32">
                        <label className="text-sm font-medium text-gray-700">{allocation.category}</label>
                      </div>
                      <div className="flex-1">
                        <input 
                          type="number" 
                          placeholder={allocation.allocated.toString()} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-sm text-gray-600">{allocation.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">Total Allocated:</span>
                    <span className="font-bold text-blue-900">Rs. 250,000 (100%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowBudgetModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {showReceiptModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Receipt - {selectedExpense.description}</h3>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Receipt preview would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">File: {selectedExpense.receiptUrl}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Amount:</label>
                  <p className="text-gray-900">Rs. {selectedExpense.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Date:</label>
                  <p className="text-gray-900">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Vendor:</label>
                  <p className="text-gray-900">{selectedExpense.vendorName || 'N/A'}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Payment Method:</label>
                  <p className="text-gray-900">{selectedExpense.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetExpenses;