import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart,
  Shield,
  Award,
  Users,
  Zap,
  Globe
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Events', href: '/events' },
        { label: 'Create Event', href: '/admin/events/create' },
        { label: 'Volunteer Dashboard', href: '/dashboard/volunteer' },
        { label: 'Admin Dashboard', href: '/admin/dashboard' }
      ]
    },
    {
      title: 'Features',
      links: [
        { label: 'Task Management', href: '/tasks/board' },
        { label: 'Budget Tracking', href: '/admin/expenses' },
        { label: 'Volunteer Management', href: '/admin/volunteers' },
        { label: 'Feedback System', href: '/feedback' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#', onClick: () => alert('Help Center coming soon!') },
        { label: 'API Documentation', href: '#', onClick: () => alert('API docs coming soon!') },
        { label: 'Community Forum', href: '#', onClick: () => alert('Forum coming soon!') },
        { label: 'Best Practices', href: '#', onClick: () => alert('Best practices guide coming soon!') }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#', onClick: () => alert('About page coming soon!') },
        { label: 'Careers', href: '#', onClick: () => alert('Careers page coming soon!') },
        { label: 'Press Kit', href: '#', onClick: () => alert('Press kit coming soon!') },
        { label: 'Contact Us', href: '#', onClick: () => alert('Contact page coming soon!') }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR Compliance', href: '#' }
  ];

  const handleLinkClick = (link: any) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.href.startsWith('/')) {
      navigate(link.href);
    } else {
      window.open(link.href, '_blank');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Get the latest updates on new features, events, and community highlights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-white/20 text-gray-900"
              />
              <button 
                onClick={() => alert('Newsletter signup coming soon!')}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            <p className="text-indigo-200 text-sm mt-3">
              Join 5,000+ event organizers already subscribed
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Digi-Vent</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering event organizers worldwide with intelligent tools for seamless event management. 
                From planning to execution, we make every event a success.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href="mailto:hello@digi-vent.com" className="hover:text-white transition-colors duration-200">
                    hello@digi-vent.com
                  </a>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-3" />
                  <a href="tel:+1-555-123-4567" className="hover:text-white transition-colors duration-200">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <button
                    key={social.label}
                    onClick={() => handleLinkClick(social)}
                    className={`p-3 bg-gray-800 rounded-lg transition-all duration-200 ${social.color} hover:bg-gray-700 hover:scale-110`}
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-white font-semibold mb-1">Secure & Reliable</h4>
              <p className="text-gray-400 text-sm">Enterprise-grade security</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-white font-semibold mb-1">50,000+ Events</h4>
              <p className="text-gray-400 text-sm">Successfully managed</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="text-white font-semibold mb-1">Award Winning</h4>
              <p className="text-gray-400 text-sm">Best Event Platform 2024</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-white font-semibold mb-1">99.9% Uptime</h4>
              <p className="text-gray-400 text-sm">Always available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} Digi-Vent. All rights reserved.
              </p>
              <div className="flex items-center text-gray-400 text-sm">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for the community
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {legalLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-110 z-40"
        title="Back to Top"
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </button>
    </footer>
  );
};

export default Footer;