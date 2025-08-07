import React from 'react';
import { ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(79,70,229,0.05)_25%,rgba(79,70,229,0.05)_26%,transparent_27%,transparent_74%,rgba(79,70,229,0.05)_75%,rgba(79,70,229,0.05)_76%,transparent_77%)] bg-[length:60px_60px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Announcement Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md border border-indigo-100 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-600">
                🎉 Now supporting 10,000+ events worldwide!
              </span>
            </div>

            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Plan. Manage.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
                  Celebrate.
                </span>
                <br />
                All in One Platform.
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                From small meetups to large festivals, Digi-Vent makes organizing events simple, 
                efficient, and stress-free. Join thousands of organizers who trust us with their success.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
  onClick={() => window.location.href = '/register'}
  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
>
  Get Started Free
  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
</button>

              
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl">
              <button 
                onClick={() => alert('Demo video coming soon!')}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
              
              <button 
                onClick={() => window.location.href = '/events'}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-200"
              >
                Explore Events
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>50,000+ events managed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>500+ happy organizers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>4.8/5 average rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Event Dashboard</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tasks Completed</span>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Budget Used</span>
                      <span className="text-sm font-semibold">$8,500</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-emerald-300 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Team Members</span>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-emerald-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-indigo-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-pink-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs">
                          +3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;