import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  UserPlus,
  FileText,
  Send,
  Target,
  Activity,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface Volunteer {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  volunteerDetails: {
    joinDate: string;
    status: 'available' | 'assigned' | 'busy' | 'inactive';
    skills: string[];
    experience: string;
    certifications: string[];
    languages: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  assignments: Assignment[];
  performance: {
    overallRating: number;
    totalReviews: number;
    totalEvents: number;
    completionRate: number;
    punctualityScore: number;
    reviews: Review[];
  };
  availability: {
    weeklySchedule: Record<string, { available: boolean; timeSlots: string[] }>;
    specialDates: SpecialDate[];
  };
}

interface Assignment {
  eventId: string;
  eventName: string;
  taskId: string;
  taskName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
}

interface Review {
  eventId: string;
  rating: number;
  comment: string;
  reviewDate: string;
  reviewerName: string;
}

interface SpecialDate {
  date: string;
  available: boolean;
  reason: string;
}

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    event: '',
    status: '',
    skills: '',
    dateRange: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockVolunteers: Volunteer[] = [
    {
      id: 'VOL-001',
      personalInfo: {
        firstName: 'Ahmed',
        lastName: 'Raza',
        email: 'ahmed.raza@email.com',
        phone: '+92 300 1234567',
        profilePicture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        dateOfBirth: '1995-06-15',
        address: {
          street: '123 Main St',
          city: 'Lahore',
          state: 'Punjab',
          country: 'Pakistan',
          zipCode: '54000'
        }
      },
      volunteerDetails: {
        joinDate: '2024-12-15',
        status: 'available',
        skills: ['Registration', 'Hospitality', 'Technical Support'],
        experience: '2 years',
        certifications: ['First Aid', 'Event Management'],
        languages: ['English', 'Urdu', 'Punjabi'],
        emergencyContact: {
          name: 'Sarah Raza',
          phone: '+92 300 7654321',
          relationship: 'Sister'
        }
      },
      assignments: [
        {
          eventId: 'tech-conference-2025',
          eventName: 'Tech Conference 2025',
          taskId: 'registration-desk',
          taskName: 'Registration Desk',
          startDate: '2025-01-15',
          endDate: '2025-01-17',
          startTime: '09:00',
          endTime: '17:00',
          status: 'active',
          priority: 'medium',
          notes: 'Handle VIP registrations'
        }
      ],
      performance: {
        overallRating: 4.8,
        totalReviews: 12,
        totalEvents: 8,
        completionRate: 96.5,
        punctualityScore: 4.9,
        reviews: [
          {
            eventId: 'startup-meetup-2024',
            rating: 4.9,
            comment: 'Excellent performance, very helpful to attendees',
            reviewDate: '2024-12-01',
            reviewerName: 'Event Manager'
          }
        ]
      },
      availability: {
        weeklySchedule: {
          monday: { available: true, timeSlots: ['09:00-17:00'] },
          tuesday: { available: true, timeSlots: ['09:00-17:00'] },
          wednesday: { available: false, timeSlots: [] },
          thursday: { available: true, timeSlots: ['09:00-17:00'] },
          friday: { available: true, timeSlots: ['09:00-17:00'] },
          saturday: { available: true, timeSlots: ['10:00-16:00'] },
          sunday: { available: false, timeSlots: [] }
        },
        specialDates: [
          {
            date: '2025-01-20',
            available: false,
            reason: 'Personal commitment'
          }
        ]
      }
    },
    {
      id: 'VOL-002',
      personalInfo: {
        firstName: 'Fatima',
        lastName: 'Khan',
        email: 'fatima.khan@email.com',
        phone: '+92 301 2345678',
        profilePicture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        dateOfBirth: '1992-03-22',
        address: {
          street: '456 Garden Road',
          city: 'Karachi',
          state: 'Sindh',
          country: 'Pakistan',
          zipCode: '75000'
        }
      },
      volunteerDetails: {
        joinDate: '2024-10-08',
        status: 'assigned',
        skills: ['Photography', 'Social Media', 'Content Creation'],
        experience: '3 years',
        certifications: ['Digital Marketing', 'Photography'],
        languages: ['English', 'Urdu', 'Sindhi'],
        emergencyContact: {
          name: 'Ali Khan',
          phone: '+92 301 8765432',
          relationship: 'Brother'
        }
      },
      assignments: [
        {
          eventId: 'workshop-series',
          eventName: 'Workshop Series',
          taskId: 'media-coverage',
          taskName: 'Media Coverage',
          startDate: '2025-02-01',
          endDate: '2025-02-03',
          startTime: '10:00',
          endTime: '18:00',
          status: 'active',
          priority: 'high',
          notes: 'Focus on social media content'
        }
      ],
      performance: {
        overallRating: 4.6,
        totalReviews: 8,
        totalEvents: 5,
        completionRate: 100,
        punctualityScore: 4.7,
        reviews: [
          {
            eventId: 'annual-gala-2024',
            rating: 4.8,
            comment: 'Great photography skills and social media engagement',
            reviewDate: '2024-11-15',
            reviewerName: 'Marketing Manager'
          }
        ]
      },
      availability: {
        weeklySchedule: {
          monday: { available: false, timeSlots: [] },
          tuesday: { available: true, timeSlots: ['14:00-20:00'] },
          wednesday: { available: true, timeSlots: ['14:00-20:00'] },
          thursday: { available: true, timeSlots: ['14:00-20:00'] },
          friday: { available: true, timeSlots: ['14:00-20:00'] },
          saturday: { available: true, timeSlots: ['09:00-18:00'] },
          sunday: { available: true, timeSlots: ['09:00-18:00'] }
        },
        specialDates: []
      }
    }
  ];

  const stats = {
    totalVolunteers: 156,
    activeVolunteers: 89,
    availableNow: 34,
    averageRating: 4.8
  };

  const events = [
    { id: 'tech-conference-2025', name: 'Tech Conference 2025' },
    { id: 'workshop-series', name: 'Workshop Series' },
    { id: 'annual-gala', name: 'Annual Gala 2025' }
  ];

  const skillOptions = [
    'Registration', 'Hospitality', 'Technical Support', 'Photography', 
    'Social Media', 'Content Creation', 'Security', 'Logistics'
  ];

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
      const fullName = `${volunteer.personalInfo.firstName} ${volunteer.personalInfo.lastName}`.toLowerCase();
      const email = volunteer.personalInfo.email.toLowerCase();
      const phone = volunteer.personalInfo.phone.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = fullName.includes(searchLower) || 
                           email.includes(searchLower) || 
                           phone.includes(searchLower);

      const matchesStatus = !filters.status || volunteer.volunteerDetails.status === filters.status;
      const matchesSkills = !filters.skills || volunteer.volunteerDetails.skills.includes(filters.skills);

      return matchesSearch && matchesStatus && matchesSkills;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'name':
            aValue = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`;
            bValue = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`;
            break;
          case 'rating':
            aValue = a.performance.overallRating;
            bValue = b.performance.overallRating;
            break;
          case 'joinDate':
            aValue = new Date(a.volunteerDetails.joinDate);
            bValue = new Date(b.volunteerDetails.joinDate);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageVolunteers = getCurrentPageVolunteers().map(v => v.id);
      setSelectedVolunteers(currentPageVolunteers);
    } else {
      setSelectedVolunteers([]);
    }
  };

  const handleSelectVolunteer = (volunteerId: string, checked: boolean) => {
    if (checked) {
      setSelectedVolunteers(prev => [...prev, volunteerId]);
    } else {
      setSelectedVolunteers(prev => prev.filter(id => id !== volunteerId));
    }
  };

  const getCurrentPageVolunteers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVolunteers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'assigned': return <Clock className="w-3 h-3 mr-1" />;
      case 'busy': return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'inactive': return <X className="w-3 h-3 mr-1" />;
      default: return null;
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
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
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
              <a href="/admin/volunteers" className="text-white font-semibold border-b-2 border-white pb-1">
                Volunteers
              </a>
              <a href="/admin/expenses" className="text-indigo-100 hover:text-white transition-colors">
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
            <span className="text-gray-900 font-medium">Volunteer Management</span>
          </nav>
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Volunteer Management</h2>
              <p className="text-gray-600 mt-1">Manage, assign, and track volunteer performance across all events</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </button>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 border transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
                  <p className="text-gray-600 text-sm">Total Volunteers</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.activeVolunteers}</p>
                  <p className="text-gray-600 text-sm">Currently Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.availableNow}</p>
                  <p className="text-gray-600 text-sm">Available Now</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Volunteer
            </button>
            
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 border transition-colors flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </button>
            
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 border transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Bulk Actions:</span>
            <select className="text-sm border rounded px-3 py-1.5">
              <option>Select Action</option>
              <option>Assign to Event</option>
              <option>Send Email</option>
              <option>Update Status</option>
              <option>Delete Selected</option>
            </select>
            <button className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select 
              value={filters.event}
              onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>

            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="busy">Busy</option>
              <option value="inactive">Inactive</option>
            </select>

            <select 
              value={filters.skills}
              onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Skills</option>
              {skillOptions.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Advanced Filters
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select 
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
                className="text-sm border rounded px-3 py-1.5"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="joinDate-desc">Recently Added</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ event: '', status: '', skills: '', dateRange: '' });
                  setSortConfig({ key: '', direction: 'asc' });
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Table */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={selectedVolunteers.length === getCurrentPageVolunteers().length && getCurrentPageVolunteers().length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({filteredVolunteers.length})
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredVolunteers.length)} of {filteredVolunteers.length} volunteers
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    Volunteer
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills & Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Assignments
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('rating')}
                  >
                    Performance
                    {sortConfig.key === 'rating' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageVolunteers().map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedVolunteers.includes(volunteer.id)}
                        onChange={(e) => handleSelectVolunteer(volunteer.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={volunteer.personalInfo.profilePicture} 
                          alt={`${volunteer.personalInfo.firstName} ${volunteer.personalInfo.lastName}`} 
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {volunteer.personalInfo.firstName} {volunteer.personalInfo.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {volunteer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{volunteer.personalInfo.email}</div>
                      <div className="text-sm text-gray-500">{volunteer.personalInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {volunteer.volunteerDetails.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                        {volunteer.volunteerDetails.skills.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{volunteer.volunteerDetails.skills.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{volunteer.volunteerDetails.experience} experience</div>
                    </td>
                    <td className="px-6 py-4">
                      {volunteer.assignments.length > 0 ? (
                        <div>
                          <div className="text-sm text-gray-900">{volunteer.assignments[0].eventName}</div>
                          <div className="text-xs text-gray-500">{volunteer.assignments[0].taskName}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(volunteer.assignments[0].startDate).toLocaleDateString()} - {new Date(volunteer.assignments[0].endDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No assignments</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">{volunteer.performance.overallRating}</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{volunteer.performance.overallRating}/5.0</div>
                          <div className="text-xs text-gray-500">{volunteer.performance.totalReviews} reviews</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.volunteerDetails.status)}`}>
                        {getStatusIcon(volunteer.volunteerDetails.status)}
                        {volunteer.volunteerDetails.status.charAt(0).toUpperCase() + volunteer.volunteerDetails.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowDetailsModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowAssignModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors" 
                          title="Assign Task"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors" title="Remove">
                          <Trash2 className="w-4 h-4" />
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
                <option value={20}>20</option>
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

      {/* Assign Task Modal */}
      {showAssignModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Assign Task to Volunteer</h3>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <img 
                    src={selectedVolunteer.personalInfo.profilePicture} 
                    alt={`${selectedVolunteer.personalInfo.firstName} ${selectedVolunteer.personalInfo.lastName}`} 
                    className="h-12 w-12 rounded-full object-cover" 
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      {selectedVolunteer.personalInfo.firstName} {selectedVolunteer.personalInfo.lastName}
                    </h4>
                    <p className="text-gray-600 text-sm">{selectedVolunteer.personalInfo.email}</p>
                    <div className="flex space-x-2 mt-1">
                      {selectedVolunteer.volunteerDetails.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Event *</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Choose an event...</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Task *</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Choose a task...</option>
                      <option value="registration-desk">Registration Desk</option>
                      <option value="food-counter">Food Counter</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="low" className="text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-2 text-sm text-gray-700">Low</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="medium" className="text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="high" className="text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-2 text-sm text-gray-700">High</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea 
                    rows={4} 
                    placeholder="Add any special instructions or requirements for this assignment..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Notification Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Send email notification to volunteer</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-2 text-sm text-gray-700">Send SMS notification</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-2 text-sm text-gray-700">Add to volunteer's calendar</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Details Modal */}
      {showDetailsModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Volunteer Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <img 
                        src={selectedVolunteer.personalInfo.profilePicture} 
                        alt={`${selectedVolunteer.personalInfo.firstName} ${selectedVolunteer.personalInfo.lastName}`} 
                        className="h-24 w-24 rounded-full object-cover mx-auto mb-4" 
                      />
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedVolunteer.personalInfo.firstName} {selectedVolunteer.personalInfo.lastName}
                      </h4>
                      <p className="text-gray-600">ID: {selectedVolunteer.id}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVolunteer.volunteerDetails.status)}`}>
                          {getStatusIcon(selectedVolunteer.volunteerDetails.status)}
                          {selectedVolunteer.volunteerDetails.status.charAt(0).toUpperCase() + selectedVolunteer.volunteerDetails.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900">{selectedVolunteer.personalInfo.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{selectedVolunteer.personalInfo.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Joined Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedVolunteer.volunteerDetails.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Events</label>
                        <p className="text-sm text-gray-900">{selectedVolunteer.performance.totalEvents} events</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Rating</label>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{selectedVolunteer.performance.overallRating}/5.0</span>
                          <div className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(selectedVolunteer.performance.overallRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">Skills & Experience</h5>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedVolunteer.volunteerDetails.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {selectedVolunteer.volunteerDetails.experience} of volunteer experience in event management.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">Current Assignments</h5>
                      {selectedVolunteer.assignments.length > 0 ? (
                        <div className="space-y-3">
                          {selectedVolunteer.assignments.map((assignment, index) => (
                            <div key={index} className="bg-white border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">{assignment.eventName}</h6>
                                  <p className="text-sm text-gray-600">{assignment.taskName}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  assignment.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {assignment.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()} | {assignment.startTime} - {assignment.endTime}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No current assignments</p>
                      )}
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">Performance History</h5>
                      <div className="space-y-3">
                        {selectedVolunteer.performance.reviews.map((review, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h6 className="font-medium text-gray-900">Event Review</h6>
                                <p className="text-sm text-gray-600">by {review.reviewerName}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900 mr-1">{review.rating}</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">"{review.comment}"</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowAssignModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Assign New Task
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;