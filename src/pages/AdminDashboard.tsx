import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useTasks } from '../hooks/useTasks';
import { useExpenses } from '../hooks/useExpenses';
import { useFeedback } from '../hooks/useFeedback';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Plus, 
  Settings, 
  Bell, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  Activity,
  Zap,
  Heart,
  LogOut,
  User,
  Home,
  FileText,
  PieChart,
  Download,
  Upload,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { tasks } = useTasks();
  const { expenses } = useExpenses();
  const { feedback } = useFeedback();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data for dashboard
  const dashboardStats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === 'published' || e.status === 'ongoing').length,
    totalVolunteers: 247,
    totalBudget: 125000,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    averageRating: 4.7,
    totalFeedback: feedback.length
  };

  const recentEvents = events.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);
  const recentExpenses = expenses.slice(0, 5);

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

  const handleCreateEvent = () => {
    navigate('/admin/events/create');
  };

  const handleViewTasks = () => {
    navigate('/admin/kanban');
  };

  const handleViewExpenses = () => {
    navigate('/admin/expenses');
  };

  const handleViewVolunteers = () => {
    navigate('/admin/volunteers');
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // In a real app, this would call an API to delete the event
      alert(`Event ${eventId} would be deleted`);
    }
  };

  const handleDuplicateEvent = (eventId: string) => {
    navigate(`/admin/events/duplicate/${eventId}`);
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleExportData = () => {
    alert('Export functionality would be implemented here');
  };

  const handleImportData = () => {
    alert('Import functionality would be implemented here');
  };

  const handleViewAnalytics = () => {
    alert('Analytics view would be implemented here');
  };

  const handleManageSettings = () => {
    alert('Settings management would be implemented here');
  };

  const handleViewNotifications = () => {
    alert('Notifications view would be implemented here');
  };

  const handleSearchEvents = (query: string) => {
    alert(`Searching for: ${query}`);
  };

  const handleFilterEvents = (filter: string) => {
    alert(`Filtering by: ${filter}`);
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'events' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Events
                </button>
                <button 
                  onClick={handleViewTasks}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Tasks
                </button>
                <button 
                  onClick={handleViewVolunteers}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Volunteers
                </button>
                <button 
                  onClick={handleViewExpenses}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Budget
                </button>
              </nav>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefreshData}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={handleViewNotifications}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}! 👋
                  </h1>
                  <p className="text-indigo-100 text-lg">
                    Here's what's happening with your events today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <button 
                    onClick={handleCreateEvent}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create Event
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Events</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalEvents}</p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Events</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeEvents}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      <Activity className="w-4 h-4 inline mr-1" />
                      Currently running
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Volunteers</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalVolunteers}</p>
                    <p className="text-sm text-purple-600 mt-1">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Engaged community
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Budget</p>
                    <p className="text-3xl font-bold text-gray-900">${dashboardStats.totalBudget.toLocaleString()}</p>
                    <p className="text-sm text-orange-600 mt-1">
                      <Target className="w-4 h-4 inline mr-1" />
                      85% utilized
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <DollarSign className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={handleCreateEvent}
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-indigo-600">Create Event</p>
                    <p className="text-sm text-gray-500">Start planning a new event</p>
                  </div>
                </button>

                <button 
                  onClick={handleViewTasks}
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                >
                  <CheckCircle className="w-8 h-8 text-gray-400 group-hover:text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-green-600">Manage Tasks</p>
                    <p className="text-sm text-gray-500">View Kanban board</p>
                  </div>
                </button>

                <button 
                  onClick={handleViewVolunteers}
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <Users className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-purple-600">Volunteers</p>
                    <p className="text-sm text-gray-500">Manage your team</p>
                  </div>
                </button>

                <button 
                  onClick={handleViewExpenses}
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
                >
                  <DollarSign className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-orange-600">Budget</p>
                    <p className="text-sm text-gray-500">Track expenses</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.start_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewEvent(event.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                  <button 
                    onClick={handleViewTasks}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View board
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'progress' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500 capitalize">{task.status}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Events Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
                <p className="text-gray-600 mt-1">Manage all your events in one place</p>
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
                  onClick={handleCreateEvent}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-video bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <img 
                      src={event.cover_image_url || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.start_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewEvent(event.id)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                          title="View Event"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditEvent(event.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDuplicateEvent(event.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Duplicate Event"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

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

export default AdminDashboard;