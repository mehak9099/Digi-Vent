import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      quote: "Digi-Vent transformed how we organize our annual music festival. The task management and budget tracking features saved us countless hours.",
      name: "Sarah Johnson",
      title: "Festival Organizer",
      company: "Summer Sounds Festival",
      rating: 5,
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "The team collaboration tools are fantastic. Our volunteers stayed organized and informed throughout the entire event planning process.",
      name: "Michael Chen",
      title: "Corporate Event Manager",
      company: "TechCorp Events",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "I love how easy it is to track expenses and gather feedback. My clients are always impressed with the level of organization.",
      name: "Emma Rodriguez",
      title: "Wedding Planner",
      company: "Elegant Occasions",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
            TESTIMONIALS
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              Users Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what event organizers are saying about Digi-Vent.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Testimonial */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-indigo-100">
              <Quote className="w-16 h-16" />
            </div>

            <div className="relative z-10">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 italic">
                "{testimonials[currentSlide].quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentSlide].avatar}
                  alt={testimonials[currentSlide].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100"
                />
                <div className="text-center md:text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentSlide].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentSlide].title}
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {testimonials[currentSlide].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-indigo-50 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dot Indicators */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-indigo-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-indigo-50 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;