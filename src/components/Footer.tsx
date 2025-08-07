import React from 'react';
import { Calendar, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#' },
        { name: 'Features', href: '#features' },
        { name: 'Public Events', href: '/events' },
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
        { name: 'Pricing', href: '/pricing' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Contact Support', href: '/support' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* About Digi-Vent */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Digi-Vent</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Making event management simple, efficient, and stress-free for organizers worldwide.
            </p>
            <p className="text-sm text-gray-500">
              Making event management simple since 2024
            </p>
          </div>

          {/* Quick Links & Resources */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => link.href.startsWith('#') ? scrollToSection(link.href) : window.location.href = link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact & Social</h3>
            
            {/* Contact Email */}
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-5 h-5" />
              <a href="mailto:hello@digi-vent.com" className="hover:text-white transition-colors duration-200">
                hello@digi-vent.com
              </a>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-medium">Stay Updated</h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Digi-Vent. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors duration-200">
              <button 
                onClick={() => alert('Privacy policy coming soon!')}
                className="hover:text-white transition-colors duration-200"
              >
                Privacy
              </button>
              <button 
                onClick={() => alert('Terms of service coming soon!')}
                className="hover:text-white transition-colors duration-200"
              >
                Terms
              </button>
              <button 
                onClick={() => alert('Cookie policy coming soon!')}
                className="hover:text-white transition-colors duration-200"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;