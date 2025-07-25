import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  Image, 
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Upload,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Globe,
  Lock,
  Send,
  FileText,
  Camera,
  Settings,
  HelpCircle,
  Zap,
  Shield
} from 'lucide-react';

interface EventFormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  category: string;
  tags: string[];
  audience: string[];
  attendanceGoal: number;
  impactGoal: string;
  
  // Step 2: Scheduling
  startDate: string;
  endDate: string;
  timezone: string;
  isRecurring: boolean;
  recurrencePattern: string;
  
  // Step 3: Location
  venue: string;
  address: string;
  capacity: number;
  accessibility: string[];
  amenities: string[];
  
  // Step 4: Team
  volunteerRoles: Array<{
    title: string;
    description: string;
    skills: string[];
    quantity: number;
    schedule: string;
  }>;
  
  // Step 5: Media
  banner: File | null;
  gallery: File[];
  documents: File[];
  equipment: string[];
  
  // Step 6: Publishing
  visibility: 'draft' | 'private' | 'public';
  notifications: string[];
  publishAt: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const EventCreatePage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    category: '',
    tags: [],
    audience: [],
    attendanceGoal: 50,
    impactGoal: '',
    startDate: '',
    endDate: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isRecurring: false,
    recurrencePattern: 'none',
    venue: '',
    address: '',
    capacity: 100,
    accessibility: [],
    amenities: [],
    volunteerRoles: [],
    banner: null,
    gallery: [],
    documents: [],
    equipment: [],
    visibility: 'draft',
    notifications: [],
    publishAt: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const totalSteps = 6;
  const completionPercentage = (currentStep / totalSteps) * 100;
  const isEditMode = !!eventId;
  const pageTitle = isEditMode ? 'Edit Event' : 'Create New Event';

  const stepConfig = {
    1: {
      id: 'basic-info',
      title: 'Event Essentials',
      subtitle: 'Tell us about your event',
      icon: FileText,
      fields: ['name', 'description', 'category', 'tags'],
      estimatedTime: '2 min',
      completion: 16
    },
    2: {
      id: 'scheduling',
      title: 'Date & Time',
      subtitle: 'When will your event happen?',
      icon: Calendar,
      fields: ['startDate', 'endDate', 'timezone'],
      estimatedTime: '2 min',
      completion: 33
    },
    3: {
      id: 'location',
      title: 'Venue & Location',
      subtitle: 'Where will your event take place?',
      icon: MapPin,
      fields: ['venue', 'address', 'capacity'],
      estimatedTime: '3 min',
      completion: 50
    },
    4: {
      id: 'team-building',
      title: 'Volunteer Team',
      subtitle: 'Who do you need to make this happen?',
      icon: Users,
      fields: ['volunteerRoles'],
      estimatedTime: '4 min',
      completion: 66
    },
    5: {
      id: 'media-resources',
      title: 'Media & Resources',
      subtitle: 'Make your event shine',
      icon: Image,
      fields: ['banner', 'gallery'],
      estimatedTime: '3 min',
      completion: 83
    },
    6: {
      id: 'review-publish',
      title: 'Review & Publish',
      subtitle: 'Final check before going live',
      icon: CheckCircle,
      fields: ['visibility', 'notifications'],
      estimatedTime: '2 min',
      completion: 100
    }
  };

  const eventCategories = [
    { value: 'community', label: 'Community Service', icon: '🤝' },
    { value: 'education', label: 'Educational', icon: '📚' },
    { value: 'environment', label: 'Environmental', icon: '🌱' },
    { value: 'health', label: 'Health & Wellness', icon: '🏥' },
    { value: 'arts', label: 'Arts & Culture', icon: '🎨' },
    { value: 'sports', label: 'Sports & Recreation', icon: '⚽' },
    { value: 'fundraising', label: 'Fundraising', icon: '💰' },
    { value: 'disaster', label: 'Disaster Relief', icon: '🚨' }
  ];

  const popularTags = [
    'volunteer', 'community', 'charity', 'fundraising', 'education',
    'environment', 'health', 'youth', 'seniors', 'families',
    'outdoor', 'indoor', 'weekend', 'evening', 'beginner-friendly'
  ];

  const accessibilityOptions = [
    'Wheelchair accessible',
    'Public transportation',
    'Parking available',
    'Accessible restrooms',
    'Sign language interpreter',
    'Audio assistance',
    'Large print materials',
    'Service animals welcome'
  ];

  const amenityOptions = [
    'WiFi', 'Projector/Screen', 'Sound system', 'Microphones',
    'Tables and chairs', 'Kitchen facilities', 'Storage space',
    'First aid kit', 'Security', 'Air conditioning', 'Heating'
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (formData.name || formData.description) {
        handleSaveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [formData]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value) {
          newErrors.name = 'Event name is required';
        } else if (value.length < 3) {
          newErrors.name = 'Event name must be at least 3 characters';
        } else if (value.length > 100) {
          newErrors.name = 'Event name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'description':
        if (value && value.length > 2000) {
          newErrors.description = 'Description must be less than 2000 characters';
        } else {
          delete newErrors.description;
        }
        break;

      case 'startDate':
        if (!value) {
          newErrors.startDate = 'Start date is required';
        } else if (new Date(value) < new Date()) {
          newErrors.startDate = 'Start date must be in the future';
        } else {
          delete newErrors.startDate;
        }
        break;

      case 'endDate':
        if (!value) {
          newErrors.endDate = 'End date is required';
        } else if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          newErrors.endDate = 'End date must be after start date';
        } else {
          delete newErrors.endDate;
        }
        break;

      case 'venue':
        if (!value) {
          newErrors.venue = 'Venue is required';
        } else {
          delete newErrors.venue;
        }
        break;

      case 'capacity':
        if (!value || value < 1) {
          newErrors.capacity = 'Capacity must be at least 1';
        } else if (value > 10000) {
          newErrors.capacity = 'Capacity cannot exceed 10,000';
        } else {
          delete newErrors.capacity;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (type !== 'checkbox') {
      validateField(name, value);
    }
  };

  const handleArrayChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...(prev[name as keyof EventFormData] as string[]), value]
        : (prev[name as keyof EventFormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addVolunteerRole = () => {
    setFormData(prev => ({
      ...prev,
      volunteerRoles: [...prev.volunteerRoles, {
        title: '',
        description: '',
        skills: [],
        quantity: 1,
        schedule: 'flexible'
      }]
    }));
  };

  const updateVolunteerRole = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      volunteerRoles: prev.volunteerRoles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };

  const removeVolunteerRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volunteerRoles: prev.volunteerRoles.filter((_, i) => i !== index)
    }));
  };

  const isStepValid = () => {
    const currentFields = stepConfig[currentStep as keyof typeof stepConfig].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof EventFormData];
      if (field === 'name' || field === 'startDate' || field === 'endDate' || field === 'venue') {
        return value && !errors[field];
      }
      return true;
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to event list or event detail page
      navigate('/admin/events');
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.name 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="e.g., Community Food Drive 2024"
                  maxLength={100}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                  {formData.name.length}/100
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none resize-none"
                placeholder="Describe your event's purpose, activities, and impact..."
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">Help volunteers understand what they'll be doing</p>
                <span className="text-sm text-gray-400">{formData.description.length}/2000</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {eventCategories.map((category) => (
                  <label
                    key={category.value}
                    className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium text-center">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags (up to 10)
              </label>
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {popularTags.filter(tag => !formData.tags.includes(tag)).slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagAdd(tag)}
                      disabled={formData.tags.length >= 10}
                      className="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="attendanceGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Attendance
                </label>
                <input
                  type="number"
                  id="attendanceGoal"
                  name="attendanceGoal"
                  value={formData.attendanceGoal}
                  onChange={handleInputChange}
                  min="1"
                  max="10000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="impactGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Impact Goal
                </label>
                <input
                  type="text"
                  id="impactGoal"
                  name="impactGoal"
                  value={formData.impactGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none"
                  placeholder="e.g., Feed 200 families, Clean 5 parks"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.startDate 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.endDate 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Recurring Event */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">This is a recurring event</span>
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 mb-2">
                  Recurrence Pattern
                </label>
                <select
                  id="recurrencePattern"
                  name="recurrencePattern"
                  value={formData.recurrencePattern}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            )}

            {/* Scheduling Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Scheduling Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Weekend events typically have higher volunteer attendance</li>
                    <li>• Consider local holidays and major events in your area</li>
                    <li>• Allow 2-3 hours for most volunteer activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.venue 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="e.g., Community Center, Central Park"
              />
              {errors.venue && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.venue}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none resize-none"
                placeholder="Full address including city, state, and zip code"
              />
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Venue Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="10000"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.capacity 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Maximum number of people"
              />
              {errors.capacity && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.capacity}
                </p>
              )}
            </div>

            {/* Accessibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Accessibility Features
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {accessibilityOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.accessibility.includes(option)}
                      onChange={(e) => handleArrayChange('accessibility', option, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => handleArrayChange('amenities', amenity, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Volunteer Roles */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Volunteer Roles</h3>
                <button
                  type="button"
                  onClick={addVolunteerRole}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </button>
              </div>

              {formData.volunteerRoles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No volunteer roles yet</h4>
                  <p className="text-gray-600 mb-4">Add roles to define what help you need for your event</p>
                  <button
                    type="button"
                    onClick={addVolunteerRole}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Role
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.volunteerRoles.map((role, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Role #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVolunteerRole(index)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role Title
                          </label>
                          <input
                            type="text"
                            value={role.title}
                            onChange={(e) => updateVolunteerRole(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Registration Assistant"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number Needed
                          </label>
                          <input
                            type="number"
                            value={role.quantity}
                            onChange={(e) => updateVolunteerRole(index, 'quantity', parseInt(e.target.value))}
                            min="1"
                            max="50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={role.description}
                          onChange={(e) => updateVolunteerRole(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Describe the responsibilities and tasks for this role"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Building Tips */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start">
                <Target className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-900 mb-1">Team Building Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Define clear, specific roles to help volunteers understand expectations</li>
                    <li>• Consider skill levels - some roles may be better for experienced volunteers</li>
                    <li>• Plan for 10-15% more volunteers than you think you need</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Banner
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Event Banner</h4>
                <p className="text-gray-600 mb-4">Recommended size: 1200x600px, Max size: 5MB</p>
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </button>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photo Gallery (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Add Photos</h4>
                <p className="text-gray-600 mb-4">Upload multiple photos to showcase your event</p>
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photos
                </button>
              </div>
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Documents & Resources
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Volunteer waiver form</span>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Upload
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Safety guidelines</span>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Equipment & Supplies Needed
              </label>
              <textarea
                name="equipment"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none resize-none"
                placeholder="List any equipment, supplies, or materials needed for the event..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            {/* Event Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Preview</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.name || 'Event Name'}</h4>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Date TBD'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {formData.venue || 'Venue TBD'}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {formData.volunteerRoles.reduce((sum, role) => sum + role.quantity, 0)} volunteers needed
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    formData.visibility === 'public' ? 'bg-green-100 text-green-800' :
                    formData.visibility === 'private' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1)}
                  </span>
                </div>
                
                {formData.description && (
                  <p className="text-gray-700 mb-4">{formData.description}</p>
                )}
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Validation Checklist */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pre-publish Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${formData.name ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${formData.name ? 'text-gray-900' : 'text-gray-500'}`}>
                    Event name provided
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${formData.startDate && formData.endDate ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${formData.startDate && formData.endDate ? 'text-gray-900' : 'text-gray-500'}`}>
                    Date and time scheduled
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${formData.venue ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${formData.venue ? 'text-gray-900' : 'text-gray-500'}`}>
                    Venue confirmed
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${formData.volunteerRoles.length > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${formData.volunteerRoles.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Volunteer roles defined
                  </span>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="draft"
                        checked={formData.visibility === 'draft'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Save as Draft</span>
                        </div>
                        <p className="text-sm text-gray-600">Keep working on this event later</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={formData.visibility === 'private'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Private Event</span>
                        </div>
                        <p className="text-sm text-gray-600">Invite-only, not visible in public listings</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={formData.visibility === 'public'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Public Event</span>
                        </div>
                        <p className="text-sm text-gray-600">Visible to everyone, appears in public listings</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.notifications.includes('volunteers')}
                        onChange={(e) => handleArrayChange('notifications', 'volunteers', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Notify eligible volunteers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.notifications.includes('social')}
                        onChange={(e) => handleArrayChange('notifications', 'social', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Share on social media</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.notifications.includes('email')}
                        onChange={(e) => handleArrayChange('notifications', 'email', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Send email announcement</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/admin/events')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Events</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{pageTitle}</span>
            </div>
          </div>
          
          {/* Progress & Actions */}
          <div className="flex items-center space-x-4">
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            
            {/* Progress on desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue-600">{Math.round(completionPercentage)}%</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </button>
              
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Creation Steps</h3>
              <nav className="space-y-2">
                {Object.entries(stepConfig).map(([stepNum, config]) => {
                  const stepNumber = parseInt(stepNum);
                  const StepIcon = config.icon;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  
                  return (
                    <button
                      key={stepNumber}
                      onClick={() => goToStep(stepNumber)}
                      className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-200 ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{config.title}</div>
                        <div className="text-xs opacity-75">{config.estimatedTime}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Mobile Progress */}
              <div className="md:hidden mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Step Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {stepConfig[currentStep as keyof typeof stepConfig].title}
                </h1>
                <p className="text-lg text-gray-600">
                  {stepConfig[currentStep as keyof typeof stepConfig].subtitle}
                </p>
              </div>

              {/* Form Content */}
              <div className="mb-8">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back
                </button>

                <div className="flex items-center space-x-3">
                  {currentStep < totalSteps && (
                    <button
                      type="button"
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                    >
                      Skip for now
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isStepValid()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !isStepValid()}
                      className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isStepValid() && !isSubmitting
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {formData.visibility === 'draft' ? 'Saving...' : 'Publishing...'}
                        </>
                      ) : (
                        <>
                          {formData.visibility === 'draft' ? (
                            <>
                              <Save className="w-5 h-5 mr-2" />
                              Save Event
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Publish Event
                            </>
                          )}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                <Shield className="w-4 h-4 mr-1" />
                <span>Your event data is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Suggestions for Step {currentStep}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Consider adding more descriptive details</li>
                <li>• Check for optimal timing based on your audience</li>
                <li>• Ensure accessibility requirements are met</li>
              </ul>
            </div>
            <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              Get AI Suggestions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;