import React, { useEffect, useState } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    quote:
      'The Prompt Collection has become my go-to library. Our support team ships responses twice as fast thanks to the curated starters.',
    name: 'Sasha Nguyen',
    role: 'Lead CX Strategist'
  },
  {
    quote:
      'I never realized how much better my AI outputs could be. The best practices and tailored prompts helped us win two new clients.',
    name: 'Jordan Patel',
    role: 'Creative Founder'
  },
  {
    quote:
      'The prompts are consistently high-quality and easy to adapt. It feels like having an on-demand prompt engineer on the team.',
    name: 'Maya Herrera',
    role: 'Product Manager'
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="mt-12">
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaQuoteLeft className="w-6 h-6 text-blue-500" />
          Trusted by Prompt Power Users
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${(100 / itemsPerView) * currentIndex}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="px-2 w-full"
                  style={{ flex: `0 0 ${100 / itemsPerView}%` }}
                >
                  <div className="flex flex-col h-full p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">"{testimonial.quote}"</p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {testimonials.length > itemsPerView && (
            <div className="flex items-center justify-center mt-6 gap-6">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next testimonial"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
