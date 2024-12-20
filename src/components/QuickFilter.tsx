"use client"

import { useRef, useState, useEffect } from 'react';
import { Category } from '@/lib/brands';
import {
  Shirt, Soup, Home, EyeClosed, Baby, Gift, Heart, Pencil, Dog, Plane,
  Flower2, BookOpen, Car, Scissors, Palette, Sofa, ScrollText, Tractor,
  Gem, Footprints, Sparkles, Monitor, MountainSnow, ChevronRight, ChevronLeft,
  X, Glasses, Volleyball, SwatchBook
} from "lucide-react";

interface QuickFilterProps {
  activeCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
}

export const QuickFilter = ({ activeCategories = [], onCategoryChange }: QuickFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hasScrollShadow, setHasScrollShadow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const categories = [
    { id: Category.CLOTHING, label: 'Clothing', icon: Shirt },
    { id: Category.ACCESSORIES, label: 'Accessories', icon: Glasses },
    { id: Category.FOOD_BEVERAGE, label: 'Food & Beverage', icon: Soup },
    { id: Category.HOME, label: 'Home', icon: Home },
    { id: Category.BEAUTY, label: 'Beauty', icon: EyeClosed },
    { id: Category.ELECTRONICS, label: 'Electronics', icon: Monitor },
    { id: Category.TOYS, label: 'Toys', icon: Baby },
    { id: Category.OUTDOOR, label: 'Outdoor', icon: MountainSnow },
    { id: Category.SPORTS, label: 'Sports', icon: Volleyball },
    { id: Category.GIFTS, label: 'Gifts', icon: Gift },
    { id: Category.HEALTH, label: 'Health', icon: Heart },
    { id: Category.STATIONERY, label: 'Stationery', icon: Pencil },
    { id: Category.PETS, label: 'Pets', icon: Dog },
    { id: Category.TRAVEL, label: 'Travel', icon: Plane },
    { id: Category.GARDEN, label: 'Garden', icon: Flower2 },
    { id: Category.BOOKS, label: 'Books', icon: BookOpen },
    { id: Category.AUTOMOTIVE, label: 'Automotive', icon: Car },
    { id: Category.CRAFTS, label: 'Crafts', icon: Scissors },
    { id: Category.ART, label: 'Art', icon: Palette },
    { id: Category.FURNITURE, label: 'Furniture', icon: Sofa },
    { id: Category.DECOR, label: 'Decor', icon: SwatchBook },
    { id: Category.TEXTILES, label: 'Textiles', icon: ScrollText },
    { id: Category.FARMING, label: 'Farming', icon: Tractor },
    { id: Category.JEWELRY, label: 'Jewelry', icon: Gem },
    { id: Category.FOOTWEAR, label: 'Footwear', icon: Footprints },
    { id: Category.CLEANING, label: 'Cleaning', icon: Sparkles }
  ] as const;

  const handleCategoryClick = (categoryId: Category) => {
    const newCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter(c => c !== categoryId)
      : [...activeCategories, categoryId];
    onCategoryChange(newCategories);
  };

  const checkFilterScroll = () => {
    if (scrollContainerRef.current && !isMobile) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  const checkPageScroll = () => {
    if (typeof window !== 'undefined') {
      setHasScrollShadow(window.scrollY > 0);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      container.addEventListener('scroll', checkFilterScroll);
      setTimeout(checkFilterScroll, 100);
    }

    window.addEventListener('scroll', checkPageScroll);
    checkPageScroll();

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkFilterScroll);
      }
      window.removeEventListener('scroll', checkPageScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    checkFilterScroll();
  }, [activeCategories]);

  return (
    <div ref={containerRef} className={`transition-shadow duration-200 ${hasScrollShadow ? "shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]" : ""}`}>
      <div className="border-t border-neutral-200" />
      <div className={`relative bg-white ${isMobile ? 'py-2 px-4' : 'py-4'} ${!isMobile && activeCategories.length > 0 ? 'pr-44 pl-20' : !isMobile ? 'px-20' : 'px-4 sm:px-20'}`}>
        {!isMobile && showLeftArrow && (
          <div className="absolute left-20 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/70 to-transparent z-20" />
        )}

        {!isMobile && showRightArrow && (
          <div className={`absolute top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/70 to-transparent z-20 ${activeCategories.length > 0 ? 'right-44' : 'right-20'}`} />
        )}
        
        {!isMobile && showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-20 top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className={`flex gap-2 overflow-x-auto no-scrollbar ${isMobile ? '-mx-4 px-4' : 'px-1'} py-1`}
          style={{ 
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCategoryClick(id as Category)}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-colors flex-shrink-0
                ${activeCategories.includes(id as Category)
                  ? 'bg-neutral-100 border-neutral-950 text-neutral-950' 
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>

        <div className={`absolute top-1/2 -translate-y-1/2 z-30 flex items-center gap-4 ${activeCategories.length > 0 ? (isMobile ? 'right-4' : 'right-20') : (isMobile ? 'right-4' : 'right-20')}`}>
          {!isMobile && showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          {activeCategories.length > 0 && !isMobile && (
            <button 
              onClick={() => onCategoryChange([])}
              className="flex items-center gap-2 text-neutral-950 hover:text-neutral-700 transition-colors ml-4"
            >
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickFilter;
