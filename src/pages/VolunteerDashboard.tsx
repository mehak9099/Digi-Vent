import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LogoutModal from '../components/LogoutModal';
import { Calendar, Clock, Users, Award, TrendingUp, Bell, MessageCircle, CheckCircle, Star, Target, Zap, MapPin, Book, Heart, Activity, Settings, Search, Filter, Plus, ChevronRight, ChevronDown, Play, Pause, MoreHorizontal, Flag, User, Camera, Upload, Download, Share, Edit, Trash2, Eye, EyeOff, Lock, Unlock, RefreshCw, AlertTriangle, Info, X, Check, ArrowUp, ArrowDown, ArrowRight, Home, Briefcase, GraduationCap, Shield, Globe, Smartphone, Headphones, Mic, Video, FileText, Image, Link, Mail, Phone, Navigation, Compass, Map, Route, Car, Bus, Bike, Wallet as Walk } from 'lucide-react';
import { LogOut } from 'lucide-react';

interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  impactScore: number;
  totalHours: number;
  eventsCompleted: number;
  skills: string[];
  badges: Badge[];
  availability: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Task {
  id: string;
  title: string;
  description: string;
  event: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in-progress' | 'completed' | 'blocked';
  dueDate: string;
  estimatedHours: number;
  skillsRequired: string[];
  team: string[];
  xpReward: number;
  location: string;
  prerequisites: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  role: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  team: string[];
  description: string;
  requirements: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  xpReward: number;
  unlocked: boolean;
}

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Mock data - in real app, this would come from API
  const volunteer: VolunteerProfile = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    level: 7,
    xp: 1250,
    xpToNext: 750,
    streak: 5,
    impactScore: 92,
    totalHours: 156,
    eventsCompleted: 23,
    skills: ['Event Setup', 'Audio/Visual', 'Team Leadership', 'First Aid'],
    badges: [
      { id: '1', name: 'Team Player', icon: '🤝', description: 'Collaborated on 10+ events', earnedDate: '2024-01-15', rarity: 'common' },
      { id: '2', name: 'Audio Expert', icon: '🎵', description: 'Mastered audio equipment setup', earnedDate: '2024-02-20', rarity: 'rare' },
      { id: '3', name: 'Event Streak', icon: '🔥', description: '5 consecutive events completed', earnedDate: '2024-03-10', rarity: 'epic' }
    ],
    availability: 'available'
  };

  const upcomingTasks: Task[] = [
    {
      id: '1',
      title: 'Audio Setup - Main Stage',
      description: 'Set up and test all audio equipment for the main stage performance',
      event: 'TechFest 2024',
      priority: 'high',
      status: 'assigned',
      dueDate: '2024-08-10T14:00:00Z',
      estimatedHours: 3,
      skillsRequired: ['Audio/Visual', 'Equipment Setup'],
      team: ['Mike Chen', 'Alex Rivera', 'Emma Davis'],
      xpReward: 75,
      location: 'Main Stage Area',
      prerequisites: ['Safety Training', 'Equipment Certification']
    },
    {
      id: '2',
      title: 'Volunteer Check-in Coordination',
      description: 'Manage volunteer check-in process and distribute materials',
      event: 'Community Food Drive',
      priority: 'medium',
      status: 'assigned',
      dueDate: '2024-08-12T09:00:00Z',
      estimatedHours: 2,
      skillsRequired: ['Team Leadership', 'Organization'],
      team: ['Jordan Kim', 'Taylor Swift'],
      xpReward: 50,
      location: 'Registration Tent',
      prerequisites: ['Volunteer Orientation']
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'TechFest 2024',
      date: '2024-08-10',
      time: '10:00 AM - 6:00 PM',
      location: 'Downtown Convention Center',
      role: 'Audio/Visual Coordinator',
      status: 'upcoming',
      team: ['Audio Squad', 'Setup Crew'],
      description: 'Annual technology festival featuring workshops, demos, and networking',
      requirements: ['Audio equipment knowledge', 'Team coordination skills']
    },
    {
      id: '2',
      title: 'Community Food Drive',
      date: '2024-08-12',
      time: '8:00 AM - 2:00 PM',
      location: 'Central Park Pavilion',
      role: 'Team Lead',
      status: 'upcoming',
      team: ['Distribution Team', 'Registration Team'],
      description: 'Monthly food distribution event serving local families in need',
      requirements: ['Leadership experience', 'Physical activity tolerance']
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Event Master',
      description: 'Complete 25 events',
      icon: '🏆',
      progress: 23,
      total: 25,
      xpReward: 200,
      unlocked: false
    },
    {
      id: '2',
      title: 'Skill Collector',
      description: 'Learn 10 different skills',
      icon: '🎯',
      progress: 4,
      total: 10,
      xpReward: 150,
      unlocked: false
    },
    {
      id: '3',
      title: 'Community Champion',
      description: 'Volunteer for 200 hours',
      icon: '❤️',
      progress: 156,
      total: 200,
      xpReward: 300,
      unlocked: false
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextEvent = () => {
    return upcomingEvents[0];
  };

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-4 h-4 text-red-600" />;
      case 'high': return <Flag className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Flag className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const nextEvent = getNextEvent();
  const daysUntilNext = nextEvent ? getDaysUntilEvent(nextEvent.date) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Smart Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span>Volunteer Dashboard</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks, events..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                  <Zap className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                  <Clock className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.user_metadata?.avatar_url || volunteer.avatar}
                  alt={user?.user_metadata?.full_name || volunteer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || volunteer.name}</p>
                  <p className="text-xs text-gray-500">Level {volunteer.level} Volunteer</p>
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
        </div>
      

      {/* Dynamic Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {getGreeting()}, {volunteer.name.split(' ')[0]}! 🌅
              </h1>
              {nextEvent && (
                <p className="text-indigo-100 text-lg">
                  Next: <span className="font-semibold">{nextEvent.title}</span> in {daysUntilNext} days
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Mark Available</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>View Schedule</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Team Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Analytics Bar */}
      {showAnalytics && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Level & XP */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Level {volunteer.level}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">XP</span>
                    <span className="font-medium">{volunteer.xp}/{volunteer.xp + volunteer.xpToNext}</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(volunteer.xp / (volunteer.xp + volunteer.xpToNext)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Event Streak */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{volunteer.streak}</div>
                <div className="text-xs text-orange-600">events</div>
              </div>

              {/* Impact Score */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Impact</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{volunteer.impactScore}%</div>
                <div className="text-xs text-green-600">score</div>
              </div>

              {/* Total Hours */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Hours</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{volunteer.totalHours}</div>
                <div className="text-xs text-purple-600">contributed</div>
              </div>

              {/* Events Completed */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Events</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{volunteer.eventsCompleted}</div>
                <div className="text-xs text-blue-600">completed</div>
              </div>

              {/* Skills */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Skills</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">{volunteer.skills.length}</div>
                <div className="text-xs text-yellow-600">mastered</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showAnalytics && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="w-4 h-4 mr-1" />
              Show Progress Analytics
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Quick Navigation & Shortcuts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Check In to Event</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Log Hours</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Update Availability</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Team Chat</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Achievements Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{achievement.icon}</span>
                        <span className="font-medium text-gray-900">{achievement.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Earned Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h3>
              <div className="space-y-3">
                {volunteer.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getBadgeRarityColor(badge.rarity)}`}>
                      <span className="text-lg">{badge.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                      <p className="text-xs text-gray-500">Earned {new Date(badge.earnedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Tasks & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
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
                {upcomingTasks.map((task) => (
                  <div key={task.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(task.priority)} hover:shadow-md transition-shadow duration-200`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(task.priority)}
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Event</p>
                        <p className="font-medium text-gray-900">{task.event}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Time</p>
                        <p className="font-medium text-gray-900">{task.estimatedHours}h</p>
                      </div>
                      <div>
                        <p className="text-gray-500">XP Reward</p>
                        <p className="font-medium text-indigo-600">+{task.xpReward} XP</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {task.team.slice(0, 3).map((member, index) => (
                            <div key={index} className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-white font-medium">
                                {member.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          ))}
                          {task.team.length > 3 && (
                            <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-white">+{task.team.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{task.team.length} team members</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                          Accept
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          Need Help
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="p-6 space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Your Role: <span className="font-medium text-gray-900">{event.role}</span></p>
                        <p className="text-xs text-gray-500">Teams: {event.team.join(', ')}</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Learning */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Skills & Learning</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {volunteer.skills.map((skill, index) => (
                    <div key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 text-sm rounded-lg text-center font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Recommended Learning</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete "Stage Management Basics" to unlock new event opportunities and earn +50 XP
                  </p>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default VolunteerDashboard;