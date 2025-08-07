import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LogoutModal from '../components/LogoutModal';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Settings,
  Menu,
  X,
  ChevronRight,
  Star,
  Heart,
  Award,
  MessageCircle,
  Zap,
  Shield
  LogOut
} from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ComponentType<any>;
  details?: string;
}

interface Event {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'completed' | 'urgent';
  volunteers: number;
  capacity: number;
  location: string;
  coordinator: string;
  date: string;
  issues?: number;
}

interface Activity {
  id: string;
  type: 'check-in' | 'task-complete' | 'registration' | 'feedback';
  volunteer: string;
  event?: string;
  task?: string;
  timestamp: string;
  location?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [notifications, setNotifications] = useState(12);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const executiveMetrics: MetricCard[] = [
    {
      id: 'platform-health',
      title: 'Platform Health',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      color: 'text-green-600 bg-green-100',
      icon: Activity,
      details: 'All systems operational'
    },
    {
      id: 'active-events',
      title: 'Active Events',
      value: '23',
      change: '+4 this week',
      trend: 'up',
      color: 'text-blue-600 bg-blue-100',
      icon: Calendar,
      details: '15 upcoming, 8 ongoing'
    },
    {
      id: 'volunteer-engagement',
      title: 'Volunteer Engagement',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      color: 'text-purple-600 bg-purple-100',
      icon: Users,
      details: 'Industry benchmark: 74%'
    },
    {
      id: 'community-impact',
      title: 'People Helped',
      value: '1,247',
      change: '+156 this month',
      trend: 'up',
      color: 'text-orange-600 bg-orange-100',
      icon: Heart,
      details: 'Projected: 1,500 by month end'
    }
  ];

  const liveEvents: Event[] = [
    {
      id: '1',
      title: 'Community Food Drive',
      status: 'live',
      volunteers: 12,
      capacity: 15,
      location: 'Downtown Center',
      coordinator: 'Sarah Johnson',
      date: 'Today',
      issues: 0
    },
    {
      id: '2',
      title: 'Youth Workshop',
      status: 'urgent',
      volunteers: 3,
      capacity: 8,
      location: 'Library',
      coordinator: 'Mike Chen',
      date: 'Today',
      issues: 1
    },
    {
      id: '3',
      title: 'Park Cleanup',
      status: 'upcoming',
      volunteers: 8,
      capacity: 12,
      location: 'Central Park',
      coordinator: 'Emma Davis',
      date: 'Tomorrow',
      issues: 0
    }
  ];

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'check-in',
      volunteer: 'Alex Rivera',
      event: 'Park Cleanup',
      timestamp: '2 min ago',
      location: 'Central Park'
    },
    {
      id: '2',
      type: 'task-complete',
      volunteer: 'Emma Davis',
      task: 'Setup Equipment',
      event: 'Community Meeting',
      timestamp: '5 min ago'
    },
    {
      id: '3',
      type: 'registration',
      volunteer: 'John Smith',
      event: 'Food Drive',
      timestamp: '12 min ago'
    },
    {
      id: '4',
      type: 'feedback',
      volunteer: 'Maria Garcia',
      event: 'Beach Cleanup',
      timestamp: '18 min ago'
    }
  ];

  const sidebarSections = [
    {
      title: 'Overview',
      items: [
        { icon: BarChart3, label: 'Dashboard', route: '/admin', active: true },
        { icon: TrendingUp, label: 'Analytics', route: '/admin/dashboard', badge: 'new' },
        { icon: Bell, label: 'Notifications', route: '/admin/notifications', count: notifications }
      ]
    },
    {
      title: 'Event Management',
      items: [
        { icon: Plus, label: 'Create Event', route: '/admin/events/create', highlight: true, onClick: () => navigate('/admin/events/create') },
        { icon: Calendar, label: 'All Events', route: '/admin/events', count: 23, onClick: () => navigate('/admin/dashboard') },
        { icon: Clock, label: 'Task Board', route: '/admin/kanban', urgent: 3, onClick: () => navigate('/admin/kanban') },
        { icon: MapPin, label: 'Venues', route: '/admin/venues', onClick: () => navigate('/admin/dashboard') }
      ]
    },
    {
      title: 'People & Community',
      items: [
        { icon: Users, label: 'Volunteers', route: '/admin/volunteers', count: 247, onClick: () => navigate('/admin/volunteers') },
        { icon: Award, label: 'Recognition', route: '/admin/recognition', onClick: () => navigate('/admin/dashboard') },
        { icon: MessageCircle, label: 'Communications', route: '/admin/communications', onClick: () => navigate('/admin/dashboard') }
      ]
    },
    {
      title: 'Operations',
      items: [
        { icon: DollarSign, label: 'Budget', route: '/admin/expenses', onClick: () => navigate('/admin/expenses') },
        { icon: Shield, label: 'Safety', route: '/admin/safety', onClick: () => navigate('/admin/dashboard') }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check-in': return CheckCircle;
      case 'task-complete': return Award;
      case 'registration': return Users;
      case 'feedback': return MessageCircle;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex-shrink-0`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Digi-Vent</h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick || (() => {})}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      item.active
                        ? 'bg-indigo-100 text-indigo-700'
                        : item.highlight
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {item.count}
                          </span>
                        )}
                        {item.urgent && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            {item.urgent}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All systems operational</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, volunteers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>

              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.user_metadata?.role || 'User'}</p>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Executive Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {executiveMetrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4 ml-1" />}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                  <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                  {metric.details && (
                    <p className="text-xs text-gray-500">{metric.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Events Monitor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Live Events Monitor</h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {liveEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        </div>
                        {event.issues && event.issues > 0 && (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{event.issues} issue{event.issues > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Volunteers</p>
                          <p className="font-medium text-gray-900">{event.volunteers}/{event.capacity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{event.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Coordinator</p>
                          <p className="font-medium text-gray-900">{event.coordinator}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">{event.date}</p>
                        </div>
                      </div>
                      {event.status === 'urgent' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            Need {event.capacity - event.volunteers} more volunteers
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <ActivityIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.volunteer}</span>
                              {activity.type === 'check-in' && ' checked in to '}
                              {activity.type === 'task-complete' && ' completed '}
                              {activity.type === 'registration' && ' registered for '}
                              {activity.type === 'feedback' && ' left feedback for '}
                              {activity.event && <span className="font-medium">{activity.event}</span>}
                              {activity.task && <span className="font-medium">{activity.task}</span>}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                              {activity.location && (
                                <>
                                  <span className="text-xs text-gray-300">•</span>
                                  <p className="text-xs text-gray-500">{activity.location}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center">
                    View all activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Create New Event</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Manage Volunteers</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Export Reports</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-gray-900">Send Announcement</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Volunteer Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Volunteer Engagement Trends</h2>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                    <p className="text-sm text-gray-400">Showing volunteer participation over time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Success Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Event Success Metrics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Average Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                    <span className="text-sm font-semibold text-gray-900">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Volunteer Retention</span>
                    <span className="text-sm font-semibold text-gray-900">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Budget Efficiency</span>
                    <span className="text-sm font-semibold text-green-600">+15%</span>
                  </div>
                </div>
                <div className="mt-6 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Success trend visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setIsLoggingOut(true);
          try {
            await logout();
            setShowLogoutModal(false);
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            setIsLoggingOut(false);
          }
        }}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default AdminDashboard;