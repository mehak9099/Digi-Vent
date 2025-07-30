import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Share2, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Check,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  MessageCircle,
  Copy,
  Plus,
  Heart,
  Eye,
  Award,
  Target,
  BookOpen,
  Wifi,
  Car,
  Accessibility,
  Coffee,
  Camera,
  Video,
  FileText,
  Navigation,
  Thermometer,
  Cloud,
  Sun,
  CloudRain,
  X,
  Send,
  User,
  Building,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  PlayCircle,
  Image as ImageIcon,
  Zap,
  Shield,
  Headphones,
  Loader2
} from 'lucide-react';

interface InterestFormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  motivation: string;
  dietaryRestrictions: string;
  accessibilityNeeds: string;
}

const EventPublicView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, loading, error, registerForEvent } = useEvents();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [interestForm, setInterestForm] = useState<InterestFormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    motivation: '',
    dietaryRestrictions: '',
    accessibilityNeeds: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const foundEvent = events.find(e => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [eventId, events]);

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!eventId) {
        throw new Error('Event ID not found');
      }

      const result = await registerForEvent(eventId, {
        motivation: interestForm.motivation,
        dietaryRestrictions: interestForm.dietaryRestrictions,
        accessibilityNeeds: interestForm.accessibilityNeeds,
      });

      if (result.success) {
        setShowInterestModal(false);
        alert('Thank you for your interest! We\'ll contact you with more details.');
        setInterestForm({
          fullName: '',
          email: '',
          phone: '',
          organization: '',
          motivation: '',
          dietaryRestrictions: '',
          accessibilityNeeds: ''
        });
      } else {
        alert(result.error || 'Failed to register interest. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (platform: string) => {
    const eventUrl = window.location.href;
    const eventTitle = event?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(eventUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${eventTitle} - ${eventUrl}`)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(eventUrl);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareModal(false);
  };

  const addToCalendar = () => {
    if (!event) return;
    
    const startDate = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location_address}
END:VEVENT
END:VCALENDAR`;

    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = `${event.title}.ics`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'ongoing': return 'bg-red-500 animate-pulse';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Browse Other Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => navigate('/')} className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  Home
                </button>
                <button onClick={() => navigate('/events')} className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  Browse Events
                </button>
                <button className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  About
                </button>
                <button className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  Contact
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                  <span className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || user.email}</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.cover_image_url || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 text-white text-sm rounded-full ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
              {event.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center text-white text-lg space-x-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(event.start_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{new Date(event.start_date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location_name}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{event.registered_count}/{event.capacity} registered</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold">{new Date(event.start_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.start_date).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(event.end_date).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{event.location_name}</p>
                <p className="text-sm text-gray-600">Capacity: {event.capacity}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{event.category}</p>
                <p className="text-sm text-gray-600">{event.tags.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Availability</p>
                <p className="font-semibold">{event.capacity - event.registered_count} slots left</p>
                <p className="text-sm text-gray-600">{Math.round((event.registered_count / event.capacity) * 100)}% filled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description}
                </p>
                
                {event.learning_objectives && event.learning_objectives.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                    <ul className="space-y-2 text-gray-700 mb-6">
                      {event.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {event.target_audience && event.target_audience.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Who Should Attend</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {event.target_audience.map((audience, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {event.requirements && event.requirements.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2 text-gray-700">
                      {event.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Location & Directions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Location & Directions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Venue Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{event.location_name}</p>
                        <p className="text-gray-600">{event.location_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-600">Parking available on-site</span>
                    </div>
                    <div className="flex items-center">
                      <Accessibility className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-600">Wheelchair accessible</span>
                    </div>
                  </div>

                  {event.amenities && event.amenities.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {event.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive map would be here</p>
                      <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organizer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Organizer</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={event.organizer?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'} 
                  alt={event.organizer?.full_name || 'Organizer'}
                  className="w-16 h-16 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{event.organizer?.full_name || 'Event Organizer'}</h4>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <a href={`mailto:${event.organizer?.email}`} className="text-indigo-600 hover:text-indigo-700 text-sm">
                    {event.organizer?.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => user ? setShowInterestModal(true) : navigate('/login')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {user ? 'Register Interest' : 'Login to Register'}
                </button>
                <button
                  onClick={addToCalendar}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Calendar
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Event
                </button>
                <button
                  onClick={() => navigate('/feedback')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Give Feedback
                </button>
              </div>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Registered</span>
                  <span className="font-semibold text-gray-900">{event.registered_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-semibold text-gray-900">{event.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{event.capacity - event.registered_count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {Math.round((event.registered_count / event.capacity) * 100)}% filled
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Registration Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Register Your Interest</h2>
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">We'll contact you with more details about this event.</p>
            </div>
            <form onSubmit={handleInterestSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you interested in this event?
                </label>
                <textarea
                  value={interestForm.motivation}
                  onChange={(e) => setInterestForm(prev => ({ ...prev, motivation: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Tell us what interests you about this event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={interestForm.dietaryRestrictions}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Any dietary requirements"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessibility Needs
                  </label>
                  <input
                    type="text"
                    value={interestForm.accessibilityNeeds}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, accessibilityNeeds: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Any accessibility requirements"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  By submitting, you agree to our privacy policy.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Interest
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Share Event</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                <span>Share on Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Copy className="w-5 h-5 text-gray-600 mr-3" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join {event.registered_count}+ professionals already registered for this amazing event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => user ? setShowInterestModal(true) : navigate('/login')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {user ? 'Register Your Interest' : 'Login to Register'}
            </button>
            <button
              onClick={addToCalendar}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
            >
              Add to Calendar
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-4">
            Free registration • No commitment required
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventPublicView;