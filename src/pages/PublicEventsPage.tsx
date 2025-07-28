import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Eye,
  Tag,
  Zap,
  Award,
  TrendingUp,
  X,
  Check,
  ArrowRight
} from 'lucide-react';

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
  };
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  capacity: number;
  registeredCount: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const PublicEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const eventsPerPage = 9;

  // Mock data
  const mockEvents: PublicEvent[] = [
    {
      id: '1',
      title: 'TechFest 2025: Innovation Summit',
      description: 'Join us for Pakistan\'s premier technology conference featuring industry leaders, innovative workshops, and networking opportunities.',
      date: '2025-07-28',
      time: '09:00 AM - 6:00 PM',
      location: {
        name: 'Lahore Convention Center',
        address: 'Gulberg III, Lahore, Punjab'
      },
      organizer: {
        name: 'TechCorp Pakistan',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true
      },
      category: 'Technology',
      tags: ['Innovation', 'AI', 'Startups', 'Networking'],
      capacity: 500,
      registeredCount: 347,
      price: 0,
      rating: 4.8,
      reviewCount: 89,
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: true,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Community Food Drive',
      description: 'Monthly food distribution event serving local families in need. Volunteers welcome!',
      date: '2025-08-15',
      time: '8:00 AM - 2:00 PM',
      location: {
        name: 'Central Park Pavilion',
        address: 'Model Town, Lahore, Punjab'
      },
      organizer: {
        name: 'Community Helpers',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true
      },
      category: 'Community Service',
      tags: ['Charity', 'Food', 'Community', 'Volunteer'],
      capacity: 150,
      registeredCount: 89,
      price: 0,
      rating: 4.9,
      reviewCount: 34,
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: false,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Digital Marketing Workshop',
      description: 'Learn the latest digital marketing strategies and tools from industry experts.',
      date: '2025-08-20',
      time: '2:00 PM - 6:00 PM',
      location: {
        name: 'Business Hub',
        address: 'DHA Phase 5, Lahore, Punjab'
      },
      organizer: {
        name: 'Marketing Pro',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: false
      },
      category: 'Education',
      tags: ['Marketing', 'Digital', 'Workshop', 'Business'],
      capacity: 75,
      registeredCount: 45,
      price: 2500,
      rating: 4.5,
      reviewCount: 28,
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: false,
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Art & Culture Festival',
      description: 'Celebrate local art and culture with exhibitions, performances, and interactive workshops.',
      date: '2025-08-25',
      time: '10:00 AM - 8:00 PM',
      location: {
        name: 'Cultural Center',
        address: 'Mall Road, Lahore, Punjab'
      },
      organizer: {
        name: 'Arts Council',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true
      },
      category: 'Arts & Culture',
      tags: ['Art', 'Culture', 'Festival', 'Performance'],
      capacity: 300,
      registeredCount: 178,
      price: 500,
      rating: 4.7,
      reviewCount: 56,
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: true,
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Startup Pitch Competition',
      description: 'Watch innovative startups pitch their ideas to investors and industry experts.',
      date: '2025-09-05',
      time: '6:00 PM - 9:00 PM',
      location: {
        name: 'Innovation Hub',
        address: 'Johar Town, Lahore, Punjab'
      },
      organizer: {
        name: 'Startup Incubator',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true
      },
      category: 'Business',
      tags: ['Startup', 'Pitch', 'Investment', 'Innovation'],
      capacity: 200,
      registeredCount: 156,
      price: 1000,
      rating: 4.6,
      reviewCount: 42,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: false,
      status: 'upcoming'
    },
    {
      id: '6',
      title: 'Health & Wellness Fair',
      description: 'Discover health and wellness services, participate in fitness activities, and learn from experts.',
      date: '2025-09-10',
      time: '9:00 AM - 5:00 PM',
      location: {
        name: 'Sports Complex',
        address: 'Cantt, Lahore, Punjab'
      },
      organizer: {
        name: 'Health First',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true
      },
      category: 'Health & Wellness',
      tags: ['Health', 'Wellness', 'Fitness', 'Medical'],
      capacity: 400,
      registeredCount: 234,
      price: 0,
      rating: 4.4,
      reviewCount: 67,
      image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      featured: false,
      status: 'upcoming'
    }
  ];

  const categories = [
    'All Categories',
    'Technology',
    'Community Service',
    'Education',
    'Arts & Culture',
    'Business',
    'Health & Wellness',
    'Sports',
    'Entertainment'
  ];

  const locations = [
    'All Locations',
    'Lahore',
    'Karachi',
    'Islamabad',
    'Faisalabad',
    'Multan'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      const matchesLocation = selectedLocation === 'all' || 
                             event.location.address.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesPrice = priceRange === 'all' ||
                          (priceRange === 'free' && event.price === 0) ||
                          (priceRange === 'paid' && event.price > 0);

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popularity':
          return b.registeredCount - a.registeredCount;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, searchQuery, selectedCategory, selectedLocation, priceRange, sortBy]);

  const getCurrentPageEvents = () => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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
                <button className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">
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
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Find and join events that match your interests. From tech conferences to community gatherings, 
            there's something for everyone.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, topics, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {getCurrentPageEvents().length} of {filteredEvents.length} events
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category === 'All Categories' ? 'all' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {locations.map(location => (
                      <option key={location} value={location === 'All Locations' ? 'all' : location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free Events</option>
                    <option value="paid">Paid Events</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLocation('all');
                      setPriceRange('all');
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getCurrentPageEvents().length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentPageEvents().map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden ${
                    event.featured ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    {event.price === 0 && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                        Free
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                        {event.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.registeredCount}/{event.capacity} registered</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{event.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={event.organizer.avatar}
                          alt={event.organizer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            {event.organizer.name}
                            {event.organizer.verified && (
                              <Check className="w-4 h-4 text-blue-500 ml-1" />
                            )}
                          </p>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-600">
                              {event.rating} ({event.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {event.price > 0 ? (
                          <p className="text-lg font-bold text-indigo-600">
                            Rs. {event.price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-green-600">Free</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
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
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Own Event?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of organizers using Digi-Vent to create amazing experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors duration-200">Home</button></li>
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
                  <span className="sr-only">Facebook</span>
                  📘
                </button>
                <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  🐦
                </button>
                <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  💼
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

export default PublicEventsPage;