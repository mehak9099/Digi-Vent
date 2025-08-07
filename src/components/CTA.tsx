import React from 'react';
import { ArrowRight, Calendar, Shield } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_76%,transparent_77%)] bg-[length:60px_60px]" />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Organize Your{' '}
              <span className="text-yellow-300">
                Best Event Yet?
              </span>
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of organizers who trust Digi-Vent for their event management needs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.location.href = '/register'}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={() => alert('Demo scheduling feature coming soon!')}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Demo
            </button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center space-x-2 text-indigo-100 pt-6">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">No credit card required</span>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-indigo-100 text-sm">Forever plan available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-indigo-100 text-sm">Customer support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">30-day</div>
              <div className="text-indigo-100 text-sm">Money-back guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
