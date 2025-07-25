import React, { useState, useEffect, useRef } from 'react';

const Statistics = () => {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    { number: 50000, label: 'Events Organized', suffix: '+' },
    { number: 500, label: 'Happy Organizers', suffix: '+' },
    { number: 1000000, label: 'Attendees Served', suffix: '+' },
    { number: 4.8, label: 'Average Rating', suffix: '/5' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      let startTime: number;
      const duration = 2000; // 2 seconds
      const startValue = 0;
      const endValue = stat.number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = currentValue;
          return newCounters;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const formatNumber = (num: number, originalNum: number) => {
    if (originalNum >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (originalNum >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    } else if (originalNum < 10) {
      return num.toFixed(1);
    } else {
      return Math.floor(num).toLocaleString();
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_76%,transparent_77%)] bg-[length:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {formatNumber(counters[index], stat.number)}{stat.suffix}
              </div>
              <div className="text-lg md:text-xl text-indigo-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;