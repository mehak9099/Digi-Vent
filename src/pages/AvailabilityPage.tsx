import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Zap, TrendingUp, Bell, Settings, Search, Filter, Plus, ChevronLeft, ChevronRight, Check, X, AlertTriangle, Star, Target, Activity, MapPin, MessageCircle, FolderSync as Sync, Brain, Shield, Award, Heart, RefreshCw, Download, Upload, Eye, EyeOff, MoreHorizontal, ChevronDown, ChevronUp, ArrowRight, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'partial' | 'unavailable' | 'event';
  eventId?: string;
  eventName?: string;
  role?: string;
  skillMatch?: number;
  teamMembers?: string[];
  flexibility: 'rigid' | 'flexible' | 'preferred';
  notes?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  teamSize: number;
  confirmedVolunteers: number;
  skillMatch: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  roles: string[];
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'available' | 'partial' | 'unavailable' | 'pending';
  role: string;
  skillLevel: number;
}

interface AIRecommendation {
  id: string;
  type: 'optimal_slot' | 'skill_match' | 'team_coordination' | 'conflict_resolution';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  action: string;
}

const AvailabilityPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showTeamPanel, setShowTeamPanel] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [notifications, setNotifications] = useState(5);

  // Mock data - in real app, this would come from API
  const volunteerProfile = {
    name: 'Sarah Johnson',
    level: 7,
    xp: 1250,
    xpToNext: 750,
    availabilityRate: 85,
    monthlyGoal: 40,
    currentHours: 32,
    consistencyScore: 9.2,
    skillMatchRate: 94,
    teamCollaboration: 15
  };

  const events: Event[] = [
    {
      id: '1',
      name: 'TechFest 2025',
      date: '2024-08-10',
      location: 'Convention Center',
      teamSize: 15,
      confirmedVolunteers: 12,
      skillMatch: 95,
      priority: 'high',
      roles: ['Audio Tech', 'Setup Crew', 'Registration'],
      description: 'Annual technology festival with workshops and demos'
    },
    {
      id: '2',
      name: 'Community Food Drive',
      date: '2024-08-15',
      location: 'Central Park',
      teamSize: 10,
      confirmedVolunteers: 8,
      skillMatch: 78,
      priority: 'medium',
      roles: ['Distribution', 'Registration', 'Logistics'],
      description: 'Monthly food distribution for local families'
    },
    {
      id: '3',
      name: 'Youth Workshop',
      date: '2024-08-20',
      location: 'Community Center',
      teamSize: 6,
      confirmedVolunteers: 4,
      skillMatch: 88,
      priority: 'high',
      roles: ['Instructor', 'Assistant', 'Setup'],
      description: 'Educational workshop for local youth'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      status: 'available',
      role: 'Audio Tech',
      skillLevel: 85
    },
    {
      id: '2',
      name: 'Lisa Chen',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      status: 'partial',
      role: 'Setup Crew',
      skillLevel: 92
    },
    {
      id: '3',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      status: 'unavailable',
      role: 'Registration',
      skillLevel: 78
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      status: 'pending',
      role: 'Team Lead',
      skillLevel: 96
    }
  ];

  const aiRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'optimal_slot',
      title: 'Perfect Match Found!',
      description: 'Saturday 2-6pm TechFest audio setup matches your expertise perfectly',
      confidence: 95,
      impact: 'high',
      action: 'Accept Recommendation'
    },
    {
      id: '2',
      type: 'team_coordination',
      title: 'Team Sync Opportunity',
      description: 'Your regular team needs help on Sunday morning - great collaboration chance',
      confidence: 87,
      impact: 'medium',
      action: 'View Team Schedule'
    },
    {
      id: '3',
      type: 'skill_match',
      title: 'Skill Development',
      description: 'New lighting tech role available - expand your expertise and earn +50 XP',
      confidence: 78,
      impact: 'medium',
      action: 'Learn More'
    }
  ];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayStatus = getDayStatus(date);
      days.push({
        date: day,
        fullDate: date,
        status: dayStatus,
        hasEvent: hasEventOnDate(date),
        isToday: isToday(date)
      });
    }
    
    return days;
  };

  const getDayStatus = (date: Date): 'available' | 'partial' | 'unavailable' | 'event' | 'not-set' => {
    // Mock logic - in real app, this would check actual availability data
    const day = date.getDate();
    if (day % 7 === 0) return 'unavailable';
    if (day % 5 === 0) return 'partial';
    if (day % 3 === 0) return 'event';
    if (day % 2 === 0) return 'available';
    return 'not-set';
  };

  const hasEventOnDate = (date: Date): boolean => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDayStatusColor = (status: string, hasEvent: boolean, isToday: boolean) => {
    let baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ';
    
    if (isToday) {
      baseClasses += 'ring-2 ring-blue-500 ';
    }
    
    if (hasEvent) {
      baseClasses += 'animate-pulse ';
    }
    
    switch (status) {
      case 'available':
        return baseClasses + 'bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200';
      case 'partial':
        return baseClasses + 'bg-yellow-100 border-2 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
      case 'unavailable':
        return baseClasses + 'bg-red-100 border-2 border-red-300 text-red-800 hover:bg-red-200';
      case 'event':
        return baseClasses + 'bg-purple-100 border-2 border-purple-300 text-purple-800 hover:bg-purple-200';
      case 'not-set':
        return baseClasses + 'bg-gray-100 border-2 border-gray-200 text-gray-600 hover:bg-gray-200';
      default:
        return baseClasses + 'bg-gray-100 border-2 border-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '🟢';
      case 'partial': return '🟡';
      case 'unavailable': return '🔴';
      case 'event': return '🎪';
      case 'not-set': return '⚪';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Smart Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Availability Hub</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium">Smart Scheduling</span>
              </div>
            </div>

            {/* Sync Status & Actions */}
            <div className="flex items-center space-x-4">
              {/* Sync Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  syncStatus === 'synced' ? 'bg-green-500' :
                  syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {syncStatus === 'synced' ? 'Synced' :
                   syncStatus === 'syncing' ? 'Syncing...' :
                   'Sync Error'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => alert('Calendar sync feature coming soon!')}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Sync Calendar"
                >
                  <Sync className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => alert('Settings feature coming soon!')}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
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
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{volunteerProfile.name}</p>
                  <p className="text-xs text-gray-500">Level {volunteerProfile.level} Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI-Powered Dynamic Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <Brain className="w-8 h-8 mr-3" />
                Optimize Your Impact, {volunteerProfile.name.split(' ')[0]}! 🎯
              </h1>
              <p className="text-indigo-100 text-lg">
                AI suggests: <span className="font-semibold">+3 optimal slots</span> this week for maximum impact
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Auto-Fill</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import Calendar</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Analytics Dashboard */}
      {showAnalytics && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Personal Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Availability</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{volunteerProfile.availabilityRate}%</div>
                <div className="text-xs text-green-600">↗️ +10% vs last month</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Hours</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{volunteerProfile.currentHours}h</div>
                <div className="text-xs text-blue-600">Goal: {volunteerProfile.monthlyGoal}h</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Consistency</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{volunteerProfile.consistencyScore}</div>
                <div className="text-xs text-purple-600">Very Reliable!</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Skill Match</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{volunteerProfile.skillMatchRate}%</div>
                <div className="text-xs text-orange-600">Perfect alignment</div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Team Events</span>
                </div>
                <div className="text-2xl font-bold text-indigo-900">{volunteerProfile.teamCollaboration}</div>
                <div className="text-xs text-indigo-600">coordinated</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Impact</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">High</div>
                <div className="text-xs text-yellow-600">Top 10%</div>
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
              <ChevronDown className="w-4 h-4 mr-1" />
              Show Analytics Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Events & AI Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Events</h3>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getPriorityColor(event.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.confirmedVolunteers}/{event.teamSize} confirmed</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        <span>{event.skillMatch}% skill match</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        Quick Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          rec.confidence >= 90 ? 'bg-green-500' :
                          rec.confidence >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">{rec.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.impact} impact
                      </span>
                      <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedDate(new Date())}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    <Brain className="w-4 h-4 mr-2 inline" />
                    AI Optimize
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div key={index} className="aspect-square flex items-center justify-center">
                    {day ? (
                      <div className={getDayStatusColor(day.status, day.hasEvent, day.isToday)}>
                        <span>{day.date}</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>🟢</span>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🟡</span>
                    <span className="text-gray-600">Partial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔴</span>
                    <span className="text-gray-600">Unavailable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🎪</span>
                    <span className="text-gray-600">Event Day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⚪</span>
                    <span className="text-gray-600">Not Set</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Team Coordination */}
          <div className="lg:col-span-1 space-y-6">
            {/* Team Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Status</h3>
                <button
                  onClick={() => setShowTeamPanel(!showTeamPanel)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  {showTeamPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {showTeamPanel && (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTeamStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-500">{member.skillLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Sync className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Sync Calendars</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Team Match</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Export Schedule</span>
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

            {/* Availability Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Days</span>
                  <span className="font-semibold text-green-600">18/31</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Partial Days</span>
                  <span className="font-semibold text-yellow-600">6/31</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Event Days</span>
                  <span className="font-semibold text-purple-600">4/31</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Unavailable</span>
                  <span className="font-semibold text-red-600">3/31</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Availability Rate</span>
                    <span className="font-bold text-indigo-600">{volunteerProfile.availabilityRate}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${volunteerProfile.availabilityRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;