import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Tag, 
  Image as ImageIcon,
  FileText,
  Save,
  Eye,
  ArrowLeft,
  Plus,
  X,
  Check,
  AlertCircle,
  Upload,
  Globe,
  Lock,
  Settings,
  Bell,
  LogOut,
  RefreshCw,
  Copy,
  Trash2,
  Edit3
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_name: string;
  location_address: string;
  capacity: number;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  is_public: boolean;
  price: number;
  cover_image_url: string;
  requirements: string[];
  target_audience: string[];
  learning_objectives: string[];
  amenities: string[];
  budget_total: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const EventCreatePage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user, profile, logout } = useAuth();
  const { events, createEvent, updateEvent } = useEvents();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState('basic');
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const isEditing = !!eventId;
  const isDuplicating = window.location.pathname.includes('/duplicate/');

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location_name: '',
    location_address: '',
    capacity: 50,
    category: '',
    tags: [],
    status: 'draft',
    is_public: false,
    price: 0,
    cover_image_url: '',
    requirements: [],
    target_audience: [],
    learning_objectives: [],
    amenities: [],
    budget_total: 0
  });

  const categories = [
    'Technology', 'Community Service', 'Education', 'Arts & Culture', 
    'Business', 'Health & Wellness', 'Sports', 'Entertainment', 'Other'
  ];

  const commonTags = [
    'networking', 'workshop', 'conference', 'community', 'volunteer',
    'fundraising', 'educational', 'family-friendly', 'outdoor', 'indoor'
  ];

  const commonRequirements = [
    'No experience required', 'Basic computer skills', 'Physical fitness required',
    'Age 18+', 'Background check required', 'Own transportation'
  ];

  const commonAudiences = [
    'Students', 'Professionals', 'Families', 'Seniors', 'Youth', 'General Public'
  ];

  const commonObjectives = [
    'Learn new skills', 'Network with peers', 'Give back to community',
    'Gain experience', 'Have fun', 'Make a difference'
  ];

  const commonAmenities = [
    'WiFi', 'Parking', 'Refreshments', 'Restrooms', 'Accessibility', 'Air Conditioning'
  ];

  useEffect(() => {
    if (isEditing && eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setFormData({
          title: isDuplicating ? `${event.title} (Copy)` : event.title,
          description: event.description || '',
          start_date: event.start_date.split('T')[0],
          end_date: event.end_date.split('T')[0],
          location_name: event.location_name,
          location_address: event.location_address,
          capacity: event.capacity,
          category: event.category,
          tags: event.tags || [],
          status: isDuplicating ? 'draft' : event.status,
          is_public: isDuplicating ? false : event.is_public,
          price: event.price || 0,
          cover_image_url: event.cover_image_url || '',
          requirements: event.requirements || [],
          target_audience: event.target_audience || [],
          learning_objectives: event.learning_objectives || [],
          amenities: event.amenities || [],
          budget_total: event.budget_total || 0
        });
      }
    }
  }, [eventId, events, isEditing, isDuplicating]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.description) {
        setIsDraft(true);
        setTimeout(() => setIsDraft(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

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

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (!formData.location_name.trim()) {
      newErrors.location_name = 'Location name is required';
    }

    if (!formData.location_address.trim()) {
      newErrors.location_address = 'Location address is required';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               (name === 'capacity' || name === 'price' || name === 'budget_total') ? 
               parseFloat(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayAdd = (field: keyof EventFormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: keyof EventFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        status: publishNow ? 'published' as const : formData.status,
        start_date: `${formData.start_date}T09:00:00Z`,
        end_date: `${formData.end_date}T17:00:00Z`
      };

      let result;
      if (isEditing && !isDuplicating) {
        result = await updateEvent(eventId!, eventData);
      } else {
        result = await createEvent(eventData);
      }

      if (result.success) {
        const action = isDuplicating ? 'duplicated' : isEditing ? 'updated' : 'created';
        alert(`Event ${action} successfully!`);
        navigate('/admin/dashboard');
      } else {
        alert(result.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} event`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    handleSubmit(e, false);
  };

  const handlePublish = (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  const handlePreview = () => {
    alert('Preview functionality would open a modal or new tab showing how the event will look to users');
  };

  const handleBackToDashboard = () => {
    if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
      navigate('/admin/dashboard');
    }
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const pageTitle = isDuplicating ? 'Duplicate Event' : isEditing ? 'Edit Event' : 'Create New Event';

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
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">{pageTitle}</span>
              </div>
              {isDraft && (
                <div className="flex items-center text-sm text-gray-500">
                  <Save className="w-4 h-4 mr-1" />
                  Draft saved
                </div>
              )}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form className="space-y-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'basic'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'details'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                    errors.title 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-indigo-500'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Event Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none resize-none ${
                    errors.description 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-indigo-500'
                  }`}
                  placeholder="Describe your event..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.start_date 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                  />
                  {errors.start_date && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.end_date 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                  />
                  {errors.end_date && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    id="location_name"
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.location_name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="e.g., Convention Center"
                  />
                  {errors.location_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location_name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="location_address"
                    name="location_address"
                    value={formData.location_address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.location_address 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="Full address"
                  />
                  {errors.location_address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location_address}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacity & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.capacity 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="Maximum attendees"
                  />
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.capacity}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.category 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('tags', index)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('tags', newTag);
                        setNewTag('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleArrayAdd('tags', newTag);
                      setNewTag('');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {commonTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleArrayAdd('tags', tag)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <div className="space-y-2 mb-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{req}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('requirements', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a requirement"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('requirements', newRequirement);
                        setNewRequirement('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleArrayAdd('requirements', newRequirement);
                      setNewRequirement('');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {commonRequirements.filter(req => !formData.requirements.includes(req)).map(req => (
                    <button
                      key={req}
                      type="button"
                      onClick={() => handleArrayAdd('requirements', req)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      + {req}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.target_audience.map((audience, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {audience}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('target_audience', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add target audience"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('target_audience', newAudience);
                        setNewAudience('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleArrayAdd('target_audience', newAudience);
                      setNewAudience('');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {commonAudiences.filter(aud => !formData.target_audience.includes(aud)).map(aud => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => handleArrayAdd('target_audience', aud)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      + {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <div className="space-y-2 mb-3">
                  {formData.learning_objectives.map((obj, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{obj}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('learning_objectives', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add learning objective"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('learning_objectives', newObjective);
                        setNewObjective('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleArrayAdd('learning_objectives', newObjective);
                      setNewObjective('');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {commonObjectives.filter(obj => !formData.learning_objectives.includes(obj)).map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => handleArrayAdd('learning_objectives', obj)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      + {obj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.amenities.map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('amenities', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add amenity"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('amenities', newAmenity);
                        setNewAmenity('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleArrayAdd('amenities', newAmenity);
                      setNewAmenity('');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {commonAmenities.filter(amenity => !formData.amenities.includes(amenity)).map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleArrayAdd('amenities', amenity)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      + {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Event Settings</h2>

              {/* Visibility & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_public"
                        checked={formData.is_public}
                        onChange={() => setFormData(prev => ({ ...prev, is_public: true }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-900 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-green-600" />
                        Public - Anyone can see and register
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_public"
                        checked={!formData.is_public}
                        onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-900 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-600" />
                        Private - Invitation only
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300 focus:outline-none"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Set to 0 for free events
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget_total" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget (Rs.)
                </label>
                <input
                  type="number"
                  id="budget_total"
                  name="budget_total"
                  value={formData.budget_total}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300 focus:outline-none"
                  placeholder="0.00"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Total budget allocated for this event
                </p>
              </div>

              {/* Cover Image */}
              <div>
                <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="cover_image_url"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL of the event cover image (optional)
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Draft events are not visible to the public
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => alert('Copy link functionality would be implemented here')}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isDuplicating ? 'Duplicating...' : isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {isDuplicating ? 'Duplicate Event' : isEditing ? 'Update Event' : 'Publish Event'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
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

export default EventCreatePage;