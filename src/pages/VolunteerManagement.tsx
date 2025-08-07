import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Star, 
  Clock, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Target,
  Activity,
  Heart,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  MessageCircle,
  FileText,
  BarChart3,
  PieChart,
  TrendingDown,
  RefreshCw,
  X,
  Check,
  Info
} from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalHours: number;
  eventsCompleted: number;
  level: number;
  xp: number;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  badges: string[];
  upcomingEvents: number;
  completionRate: number;
}

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    availability: '',
    skill: '',
    level: '',
    location: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockVolunteers: Volunteer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Team Lead',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-07-25',
      totalHours: 156,
      eventsCompleted: 23,
      level: 7,
      xp: 1250,
      skills: ['Event Planning', 'Team Leadership', 'Audio/Visual'],
      availability: 'available',
      rating: 4.9,
      badges: ['Team Player', 'Event Master', 'Audio Expert'],
      upcomingEvents: 2,
      completionRate: 95
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Volunteer',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2024-07-24',
      totalHours: 89,
      eventsCompleted: 15,
      level: 5,
      xp: 890,
      skills: ['Photography', 'Social Media', 'Customer Service'],
      availability: 'busy',
      rating: 4.7,
      badges: ['Photographer', 'Social Star'],
      upcomingEvents: 1,
      completionRate: 87
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Coordinator',
      status: 'active',
      joinDate: '2024-03-10',
      lastActive: '2024-07-26',
      totalHours: 134,
      eventsCompleted: 19,
      level: 6,
      xp: 1120,
      skills: ['Event Coordination', 'First Aid', 'Public Speaking'],
      availability: 'available',
      rating: 4.8,
      badges: ['First Aid Certified', 'Speaker'],
      upcomingEvents: 3,
      completionRate: 92
    },
    {
      id: '4',
      name: 'Alex Rivera',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Volunteer',
      status: 'pending',
      joinDate: '2024-07-20',
      lastActive: '2024-07-20',
      totalHours: 0,
      eventsCompleted: 0,
      level: 1,
      xp: 0,
      skills: ['Graphic Design', 'Marketing'],
      availability: 'available',
      rating: 0,
      badges: [],
      upcomingEvents: 0,
      completionRate: 0
    }
  ];

  const stats = {
    totalVolunteers: 247,
    activeVolunteers: 189,
    newThisMonth: 23,
    averageRating: 4.7,
    totalHours: 12450,
    retentionRate: 87
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVolunteers(mockVolunteers);
      setFilteredVolunteers(mockVolunteers);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = volunteers.filter(volunteer => {
      const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = !filters.status || volunteer.status === filters.status;
      const matchesAvailability = !filters.availability || volunteer.availability === filters.availability;
      const matchesSkill = !filters.skill || volunteer.skills.includes(filters.skill);
      const matchesLocation = !filters.location || volunteer.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesStatus && matchesAvailability && matchesSkill && matchesLocation;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'totalHours':
            aValue = a.totalHours;
            bValue = b.totalHours;
            break;
          case 'level':
            aValue = a.level;
            bValue = b.level;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredVolunteers(filtered);
    setCurrentPage(1);
  }, [volunteers, searchQuery, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getCurrentPageVolunteers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVolunteers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Volunteer Management</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </button>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Volunteers</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalVolunteers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.activeVolunteers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">New This Month</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.newThisMonth}</p>
                </div>
                <UserPlus className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Total Hours</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.totalHours.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Retention</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.retentionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Volunteer
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getCurrentPageVolunteers().map((volunteer) => (
            <div key={volunteer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={volunteer.avatar}
                      alt={volunteer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(volunteer.availability)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                    <p className="text-sm text-gray-600">{volunteer.role}</p>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(volunteer.status)}`}>
                  {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{volunteer.rating}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{volunteer.totalHours}</p>
                  <p className="text-xs text-gray-600">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{volunteer.eventsCompleted}</p>
                  <p className="text-xs text-gray-600">Events</p>
                </div>
              </div>

              {/* Level & XP */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Level {volunteer.level}</span>
                  <span className="text-sm text-gray-600">{volunteer.xp} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(volunteer.xp % 200) / 200 * 100}%` }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {volunteer.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {volunteer.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{volunteer.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{volunteer.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{volunteer.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => alert(`Viewing ${volunteer.name}'s profile...`)}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </button>
                <button 
                  onClick={() => alert(`Messaging ${volunteer.name}...`)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 mx-auto" />
                </button>
                <button 
                  onClick={() => alert(`Editing ${volunteer.name}'s profile...`)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                  className={`px-4 py-2 rounded-lg ${
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
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManagement;