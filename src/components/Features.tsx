import React from 'react';
import { 
  Kanban, 
  Users, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  Ticket 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Kanban,
      title: 'Smart Task Management',
      description: 'Organize tasks with intuitive Kanban boards. Assign responsibilities, set deadlines, and track progress in real-time.',
      highlight: 'Drag & drop interface',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Coordinate volunteers and team members with built-in communication tools and role management.',
      highlight: 'Real-time updates',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking',
      description: 'Monitor expenses, track payments, and maintain budget control with detailed financial reporting.',
      highlight: 'Smart expense categorization',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Calendar,
      title: 'Event Discovery',
      description: 'Publish events publicly and help attendees discover amazing experiences in their area.',
      highlight: 'Public event listings',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Feedback Analytics',
      description: 'Collect valuable feedback and analyze event performance with comprehensive reporting tools.',
      highlight: 'Real-time insights',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Ticket,
      title: 'Registration Management',
      description: 'Handle attendee registrations, ticket sales, and check-ins with our integrated system.',
      highlight: 'QR code integration',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
            POWERFUL FEATURES
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Everything You Need to Organize{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              Perfect Events
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your event management with our comprehensive suite of tools 
            designed for organizers of all levels.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="space-y-6">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Highlight */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  ✨ {feature.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;