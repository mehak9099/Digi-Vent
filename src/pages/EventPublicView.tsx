import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Headphones
} from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
    accessibility: string[];
  };
  organizer: {
    name: string;
    email: string;
    phone?: string;
    avatar: string;
    bio: string;
    organization: string;
  };
  category: string;
  tags: string[];
  capacity: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  schedule: ScheduleItem[];
  media: {
    coverImage: string;
    gallery: string[];
    videos: string[];
    resources: ResourceFile[];
  };
  requirements: string[];
  targetAudience: string[];
  learningObjectives: string[];
  amenities: string[];
  weather?: {
    temperature: number;
    condition: string;
    forecast: string;
  };
}

interface ScheduleItem {
  id: string;
  time: string;
  duration: string;
  title: string;
  description: string;
  speaker?: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  type: 'keynote' | 'workshop' | 'break' | 'networking';
}

interface ResourceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
}

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
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Mock event data - in real app, this would come from API
  useEffect(() => {
    const mockEvent: EventData = {
      id: eventId || '1',
      title: 'TechFest 2025: Innovation Summit',
      description: 'Join us for Pakistan\'s premier technology conference featuring industry leaders, innovative workshops, and networking opportunities. This immersive event brings together entrepreneurs, developers, designers, and tech enthusiasts to explore the future of technology in Pakistan and beyond.',
      startDate: '2025-07-28T09:00:00Z',
      endDate: '2025-07-28T18:00:00Z',
      location: {
        name: 'Lahore Convention Center',
        address: '123 Main Street, Gulberg III, Lahore, Punjab 54000, Pakistan',
        coordinates: [74.3587, 31.5204],
        accessibility: ['Wheelchair accessible', 'Elevator access', 'Accessible parking', 'Sign language interpreters']
      },
      organizer: {
        name: 'Dr. Sarah Ahmed',
        email: 'sarah.ahmed@techfest.pk',
        phone: '+92-300-1234567',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        bio: 'Dr. Sarah Ahmed is a renowned technology leader with over 15 years of experience in software development and innovation. She currently serves as CTO at TechCorp Pakistan.',
        organization: 'TechCorp Pakistan'
      },
      category: 'Technology',
      tags: ['Innovation', 'AI', 'Startups', 'Networking', 'Professional Development'],
      capacity: 500,
      registeredCount: 347,
      status: 'upcoming',
      schedule: [
        {
          id: '1',
          time: '09:00',
          duration: '45 mins',
          title: 'Opening Keynote: The Future of AI in Pakistan',
          description: 'Explore how artificial intelligence is transforming industries across Pakistan and the opportunities it presents for local businesses.',
          speaker: {
            name: 'Dr. Sarah Ahmed',
            title: 'CTO, TechCorp Pakistan',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            bio: 'Leading AI researcher and technology executive'
          },
          type: 'keynote'
        },
        {
          id: '2',
          time: '10:00',
          duration: '30 mins',
          title: 'Networking Break',
          description: 'Connect with fellow attendees over coffee and light refreshments.',
          type: 'break'
        },
        {
          id: '3',
          time: '10:30',
          duration: '90 mins',
          title: 'Workshop: Building Your First Mobile App',
          description: 'Hands-on workshop covering React Native development from basics to deployment.',
          speaker: {
            name: 'Ahmed Hassan',
            title: 'Senior Mobile Developer',
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            bio: 'Mobile development expert with 8+ years experience'
          },
          type: 'workshop'
        }
      ],
      media: {
        coverImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
        gallery: [
          'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
        ],
        videos: ['https://example.com/video1.mp4'],
        resources: [
          { id: '1', name: 'Event Brochure', type: 'PDF', size: '2.3 MB', downloadUrl: '#' },
          { id: '2', name: 'Speaker Presentations', type: 'ZIP', size: '15.7 MB', downloadUrl: '#' },
          { id: '3', name: 'Resource List', type: 'PDF', size: '1.1 MB', downloadUrl: '#' }
        ]
      },
      requirements: ['Basic programming knowledge', 'Laptop with development environment', 'Enthusiasm for learning'],
      targetAudience: ['Software Developers', 'Tech Entrepreneurs', 'Students', 'Technology Enthusiasts'],
      learningObjectives: [
        'Understand current AI trends and applications',
        'Learn mobile app development fundamentals',
        'Network with industry professionals',
        'Discover startup opportunities in tech sector'
      ],
      amenities: ['Free WiFi', 'Parking Available', 'Food & Beverages', 'Air Conditioning', 'Audio/Visual Equipment'],
      weather: {
        temperature: 28,
        condition: 'Sunny',
        forecast: 'Clear skies expected throughout the day'
      }
    };

    setTimeout(() => {
      setEvent(mockEvent);
      setLoading(false);
    }, 1000);
  }, [eventId]);

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 2000);
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
    
    const startDate = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location.address}
END:VEVENT
END:VCALENDAR`;

    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = `${event.title}.ics`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-500';
      case 'live': return 'bg-red-500 animate-pulse';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'keynote': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'workshop': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'break': return <Coffee className="w-5 h-5 text-green-500" />;
      case 'networking': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Home
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
                <button className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.media.coverImage})` }}
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
            {event.weather && (
              <div className="flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                {getWeatherIcon(event.weather.condition)}
                <span className="ml-2">{event.weather.temperature}°C</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center text-white text-lg space-x-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(event.startDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{new Date(event.startDate).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location.name}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{event.registeredCount}/{event.capacity} registered</span>
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
                <p className="font-semibold">{new Date(event.startDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(event.endDate).toLocaleTimeString('en-US', { 
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
                <p className="font-semibold">{event.location.name}</p>
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
                <p className="font-semibold">{event.capacity - event.registeredCount} slots left</p>
                <p className="text-sm text-gray-600">{Math.round((event.registeredCount / event.capacity) * 100)}% filled</p>
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
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                  {event.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Who Should Attend</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.targetAudience.map((audience, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {audience}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2 text-gray-700">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Event Schedule</h2>
              <div className="space-y-6">
                {event.schedule.map((item, index) => (
                  <div key={item.id} className="flex flex-col md:flex-row">
                    <div className="md:w-32 flex-shrink-0 mb-4 md:mb-0">
                      <div className="text-lg font-semibold text-indigo-600">{item.time}</div>
                      <div className="text-sm text-gray-500">{item.duration}</div>
                    </div>
                    <div className="flex-1 md:ml-8">
                      <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center mb-2">
                          {getSessionTypeIcon(item.type)}
                          <h3 className="text-xl font-semibold ml-2">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        {item.speaker && (
                          <div className="flex items-center">
                            <img 
                              src={item.speaker.avatar} 
                              alt={item.speaker.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover" 
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.speaker.name}</p>
                              <p className="text-sm text-gray-500">{item.speaker.title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Gallery */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Event Gallery</h2>
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={event.media.gallery[currentImageIndex]} 
                    alt={`Event image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : event.media.gallery.length - 1)}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex space-x-2">
                    {event.media.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentImageIndex ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < event.media.gallery.length - 1 ? prev + 1 : 0)}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Resources */}
              {event.media.resources.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Downloadable Resources</h3>
                  <div className="space-y-3">
                    {event.media.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-6 h-6 text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{resource.name}</p>
                            <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                          </div>
                        </div>
                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                        <p className="font-medium text-gray-900">{event.location.name}</p>
                        <p className="text-gray-600">{event.location.address}</p>
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

                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {event.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
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
                  src={event.organizer.avatar} 
                  alt={event.organizer.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{event.organizer.name}</h4>
                  <p className="text-sm text-gray-600">{event.organizer.organization}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{event.organizer.bio}</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <a href={`mailto:${event.organizer.email}`} className="text-indigo-600 hover:text-indigo-700 text-sm">
                    {event.organizer.email}
                  </a>
                </div>
                {event.organizer.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <a href={`tel:${event.organizer.phone}`} className="text-indigo-600 hover:text-indigo-700 text-sm">
                      {event.organizer.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Register Interest
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
                  <span className="font-semibold text-gray-900">{event.registeredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-semibold text-gray-900">{event.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{event.capacity - event.registeredCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {Math.round((event.registeredCount / event.capacity) * 100)}% filled
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={interestForm.fullName}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={interestForm.email}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={interestForm.phone}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+92-300-1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={interestForm.organization}
                    onChange={(e) => setInterestForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your company or organization"
                  />
                </div>
              </div>

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
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
            Join {event.registeredCount}+ professionals already registered for this amazing event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowInterestModal(true)}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Register Your Interest
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Digi-Vent</span>
              </div>
              <p className="text-gray-400">
                Making event management simple and efficient for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors duration-200">Home</button></li>
                <li><button className="hover:text-white transition-colors duration-200">Browse Events</button></li>
                <li><button className="hover:text-white transition-colors duration-200">About Us</button></li>
                <li><button className="hover:text-white transition-colors duration-200">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors duration-200">Help Center</button></li>
                <li><button className="hover:text-white transition-colors duration-200">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors duration-200">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors duration-200">Feedback</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Digi-Vent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventPublicView;