import React, { useState, useEffect } from 'react';

const categories = [
  "Clothing",
  "Accessories",
  "Food & Beverage",
  "Home",
  "Beauty",
  "Electronics",
  "Toys",
  "Outdoor",
  "Sports",
  "Gifts",
  "Health",
  "Stationery",
  "Pets",
  "Travel",
  "Garden",
  "Books",
  "Automotive",
  "Crafts",
  "Art",
  "Furniture",
  "Decor",
  "Textiles",
  "Farming",
  "Jewelry",
  "Footwear",
  "Cleaning"
];

export const CategoryAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const resetToTop = React.useCallback(() => {
    setIsResetting(true);
    setActiveIndex(0);
    setTimeout(() => setIsResetting(false), 50);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === categories.length - 1) {
        resetToTop();
      } else {
        setActiveIndex(current => current + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, resetToTop]);

  const getOpacity = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return 1;
    if (distance > 5) return 0;
    return Math.max(0.05, 1 - (distance * 0.25));
  };

  const getTransform = (index: number) => {
    const distance = index - activeIndex;
    return `translateY(${distance * 70}px)`;
  };

  return (
    <div className="relative h-[500px] flex items-center justify-center overflow-hidden max-w-5xl mx-auto">
      <div className="flex items-center w-full justify-center">
        <div className="text-4xl font-medium text-right flex-1 pr-8">
          Sustainably shaping
        </div>
        
        <div className="relative flex-1">
          {categories.map((category, index) => {
            const opacity = getOpacity(index);
            const transform = getTransform(index);
            
            return (
              <div
                key={`${category}-${index}`}
                className={`absolute left-0 text-4xl font-medium transition-all duration-500 ease-in-out ${isResetting ? 'duration-0' : ''}`}
                style={{
                  opacity,
                  transform,
                  top: 0,
                }}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};