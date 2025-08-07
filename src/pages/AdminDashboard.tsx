import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useTasks } from '../hooks/useTasks';
import { useExpenses } from '../hooks/useExpenses';
import { useFeedback } from '../hooks/useFeedback';
import { useNotifications } from '../hooks/useNotifications';
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
  X,
  Shield,
  MessageCircle,
  UserCheck,
  Megaphone,
  AlertCircle,
  TrendingDown,
  Building,
  Sparkles
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { tasks } = useTasks();
  const { expenses } = useExpenses();
  const { feedback } = useFeedback();
  const { notifications, unreadCount } = useNotifications();
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for dashboard
  const dashboardStats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === 'published' || e.status === 'ongoing').length,
    totalVolunteers: 247,
    totalBudget: 125000,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    averageRating: 4.7,
    totalFeedback: feedback.length,
    platformHealth: 98.5,
    volunteerEngagement: 87,
    schedulingIssues: 3,
    recognitionPoints: 1250,
    communicationsSent: 45,
    budgetUtilization: 85,
    safetyIncidents: 0
  };

  const navigationSections = [
    {
      title: 'OVERVIEW',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: BarChart3, 
          active: true,
          onClick: () => setActiveSection('dashboard')
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: TrendingUp, 
          badge: 'new',
          onClick: () => alert('Analytics feature coming soon!')
        },
        { 
          id: 'notifications', 
          label: 'Notifications', 
          icon: Bell, 
          count: unreadCount || 12,
          onClick: () => alert('Notifications feature coming soon!')
        }
      ]
    },
    {
      title: 'EVENT MANAGEMENT',
      items: [
        { 
          id: 'create-event', 
          label: 'Create Event', 
          icon: Plus, 
          highlight: true,
          onClick: () => navigate('/admin/events/create')
        },
        { 
          id: 'all-events', 
          label: 'All Events', 
          icon: Calendar, 
          count: dashboardStats.totalEvents,
          onClick: () => setActiveSection('events')
        },
        { 
          id: 'scheduling', 
          label: 'Scheduling', 
          icon: Clock, 
          count: dashboardStats.schedulingIssues,
          alert: dashboardStats.schedulingIssues > 0,
          onClick: () => alert('Scheduling feature coming soon!')
        },
        { 
          id: 'venues', 
          label: 'Venues', 
          icon: Building,
          onClick: () => alert('Venues management feature coming soon!')
        }
      ]
    },
    {
      title: 'PEOPLE & COMMUNITY',
      items: [
        { 
          id: 'volunteers', 
          label: 'Volunteers', 
          icon: Users, 
          count: dashboardStats.totalVolunteers,
          onClick: () => navigate('/admin/volunteers')
        },
        { 
          id: 'recognition', 
          label: 'Recognition', 
          icon: Award,
          onClick: () => alert('Recognition system feature coming soon!')
        },
        { 
          id: 'communications', 
          label: 'Communications', 
          icon: MessageCircle,
          onClick: () => alert('Communications feature coming soon!')
        }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { 
          id: 'budget', 
          label: 'Budget', 
          icon: DollarSign,
          onClick: () => navigate('/admin/expenses')
        },
        { 
          id: 'safety', 
          label: 'Safety', 
          icon: Shield,
          onClick: () => alert('Safety management feature coming soon!')
        }
      ]
    }
  ];

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

  const handleViewEvent = (eventId: string) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      alert(`Event ${eventId} would be deleted`);
    }
  };

  const handleDuplicateEvent = (eventId: string) => {
    navigate(`/admin/events/duplicate/${eventId}`);
  };

  const handleRefreshData = () => {
    window.location.reload();
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Digi-Vent</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                      item.active || activeSection === item.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : item.highlight
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${
                        item.active || activeSection === item.id
                          ? 'text-indigo-600'
                          : item.highlight
                          ? 'text-green-600'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                      {!sidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.alert 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover" 
            />
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500">{profile?.role || 'Admin'}</p>
              </div>
            )}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, volunteers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button 
                onClick={handleRefreshData}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}! 👋
                    </h2>
                    <p className="text-indigo-100 text-lg">
                      Here's what's happening with your events today.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <button 
                      onClick={() => navigate('/admin/events/create')}
                      className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Create Event
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platform Health */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
                        <p className="text-sm text-gray-500">All systems operational</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{dashboardStats.platformHealth}%</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +2.1%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Active Events</h3>
                        <p className="text-sm text-gray-500">15 upcoming, 8 ongoing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{dashboardStats.activeEvents}</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +4 this week
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volunteer Engagement */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Volunteer Engagement</h3>
                        <p className="text-sm text-gray-500">Industry benchmark: 74%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">{dashboardStats.volunteerEngagement}%</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Above average
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Events Monitor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Live Events Monitor</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Live Event */}
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Live
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Community Food Drive</h3>
                        <div className="grid grid-cols-4 gap-8 text-sm text-gray-600 mt-1">
                          <div>
                            <span className="text-gray-500">Volunteers</span>
                            <div className="font-medium">12/15</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Location</span>
                            <div className="font-medium">Downtown Center</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Coordinator</span>
                            <div className="font-medium">Sarah Johnson</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date</span>
                            <div className="font-medium">Today</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">issues</div>
                    </div>
                  </div>

                  {/* Urgent Event */}
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Urgent
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Youth Workshop</h3>
                        <div className="grid grid-cols-4 gap-8 text-sm text-gray-600 mt-1">
                          <div>
                            <span className="text-gray-500">Volunteers</span>
                            <div className="font-medium">3/8</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Location</span>
                            <div className="font-medium">Library</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Coordinator</span>
                            <div className="font-medium">Mike Chen</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date</span>
                            <div className="font-medium">Today</div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Need 5 more volunteers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-sm text-red-500">issue</div>
                    </div>
                  </div>

                  {/* Upcoming Event */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Upcoming
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Park Cleanup</h3>
                        <div className="grid grid-cols-4 gap-8 text-sm text-gray-600 mt-1">
                          <div>
                            <span className="text-gray-500">Volunteers</span>
                            <div className="font-medium">8/12</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Location</span>
                            <div className="font-medium">Central Park</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Coordinator</span>
                            <div className="font-medium">Emma Davis</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date</span>
                            <div className="font-medium">Tomorrow</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">issues</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
                    <button 
                      onClick={() => setActiveSection('events')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer" onClick={() => handleViewEvent(event.id)}>
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
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                    <button 
                      onClick={() => navigate('/admin/kanban')}
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

          {activeSection === 'events' && (
            <div className="space-y-6">
              {/* Events Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
                  <p className="text-gray-600 mt-1">Manage all your events in one place</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => alert('Export functionality would be implemented here')}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <button 
                    onClick={() => navigate('/admin/events/create')}
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
      </div>

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