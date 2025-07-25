import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  Star,
  Award,
  Heart,
  MapPin,
  Clock,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface FormData {
  // Step 1: Basic Info
  fullName: string;
  email: string;
  agreeToTerms: boolean;
  
  // Step 2: Security
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  backupEmail: string;
  
  // Step 3: Personal Profile
  dateOfBirth: string;
  location: string;
  experience: string;
  motivation: string;
  referralSource: string;
  
  // Step 4: Availability
  availabilityDays: string[];
  timePreferences: string[];
  commitmentLevel: number;
  eventTypes: string[];
  travelRadius: number;
  
  // Step 5: Skills
  skills: string[];
  languages: string[];
  qualifications: string[];
  transportation: string;
  emergencyContact: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    agreeToTerms: false,
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    backupEmail: '',
    dateOfBirth: '',
    location: '',
    experience: '',
    motivation: '',
    referralSource: '',
    availabilityDays: [],
    timePreferences: [],
    commitmentLevel: 10,
    eventTypes: [],
    travelRadius: 25,
    skills: [],
    languages: [],
    qualifications: [],
    transportation: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const totalSteps = 5;
  const completionPercentage = (currentStep / totalSteps) * 100;

  const stepConfig = {
    1: {
      title: "Welcome to Digi-Vent",
      subtitle: "Let's get you started on your volunteer journey",
      fields: ["fullName", "email", "agreeToTerms"],
      completion: 20
    },
    2: {
      title: "Secure Your Account",
      subtitle: "Choose a strong password to protect your profile",
      fields: ["password", "confirmPassword", "phoneNumber"],
      completion: 40
    },
    3: {
      title: "Tell Us About Yourself",
      subtitle: "Help us match you with the perfect opportunities",
      fields: ["dateOfBirth", "location", "experience"],
      completion: 60
    },
    4: {
      title: "Your Availability",
      subtitle: "When are you available to make a difference?",
      fields: ["availabilityDays", "timePreferences", "commitmentLevel"],
      completion: 80
    },
    5: {
      title: "Skills & Interests",
      subtitle: "What unique talents do you bring to our community?",
      fields: ["skills", "languages", "transportation"],
      completion: 100
    }
  };

  const experienceOptions = [
    { value: 'beginner', label: 'New to Volunteering', description: 'Ready to start making a difference' },
    { value: 'some', label: 'Some Experience', description: 'Volunteered a few times before' },
    { value: 'experienced', label: 'Experienced Volunteer', description: 'Regular volunteer with multiple organizations' },
    { value: 'leader', label: 'Volunteer Leader', description: 'Led teams and organized events' }
  ];

  const eventTypeOptions = [
    { value: 'community', label: 'Community Events', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { value: 'fundraising', label: 'Fundraising', icon: Heart, color: 'bg-red-100 text-red-600' },
    { value: 'education', label: 'Educational', icon: Award, color: 'bg-green-100 text-green-600' },
    { value: 'sports', label: 'Sports & Recreation', icon: Zap, color: 'bg-orange-100 text-orange-600' },
    { value: 'environmental', label: 'Environmental', icon: MapPin, color: 'bg-emerald-100 text-emerald-600' },
    { value: 'cultural', label: 'Arts & Culture', icon: Star, color: 'bg-purple-100 text-purple-600' }
  ];

  const skillOptions = [
    'Event Planning', 'Photography', 'Social Media', 'Marketing', 'Graphic Design',
    'Public Speaking', 'Teaching', 'First Aid', 'Cooking', 'Music', 'Translation',
    'IT Support', 'Project Management', 'Fundraising', 'Customer Service'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian', 'Dutch', 'Swedish'
  ];

  const sidebarContent = {
    hero: {
      title: "Join 2,847+ Volunteers",
      subtitle: "Making real impact in our community"
    },
    stats: [
      { number: "156", label: "Events This Year", icon: Calendar },
      { number: "23,000+", label: "People Helped", icon: Users },
      { number: "4.9/5", label: "Volunteer Satisfaction", icon: Star }
    ],
    testimonials: [
      {
        quote: "Volunteering with Digi-Vent changed my perspective on community service. The platform makes it so easy to find meaningful opportunities.",
        author: "Sarah M.",
        role: "2-year volunteer",
        rating: 5
      },
      {
        quote: "I've met amazing people and learned new skills while helping my community. The event coordination tools are fantastic!",
        author: "Michael R.",
        role: "Event coordinator",
        rating: 5
      }
    ],
    benefits: [
      { icon: Award, title: "Skill Development", description: "Learn new skills while helping others" },
      { icon: Users, title: "Network", description: "Meet like-minded people in your community" },
      { icon: Heart, title: "Impact", description: "Make a real difference in people's lives" }
    ]
  };

  // Password strength calculation
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 20;
      if (/[A-Z]/.test(formData.password)) strength += 20;
      if (/[a-z]/.test(formData.password)) strength += 20;
      if (/[0-9]/.test(formData.password)) strength += 20;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 20;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!value) {
          newErrors.fullName = 'Full name is required';
        } else if (value.length < 2) {
          newErrors.fullName = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
          newErrors.fullName = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!value) {
          newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength < 60) {
          newErrors.password = 'Password must be stronger';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'phoneNumber':
        if (!value) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(value)) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        } else {
          delete newErrors.phoneNumber;
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 16) {
            newErrors.dateOfBirth = 'You must be at least 16 years old to volunteer';
          } else {
            delete newErrors.dateOfBirth;
          }
        }
        break;

      case 'location':
        if (!value) {
          newErrors.location = 'Location is required';
        } else {
          delete newErrors.location;
        }
        break;

      case 'experience':
        if (!value) {
          newErrors.experience = 'Please select your experience level';
        } else {
          delete newErrors.experience;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        ? [...(prev[name as keyof FormData] as string[]), value]
        : (prev[name as keyof FormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const isStepValid = () => {
    const currentFields = stepConfig[currentStep as keyof typeof stepConfig].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof FormData];
      if (field === 'agreeToTerms') return value === true;
      if (Array.isArray(value)) return value.length > 0;
      return value && !errors[field];
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to success page or dashboard
      navigate('/welcome');
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 80) return 'Medium';
    return 'Strong';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.fullName 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter your full name"
                autoComplete="name"
                autoFocus
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.email 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength < 40 ? 'text-red-600' :
                      passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.confirmPassword 
                      ? 'border-red-500 bg-red-50' 
                      : formData.confirmPassword && formData.confirmPassword === formData.password
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.phoneNumber 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.dateOfBirth 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                  errors.location 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="City, State/Province"
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Volunteer Experience *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {experienceOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.experience === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      checked={formData.experience === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    {formData.experience === option.value && (
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
              {errors.experience && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.experience}
                </p>
              )}
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                What motivates you to volunteer? (Optional)
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none resize-none"
                placeholder="Share what inspires you to help others..."
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.motivation.length}/500 characters
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Availability Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Days *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label
                    key={day}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.availabilityDays.includes(day)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.availabilityDays.includes(day)}
                      onChange={(e) => handleArrayChange('availabilityDays', day, e.target.checked)}
                    />
                    <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Times *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'].map((time) => (
                  <label
                    key={time}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.timePreferences.includes(time)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.timePreferences.includes(time)}
                      onChange={(e) => handleArrayChange('timePreferences', time, e.target.checked)}
                    />
                    <span className="text-sm font-medium">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Commitment Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Time Commitment: {formData.commitmentLevel} hours/month
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={formData.commitmentLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, commitmentLevel: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 hrs</span>
                <span>20 hrs</span>
                <span>40 hrs</span>
              </div>
            </div>

            {/* Event Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Event Types
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventTypeOptions.map((eventType) => (
                  <label
                    key={eventType.value}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.eventTypes.includes(eventType.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${eventType.color}`}>
                      <eventType.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{eventType.label}</div>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={formData.eventTypes.includes(eventType.value)}
                      onChange={(e) => handleArrayChange('eventTypes', eventType.value, e.target.checked)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skills & Talents
              </label>
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillAdd(skill)}
                      className="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Languages Spoken
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {languageOptions.map((language) => (
                  <label
                    key={language}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.languages.includes(language)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.languages.includes(language)}
                      onChange={(e) => handleArrayChange('languages', language, e.target.checked)}
                    />
                    <span className="text-sm font-medium">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transportation *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'own-car', label: 'Own Car' },
                  { value: 'public-transport', label: 'Public Transportation' },
                  { value: 'bike', label: 'Bicycle' },
                  { value: 'walk', label: 'Walking Only' },
                  { value: 'rideshare', label: 'Rideshare/Taxi' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="transportation"
                      value={option.value}
                      checked={formData.transportation === option.value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact (Name & Phone)
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 focus:outline-none"
                placeholder="John Doe - (555) 123-4567"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
            </div>
          </div>
          
          {/* Progress Indicator */}
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inspiration Sidebar */}
          <div className={`lg:col-span-1 ${sidebarCollapsed ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Hero Section */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarContent.hero.title}
                </h3>
                <p className="text-gray-600">{sidebarContent.hero.subtitle}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {sidebarContent.stats.map((stat, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-gray-700 italic mb-3">
                  "{sidebarContent.testimonials[0].quote}"
                </blockquote>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{sidebarContent.testimonials[0].author}</div>
                  <div className="text-gray-600">{sidebarContent.testimonials[0].role}</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {sidebarContent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3 flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{benefit.title}</div>
                      <div className="text-xs text-gray-600">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
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
              <div className="flex items-center justify-between">
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <Check className="w-5 h-5 ml-2" />
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
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;