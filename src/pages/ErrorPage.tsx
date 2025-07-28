import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Shield, 
  Calendar,
  Mail,
  HelpCircle
} from 'lucide-react';

interface ErrorPageProps {
  errorType?: '404' | '403' | '500';
  title?: string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  errorType = '404', 
  title, 
  message 
}) => {
  const navigate = useNavigate();
  const error = useRouteError() as any;

  // Determine error type from route error if not provided
  const getErrorType = () => {
    if (errorType) return errorType;
    if (error?.status === 403) return '403';
    if (error?.status === 500) return '500';
    return '404';
  };

  const currentErrorType = getErrorType();

  const errorConfig = {
    '404': {
      icon: Search,
      title: title || 'Oops! Page Not Found',
      message: message || "The page you're looking for doesn't exist or has been moved.",
      primaryAction: 'Go to Dashboard',
      primaryRoute: '/admin/dashboard',
      secondaryAction: 'Back to Home',
      secondaryRoute: '/',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      animation: 'animate-bounce'
    },
    '403': {
      icon: Shield,
      title: title || 'Access Denied',
      message: message || "You don't have permission to view this page. Please contact your administrator.",
      primaryAction: 'Back to Dashboard',
      primaryRoute: '/admin/dashboard',
      secondaryAction: 'Contact Support',
      secondaryRoute: '/contact',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      animation: 'animate-pulse'
    },
    '500': {
      icon: AlertTriangle,
      title: title || 'Something Went Wrong',
      message: message || "We're experiencing technical difficulties. Please try again later.",
      primaryAction: 'Try Again',
      primaryRoute: null, // Will refresh page
      secondaryAction: 'Go Home',
      secondaryRoute: '/',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      animation: 'animate-pulse'
    }
  };

  const config = errorConfig[currentErrorType];
  const IconComponent = config.icon;

  const handlePrimaryAction = () => {
    if (config.primaryRoute) {
      navigate(config.primaryRoute);
    } else {
      window.location.reload();
    }
  };

  const handleSecondaryAction = () => {
    if (config.secondaryRoute === '/contact') {
      // Open email client
      window.location.href = 'mailto:support@digi-vent.com?subject=Access Issue';
    } else {
      navigate(config.secondaryRoute);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(79,70,229,0.02)_25%,rgba(79,70,229,0.02)_26%,transparent_27%,transparent_74%,rgba(79,70,229,0.02)_75%,rgba(79,70,229,0.02)_76%,transparent_77%)] bg-[length:60px_60px]" />
      
      <div className="relative max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Digi-Vent</span>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 ${config.bgColor} rounded-full mb-8`}>
            <IconComponent className={`w-12 h-12 ${config.color} ${config.animation}`} />
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <span className={`text-6xl font-bold ${config.color}`}>
              {currentErrorType}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
            {config.message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handlePrimaryAction}
              className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              {config.primaryRoute ? (
                <Home className="w-5 h-5 mr-2" />
              ) : (
                <RefreshCw className="w-5 h-5 mr-2" />
              )}
              {config.primaryAction}
            </button>
            
            <button
              onClick={handleSecondaryAction}
              className="flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 font-semibold"
            >
              {config.secondaryRoute === '/contact' ? (
                <Mail className="w-5 h-5 mr-2" />
              ) : (
                <ArrowLeft className="w-5 h-5 mr-2" />
              )}
              {config.secondaryAction}
            </button>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <button
              onClick={goBack}
              className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Go Back
            </button>
            
            {currentErrorType === '404' && (
              <button
                onClick={() => navigate('/events')}
                className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <Search className="w-4 h-4 mr-1" />
                Browse Events
              </button>
            )}
            
            <button
              onClick={() => window.location.href = 'mailto:support@digi-vent.com?subject=Error Report&body=Error Type: ' + currentErrorType}
              className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Report Issue
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mt-6 text-center">
          <nav className="flex justify-center text-sm text-gray-500">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Error {currentErrorType}</span>
          </nav>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you continue to experience issues, please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@digi-vent.com"
              className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </a>
            <button
              onClick={() => navigate('/help')}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;