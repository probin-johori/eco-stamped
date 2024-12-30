"use client"

import { useRef, useState, useEffect } from 'react';
import { Category } from '@/lib/brands';
import {
  Shirt, Glasses, Soup, Home, EyeClosed, Monitor, Baby, MountainSnow,
  Volleyball, Gift, Heart, Pencil, Dog, Plane, Flower2, BookOpen,
  Car, Scissors, Palette, Sofa, SwatchBook, ScrollText, Tractor,
  Gem, Footprints, Sparkles, ChevronRight, ChevronLeft, X, LayoutGrid,
  Brush, Cpu, Paintbrush
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

interface CategoryItem {
  id: Category | 'eco-champion' | null;
  label: string;
  icon: LucideIcon;
}

interface QuickFilterProps {
  activeCategory: Category | 'eco-champion' | null;
  onCategoryChange: (category: Category | 'eco-champion' | null) => void;
}

export const QuickFilter = ({ activeCategory = null, onCategoryChange }: QuickFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hasScrollShadow, setHasScrollShadow] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : true);

  const categories: CategoryItem[] = [
    { id: null, label: 'All', icon: LayoutGrid },
    { id: 'eco-champion', label: 'Eco Champion', icon: Sparkles },
    { id: Category.CLOTHING, label: 'Clothing', icon: Shirt },
    { id: Category.ACCESSORIES, label: 'Accessories', icon: Glasses },
    { id: Category.FOOD_BEVERAGE, label: 'Food & Beverage', icon: Soup },
    { id: Category.HOME, label: 'Home', icon: Home },
    { id: Category.BEAUTY, label: 'Beauty', icon: EyeClosed },
    { id: Category.ELECTRONICS, label: 'Electronics', icon: Monitor },
    { id: Category.TOYS, label: 'Kids & Toys', icon: Baby },
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
    { id: Category.CLEANING, label: 'Cleaning', icon: Paintbrush },
    { id: Category.TECHNOLOGY, label: 'Technology', icon: Cpu }
  ];

  const handleCategoryClick = (categoryId: CategoryItem['id']) => {
    if (activeCategory !== categoryId) {
      onCategoryChange(categoryId);
    }
  };

  const checkFilterScroll = () => {
    if (scrollContainerRef.current && !isMobile) {
      requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
      });
    }
  };

  const checkPageScroll = () => {
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        const shouldShowShadow = window.scrollY > 0;
        if (shouldShowShadow !== hasScrollShadow) {
          setHasScrollShadow(shouldShowShadow);
        }
      });
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
      const mobile = window.innerWidth < 640;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      const debouncedCheck = () => requestAnimationFrame(checkFilterScroll);
      container.addEventListener('scroll', debouncedCheck, { passive: true });
      debouncedCheck();
      
      return () => container.removeEventListener('scroll', debouncedCheck);
    }
  }, [isMobile]);

  useEffect(() => {
    const debouncedPageScroll = () => requestAnimationFrame(checkPageScroll);
    window.addEventListener('scroll', debouncedPageScroll, { passive: true });
    debouncedPageScroll();
    
    return () => window.removeEventListener('scroll', debouncedPageScroll);
  }, [hasScrollShadow]);

  useEffect(() => {
    checkFilterScroll();
  }, [activeCategory]);

  return (
    <div ref={containerRef} className={`transition-shadow duration-200 ${hasScrollShadow ? "shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]" : ""}`}>
      <div className="border-t border-neutral-200" />
      <div className={`relative bg-white ${isMobile ? 'py-2 px-4' : 'py-4'} ${!isMobile && activeCategory ? 'pr-44 pl-20' : !isMobile ? 'px-20' : 'px-4 sm:px-20'}`}>
        {!isMobile && showLeftArrow && (
          <div className="absolute left-20 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/70 to-transparent z-20" />
        )}

        {!isMobile && showRightArrow && (
          <div className={`absolute top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/70 to-transparent z-20 ${activeCategory ? 'right-44' : 'right-20'}`} />
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
            contain: 'content'
          }}
        >
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id ?? 'all'}
              onClick={() => handleCategoryClick(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors flex-shrink-0
                ${activeCategory === id
                  ? 'bg-neutral-50 border-neutral-950 text-neutral-950' 
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>

        <div className={`absolute top-1/2 -translate-y-1/2 z-30 flex items-center gap-4 ${activeCategory ? (isMobile ? 'right-4' : 'right-20') : (isMobile ? 'right-4' : 'right-20')}`}>
          {!isMobile && showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          {activeCategory && !isMobile && (
            <button 
              onClick={() => onCategoryChange(null)}
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
