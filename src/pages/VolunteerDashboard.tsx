import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  Bell, 
  Settings,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Zap,
  Heart,
  LogOut,
  User,
  Home,
  Plus,
  Eye,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Download,
  Share2,
  MessageCircle,
  BookOpen,
  Trophy,
  Flame,
  Gift,
  Sparkles,
  X
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { tasks } = useTasks();
  const { notifications, unreadCount } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Mock volunteer-specific data
  const volunteerStats = {
    totalHours: profile?.total_hours || 156,
    eventsCompleted: profile?.events_completed || 23,
    level: profile?.level || 7,
    xp: profile?.xp || 1250,
    xpToNext: 750,
    streak: profile?.streak || 5,
    impactScore: profile?.impact_score || 92,
    upcomingEvents: 3,
    availabilityRate: 85,
    badges: ['Team Player', 'Event Master', 'Audio Expert', 'Community Champion']
  };

  const upcomingEvents = events.filter(e => 
    new Date(e.start_date) > new Date() && 
    (e.status === 'published' || e.status === 'ongoing')
  ).slice(0, 3);

  const myTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  const recentAchievements = [
    { id: 1, title: 'Event Master', description: 'Completed 20+ events', icon: '🏆', date: '2 days ago' },
    { id: 2, title: 'Team Player', description: 'Collaborated on 15 events', icon: '🤝', date: '1 week ago' },
    { id: 3, title: 'Audio Expert', description: 'Mastered audio setup', icon: '🎵', date: '2 weeks ago' }
  ];

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

  const handleViewAvailability = () => {
    navigate('/availability');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewTasks = () => {
    navigate('/tasks/board');
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleJoinEvent = (eventId: string) => {
    alert(`Joining event ${eventId}...`);
  };

  const handleCompleteTask = (taskId: string) => {
    alert(`Marking task ${taskId} as complete...`);
  };

  const handleViewProfile = () => {
    alert('Profile view would be implemented here');
  };

  const handleViewAchievements = () => {
    alert('Achievements view would be implemented here');
  };

  const handleViewNotifications = () => {
    alert('Notifications view would be implemented here');
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleShareProgress = () => {
    alert('Share progress functionality would be implemented here');
  };

  const handleViewFeedback = () => {
    navigate('/feedback');
  };

  const handleManageSettings = () => {
    alert('Settings management would be implemented here');
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
                  Dashboard
                </button>
                <button 
                  onClick={handleViewEvents}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Events
                </button>
                <button 
                  onClick={handleViewTasks}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  My Tasks
                </button>
                <button 
                  onClick={handleViewAvailability}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Availability
                </button>
                <button 
                  onClick={handleViewFeedback}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Feedback
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
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
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
                  <p className="text-xs text-gray-500">Level {volunteerStats.level} Volunteer</p>
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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'Volunteer'}! 🌟
                </h1>
                <p className="text-indigo-100 text-lg">
                  You're making a real difference in our community. Keep up the amazing work!
                </p>
              </div>
              <div className="hidden md:block text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-indigo-100">Your Impact Score</p>
                  <p className="text-3xl font-bold">{volunteerStats.impactScore}</p>
                  <p className="text-sm text-indigo-100">Top 10% of volunteers!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Hours</p>
                  <p className="text-3xl font-bold text-gray-900">{volunteerStats.totalHours}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +15 this month
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Events Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{volunteerStats.eventsCompleted}</p>
                  <p className="text-sm text-purple-600 mt-1">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Great progress!
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Current Level</p>
                  <p className="text-3xl font-bold text-gray-900">{volunteerStats.level}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(volunteerStats.xp / (volunteerStats.xp + volunteerStats.xpToNext)) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{volunteerStats.xpToNext} XP to next level</p>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900">{volunteerStats.streak}</p>
                  <p className="text-sm text-orange-600 mt-1">
                    <Flame className="w-4 h-4 inline mr-1" />
                    Keep it going!
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={handleViewEvents}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
              >
                <Calendar className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-indigo-600">Browse Events</p>
                  <p className="text-sm text-gray-500">Find new opportunities</p>
                </div>
              </button>

              <button 
                onClick={handleViewAvailability}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
              >
                <Clock className="w-8 h-8 text-gray-400 group-hover:text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-green-600">Set Availability</p>
                  <p className="text-sm text-gray-500">Update your schedule</p>
                </div>
              </button>

              <button 
                onClick={handleViewTasks}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
              >
                <CheckCircle className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-purple-600">My Tasks</p>
                  <p className="text-sm text-gray-500">View assigned tasks</p>
                </div>
              </button>

              <button 
                onClick={handleViewFeedback}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
              >
                <MessageCircle className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-orange-600">Give Feedback</p>
                  <p className="text-sm text-gray-500">Share your experience</p>
                </div>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upcoming Events & Tasks */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                  <button 
                    onClick={handleViewEvents}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{new Date(event.start_date).toLocaleDateString()}</span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location_name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewEvent(event.id)}
                          className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleJoinEvent(event.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming events</p>
                      <button 
                        onClick={handleViewEvents}
                        className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Browse available events
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* My Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
                  <button 
                    onClick={handleViewTasks}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View board
                  </button>
                </div>
                <div className="space-y-4">
                  {myTasks.length > 0 ? myTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'progress' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500 capitalize">{task.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <button 
                          onClick={() => handleCompleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active tasks</p>
                      <p className="text-sm text-gray-400 mt-1">Great job staying on top of everything!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Profile & Achievements */}
            <div className="space-y-8">
              {/* Profile Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <img 
                    src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4" 
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{profile?.full_name || user?.email}</h3>
                  <p className="text-gray-600">Level {volunteerStats.level} Volunteer</p>
                  <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{volunteerStats.totalHours}</p>
                      <p>Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{volunteerStats.eventsCompleted}</p>
                      <p>Events</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{volunteerStats.badges.length}</p>
                      <p>Badges</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={handleViewProfile}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    View Full Profile
                  </button>
                  <button 
                    onClick={handleShareProgress}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Share Progress
                  </button>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
                  <button 
                    onClick={handleViewAchievements}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                  {volunteerStats.badges.map((badge, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">
                        {index === 0 ? '🤝' : index === 1 ? '🏆' : index === 2 ? '🎵' : '❤️'}
                      </div>
                      <p className="text-xs font-medium text-gray-900">{badge}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default VolunteerDashboard;