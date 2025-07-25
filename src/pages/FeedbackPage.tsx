import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Eye,
  EyeOff,
  Save,
  Share2,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  Award,
  Heart,
  Zap,
  Target,
  Smile,
  Frown,
  Camera,
  Paperclip,
  X,
  Plus,
  Minus
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  attendees: number;
  rating: number;
  feedbackCount: number;
}

interface FeedbackData {
  eventId: string;
  overallRating: number;
  aspectRatings: {
    organization: number;
    content: number;
    venue: number;
    staff: number;
  };
  categories: string[];
  comments: string;
  recommend: 'yes' | 'no' | 'maybe' | '';
  recommendReason: string;
  anonymous: boolean;
  allowContact: boolean;
  userEmail: string;
  attachments: File[];
}

interface RecentFeedback {
  id: string;
  eventTitle: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  helpful: number;
  category: string;
}

const FeedbackPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [formData, setFormData] = useState<FeedbackData>({
    eventId: '',
    overallRating: 0,
    aspectRatings: {
      organization: 0,
      content: 0,
      venue: 0,
      staff: 0
    },
    categories: [],
    comments: '',
    recommend: '',
    recommendReason: '',
    anonymous: false,
    allowContact: true,
    userEmail: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAspectRatings, setShowAspectRatings] = useState(false);
  const [showRecentFeedback, setShowRecentFeedback] = useState(true);
  const [formProgress, setFormProgress] = useState(0);
  const [isDraft, setIsDraft] = useState(false);
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);

  // Mock data
  const events: Event[] = [
    {
      id: '1',
      title: 'TechFest 2024',
      date: '2024-08-10',
      location: 'Convention Center',
      description: 'Annual technology festival with workshops and demos',
      category: 'Technology',
      attendees: 500,
      rating: 4.7,
      feedbackCount: 89
    },
    {
      id: '2',
      title: 'Community Food Drive',
      date: '2024-08-15',
      location: 'Central Park',
      description: 'Monthly food distribution for local families',
      category: 'Community Service',
      attendees: 150,
      rating: 4.9,
      feedbackCount: 34
    },
    {
      id: '3',
      title: 'Youth Workshop',
      date: '2024-08-20',
      location: 'Community Center',
      description: 'Educational workshop for local youth',
      category: 'Education',
      attendees: 75,
      rating: 4.5,
      feedbackCount: 28
    }
  ];

  const feedbackCategories = [
    'Event Organization',
    'Content Quality',
    'Venue/Location',
    'Communication',
    'Volunteer Support',
    'Technical Issues',
    'Food & Refreshments',
    'Accessibility',
    'Other'
  ];

  const recentFeedback: RecentFeedback[] = [
    {
      id: '1',
      eventTitle: 'TechFest 2024',
      rating: 5,
      comment: 'Amazing event! The workshops were incredibly informative and well-organized.',
      author: 'Sarah M.',
      date: '2 days ago',
      helpful: 12,
      category: 'Content Quality'
    },
    {
      id: '2',
      eventTitle: 'Community Food Drive',
      rating: 5,
      comment: 'Great organization and wonderful volunteers. Made a real difference!',
      author: 'Mike R.',
      date: '1 week ago',
      helpful: 8,
      category: 'Event Organization'
    },
    {
      id: '3',
      eventTitle: 'Youth Workshop',
      rating: 4,
      comment: 'Good content but could use better venue acoustics.',
      author: 'Anonymous',
      date: '2 weeks ago',
      helpful: 5,
      category: 'Venue/Location'
    }
  ];

  // Calculate form progress
  useEffect(() => {
    let progress = 0;
    const totalFields = 6;
    
    if (selectedEvent) progress += 1;
    if (formData.overallRating > 0) progress += 1;
    if (formData.categories.length > 0) progress += 1;
    if (formData.comments.trim()) progress += 1;
    if (formData.recommend) progress += 1;
    if (!formData.anonymous && formData.userEmail) progress += 1;
    
    setFormProgress((progress / totalFields) * 100);
  }, [selectedEvent, formData]);

  // Sentiment analysis simulation
  useEffect(() => {
    if (formData.comments.length > 10) {
      const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'perfect'];
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing'];
      
      const words = formData.comments.toLowerCase().split(' ');
      const positiveCount = words.filter(word => positiveWords.includes(word)).length;
      const negativeCount = words.filter(word => negativeWords.includes(word)).length;
      
      if (positiveCount > negativeCount) {
        setSentiment('positive');
      } else if (negativeCount > positiveCount) {
        setSentiment('negative');
      } else {
        setSentiment('neutral');
      }
    } else {
      setSentiment(null);
    }
  }, [formData.comments]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.comments || formData.overallRating > 0) {
        setIsDraft(true);
        // Simulate auto-save
        setTimeout(() => setIsDraft(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleStarRating = (rating: number, aspect?: string) => {
    if (aspect) {
      setFormData(prev => ({
        ...prev,
        aspectRatings: {
          ...prev.aspectRatings,
          [aspect]: rating
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, overallRating: rating }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('Thank you for your feedback! Your input helps us improve future events.');
      
      // Reset form
      setFormData({
        eventId: '',
        overallRating: 0,
        aspectRatings: { organization: 0, content: 0, venue: 0, staff: 0 },
        categories: [],
        comments: '',
        recommend: '',
        recommendReason: '',
        anonymous: false,
        allowContact: true,
        userEmail: '',
        attachments: []
      });
      setSelectedEvent('');
    }, 2000);
  };

  const getStarRatingLabel = (rating: number) => {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[rating] || '';
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-5 h-5 text-green-500" />;
      case 'negative': return <Frown className="w-5 h-5 text-red-500" />;
      case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Digi-Vent</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Feedback Hub</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">User</p>
                  <p className="text-xs text-gray-500">Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">We Value Your Feedback</h1>
            <p className="text-lg text-gray-600 mb-6">Help us improve by sharing your event experience</p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(formProgress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Event *
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Choose an event to review...</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              
              {selectedEventData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selectedEventData.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(selectedEventData.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedEventData.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {selectedEventData.attendees} attendees
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{selectedEventData.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{selectedEventData.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{selectedEventData.feedbackCount} reviews</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarRating(star)}
                    className={`p-1 rounded transition-colors duration-200 ${
                      star <= formData.overallRating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
                {formData.overallRating > 0 && (
                  <span className="ml-4 text-sm font-medium text-gray-700">
                    {getStarRatingLabel(formData.overallRating)}
                  </span>
                )}
              </div>
            </div>

            {/* Aspect Ratings */}
            <div>
              <button
                type="button"
                onClick={() => setShowAspectRatings(!showAspectRatings)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
              >
                <span>Detailed Ratings (Optional)</span>
                {showAspectRatings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAspectRatings && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  {Object.entries(formData.aspectRatings).map(([aspect, rating]) => (
                    <div key={aspect} className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                        {aspect}
                      </p>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarRating(star, aspect)}
                            className={`transition-colors duration-200 ${
                              star <= rating
                                ? 'text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feedback Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {feedbackCategories.map(category => (
                  <label
                    key={category}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.categories.includes(category)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className="text-sm font-medium">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comments
              </label>
              <div className="relative">
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Share your detailed feedback about the event..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  {getSentimentIcon()}
                  <span className="text-xs text-gray-500">
                    {formData.comments.length}/500
                  </span>
                </div>
              </div>
              {isDraft && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Save className="w-3 h-3 mr-1" />
                  Draft saved automatically
                </div>
              )}
            </div>

            {/* Recommendation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Would you recommend this event to others? *
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'yes', label: 'Yes', icon: ThumbsUp, color: 'text-green-600' },
                  { value: 'maybe', label: 'Maybe', icon: Meh, color: 'text-yellow-600' },
                  { value: 'no', label: 'No', icon: ThumbsDown, color: 'text-red-600' }
                ].map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.recommend === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommend"
                      value={option.value}
                      checked={formData.recommend === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, recommend: e.target.value as any }))}
                      className="sr-only"
                    />
                    <option.icon className={`w-5 h-5 mr-2 ${option.color}`} />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
              
              {formData.recommend && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={formData.recommendReason}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommendReason: e.target.value }))}
                    placeholder="Why? (Optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Privacy Controls */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Submit feedback anonymously
                  </span>
                </label>
                
                {!formData.anonymous && (
                  <>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowContact: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Allow organizers to contact me about this feedback
                      </span>
                    </label>
                    
                    <div>
                      <input
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !selectedEvent || formData.overallRating === 0}
                className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting || !selectedEvent || formData.overallRating === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
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
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Feedback Display */}
        {showRecentFeedback && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Feedback</h2>
              <button
                onClick={() => setShowRecentFeedback(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {recentFeedback.map(feedback => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.eventTitle}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">by {feedback.author}</span>
                        <span className="text-sm text-gray-500">{feedback.date}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {feedback.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{feedback.comment}</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({feedback.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;