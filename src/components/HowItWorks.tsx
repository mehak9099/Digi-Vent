import React from 'react';
import { Rocket, Zap, Target, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Rocket,
      number: '01',
      title: 'Set Up Your Event',
      description: 'Use our intuitive event creation wizard to define your event details, goals, and requirements in minutes.',
      time: '2-3 minutes',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Zap,
      number: '02',
      title: 'Build Your Team',
      description: 'Invite team members, create task boards, assign responsibilities, and start collaborating effectively.',
      time: '5-10 minutes',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Target,
      number: '03',
      title: 'Launch & Improve',
      description: 'Manage your event seamlessly and gather insights for continuous improvement with our analytics dashboard.',
      time: 'Ongoing',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
            SIMPLE PROCESS
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Get Started in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              Minutes
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our streamlined workflow gets you from idea to successful event in just three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-emerald-200 to-amber-200 transform -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}

                <div className="text-center space-y-6">
                  {/* Number Badge */}
                  <div className="relative mx-auto">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.number}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        ⏱️ {step.time}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>

                  {/* Mock Visual */}
                  <div className="bg-gray-50 rounded-xl p-6 mx-auto max-w-sm">
                    <div className={`h-32 bg-gradient-to-br ${step.color} rounded-lg opacity-20 flex items-center justify-center`}>
                      <step.icon className="w-16 h-16 text-white" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;