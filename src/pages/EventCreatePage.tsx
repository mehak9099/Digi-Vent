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
  Image, 
  FileText, 
  Save, 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  AlertTriangle,
  Eye,
  Globe,
  Lock,
  Settings,
  Upload,
  Camera,
  Link,
  Target,
  Award,
  Zap,
  Heart,
  Star,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  capacity: number;
  category: string;
  tags: string[];
  isPublic: boolean;
  price: number;
  coverImageUrl: string;
  requirements: string[];
  targetAudience: string[];
  learningObjectives: string[];
  amenities: string[];
  budgetTotal: number;
}

const EventCreatePage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();
  const { createEvent, updateEvent, events } = useEvents();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    capacity: 50,
    category: '',
    tags: [],
    isPublic: false,
    price: 0,
    coverImageUrl: '',
    requirements: [],
    targetAudience: [],
    learningObjectives: [],
    amenities: [],
    budgetTotal: 0
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const isEditing = !!eventId;
  const isDuplicating = window.location.pathname.includes('/duplicate/');

  const categories = [
    'Technology',
    'Community Service',
    'Education',
    'Arts & Culture',
    'Business',
    'Health & Wellness',
    'Sports',
    'Entertainment',
    'Environment',
    'Fundraising'
  ];

  const suggestedTags = [
    'networking', 'workshop', 'conference', 'charity', 'fundraising',
    'community', 'education', 'training', 'social', 'outdoor',
    'indoor', 'family-friendly', 'professional', 'beginner-friendly'
  ];

  const suggestedAmenities = [
    'WiFi', 'Parking', 'Refreshments', 'Restrooms', 'Accessibility',
    'Air Conditioning', 'Sound System', 'Projector', 'Catering',
    'Security', 'First Aid', 'Photography', 'Live Streaming'
  ];

  useEffect(() => {
    if (isEditing && eventId && events.length > 0) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        
        setFormData({
          title: isDuplicating ? `Copy of ${event.title}` : event.title,
          description: event.description || '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().slice(0, 5),
          locationName: event.location_name,
          locationAddress: event.location_address,
          capacity: event.capacity,
          category: event.category,
          tags: event.tags || [],
          isPublic: event.is_public,
          price: event.price || 0,
          coverImageUrl: event.cover_image_url || '',
          requirements: event.requirements || [],
          targetAudience: event.target_audience || [],
          learningObjectives: event.learning_objectives || [],
          amenities: event.amenities || [],
          budgetTotal: event.budget_total || 0
        });
      }
    }
  }, [isEditing, eventId, events, isDuplicating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addToArray = (arrayName: string, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...(prev[arrayName as keyof EventFormData] as string[]), value.trim()]
      }));
      setValue('');
    }
  };

  const removeFromArray = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof EventFormData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.locationName.trim()) newErrors.locationName = 'Location name is required';
    if (!formData.locationAddress.trim()) newErrors.locationAddress = 'Location address is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';

    // Validate dates
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    if (startDateTime >= endDateTime) {
      newErrors.endDate = 'End date/time must be after start date/time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const eventData = {
        title: formData.title,
        description: formData.description,
        start_date: startDateTime,
        end_date: endDateTime,
        location_name: formData.locationName,
        location_address: formData.locationAddress,
        capacity: formData.capacity,
        category: formData.category,
        tags: formData.tags,
        is_public: formData.isPublic,
        price: formData.price,
        cover_image_url: formData.coverImageUrl || null,
        requirements: formData.requirements,
        target_audience: formData.targetAudience,
        learning_objectives: formData.learningObjectives,
        amenities: formData.amenities,
        budget_total: formData.budgetTotal,
        organizer_id: user?.id || '',
        status: 'draft' as const
      };

      let result;
      if (isEditing && !isDuplicating) {
        result = await updateEvent(eventId!, eventData);
      } else {
        result = await createEvent(eventData);
      }

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        alert(result.error || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('An error occurred while saving the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Save as Draft
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isDuplicating ? 'Duplicate Event' : isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-gray-600">
              {isDuplicating ? 'Create a copy of an existing event' : isEditing ? 'Update event details' : 'Fill in the details to create your event'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>

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
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                  }`}
                  placeholder="Describe your event..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
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
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Date & Time
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date & Time */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Start</h3>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                        errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                        errors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.startTime && (
                      <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
                    )}
                  </div>
                </div>

                {/* End Date & Time */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">End</h3>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                        errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                        errors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                    {errors.endTime && (
                      <p className="mt-2 text-sm text-red-600">{errors.endTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    id="locationName"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.locationName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="Convention Center, Park, etc."
                  />
                  {errors.locationName && (
                    <p className="mt-2 text-sm text-red-600">{errors.locationName}</p>
                  )}
                </div>

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
                      errors.capacity ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="50"
                  />
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-600">{errors.capacity}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                    errors.locationAddress ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                  }`}
                  placeholder="123 Main St, City, State, ZIP"
                />
                {errors.locationAddress && (
                  <p className="mt-2 text-sm text-red-600">{errors.locationAddress}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Tags & Visibility
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeFromArray('tags', index)}
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
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('tags', newTag, setNewTag);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addToArray('tags', newTag, setNewTag)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addToArray('tags', tag, () => {})}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Make this event public
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Public events appear in the event discovery page
                  </p>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (PKR)
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
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-xl font-semibold text-gray-900">Advanced Options</h2>
                {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showAdvanced && (
                <div className="space-y-6 pl-4 border-l-2 border-indigo-200">
                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <div className="space-y-2">
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{req}</span>
                          <button
                            type="button"
                            onClick={() => removeFromArray('requirements', index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="Add requirement"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => addToArray('requirements', newRequirement, setNewRequirement)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budgetTotal" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget (PKR)
                    </label>
                    <input
                      type="number"
                      id="budgetTotal"
                      name="budgetTotal"
                      value={formData.budgetTotal}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300 focus:outline-none"
                      placeholder="50000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => alert('Draft saved!')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isDuplicating ? 'Duplicating...' : isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {isDuplicating ? 'Duplicate Event' : isEditing ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage;