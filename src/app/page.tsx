'use client'

import { Category, type SustainableBrand } from '@/lib/brands';
import { BrandCard } from '@/components/BrandCard';
import { BrandCardSkeleton } from '@/components/BrandCardSkeleton';
import { Header } from '@/components/Header';
import { QuickFilter } from "@/components/QuickFilter";
import { Footer } from '@/components/Footer';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AddBrandForm } from '@/components/AddBrandForm';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/lib/hooks/useBrands';
import { useQueryClient } from '@tanstack/react-query';

const BRANDS_PER_PAGE = 16;
const HEADER_HEIGHT = 132;
const SCROLL_THRESHOLD = 400;

const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};

export default function Home(): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<Category | 'eco-champion' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShadow, setShowShadow] = useState(false);
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [visibleBrands, setVisibleBrands] = useState<number>(BRANDS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState<boolean>(false);
  const [isSelectingCategories, setIsSelectingCategories] = useState(false);
  
  const gridStartRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: brands = [], isLoading, error } = useBrands();

  const handleBrandClick = useCallback((brand: SustainableBrand) => {
    router.push(`/${slugify(brand.name)}`);
  }, [router]);

  const filteredBrands = useMemo(() => {
    if (!activeCategory) return brands;
    
    if (activeCategory === 'eco-champion') {
      return brands.filter(brand => brand.isCuratorsPick);
    }
    
    return brands.filter(brand => brand.categories.includes(activeCategory));
  }, [brands, activeCategory]);

  const visibleBrandsList = useMemo(() => {
    return filteredBrands.slice(0, visibleBrands);
  }, [filteredBrands, visibleBrands]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Show shadow when scrolled
    setShowShadow(currentScrollY > 0);
    
    // Only update if scroll position has changed and not selecting categories
    if (currentScrollY !== lastScrollY && !isSelectingCategories) {
      if (currentScrollY < SCROLL_THRESHOLD) {
        // Always show header before threshold
        setIsHeaderHidden(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down & past threshold - hide header
        setIsHeaderHidden(true);
      } else {
        // Scrolling up - show header
        setIsHeaderHidden(false);
      }
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY, isSelectingCategories]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  const loadMoreBrands = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleBrands(prev => {
        const next = prev + BRANDS_PER_PAGE;
        return Math.min(next, filteredBrands.length);
      });
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, filteredBrands]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreBrands();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreBrands]);

  useEffect(() => {
    setVisibleBrands(BRANDS_PER_PAGE);
  }, [activeCategory]);

  const handleFormSubmit = useCallback(async (data: Omit<SustainableBrand, 'id'>) => {
    try {
      console.log('Submitting form data:', data);
      await queryClient.invalidateQueries({ queryKey: ['brands'] });
      setShowAddBrandForm(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  }, [queryClient]);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <p className="text-destructive">Error: {error instanceof Error ? error.message : 'Failed to load brands'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Group */}
      <div 
        className={`fixed inset-x-0 top-0 bg-background transform transition-transform duration-300 sm:transform-none ${
          isHeaderHidden ? '-translate-y-full sm:translate-y-0' : 'translate-y-0'
        }`} 
        style={{ zIndex: 49 }}
      >
        <div className={`transition-shadow duration-200 ${showShadow ? 'shadow-sm' : ''}`}>
          {/* Header with highest z-index */}
          <div className="relative" style={{ zIndex: 51 }}>
            <Header 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              disableShadow
              className="w-full"
              showAddBrandForm={showAddBrandForm}
              onShowAddBrandForm={setShowAddBrandForm}
            />
          </div>
          
          {/* QuickFilter with intermediate z-index */}
          <div className="relative" style={{ zIndex: 50 }}>
            <QuickFilter 
              activeCategory={activeCategory}
              onCategoryChange={(category) => {
                setIsSelectingCategories(true);
                setActiveCategory(category);
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Reset selecting state after a short delay
                setTimeout(() => setIsSelectingCategories(false), 1000);
              }}
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[132px] sm:h-[152px]" />

      <main className="flex-1">
        <div className="px-4 sm:px-20">
          {!activeCategory && !isLoading && filteredBrands.length > 0 && (
            <div className="text-center mb-6 sm:mb-12 pt-8 sm:pt-8">
              <h1 className="text-2xl sm:text-4xl font-semibold text-foreground leading-tight">
                Discover Tomorrow&apos;s India
                <br />
                with Eco-Champions
              </h1>
            </div>
          )}

          {!isLoading && filteredBrands.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                We&apos;re Growing Our Directory
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                It seems we don't have any matching brands in our directory currently. We're continuously working to make our collection of eco-friendly companies more comprehensive. If you know of an amazing sustainable brand that should be featured, please share it with us. We&apos;d appreciate your help growing this community resource.
              </p>
            </div>
          )}

          {(isLoading || filteredBrands.length > 0) && (
            <div 
              ref={gridStartRef} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {isLoading ? (
                Array.from({ length: BRANDS_PER_PAGE }).map((_, index) => (
                  <BrandCardSkeleton key={index} />
                ))
              ) : (
                visibleBrandsList.map((brand) => (
                  <BrandCard 
                    key={brand.id} 
                    brand={brand}
                    onClick={() => handleBrandClick(brand)}
                  />
                ))
              )}
            </div>
          )}

          {!isLoading && visibleBrands < filteredBrands.length && (
            <div 
              ref={loadMoreRef}
              className="text-center py-8"
            >
              {isLoadingMore ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              ) : (
                <p className="text-muted-foreground">Loading more brands...</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer onShowAddBrandForm={setShowAddBrandForm} />

      <AddBrandForm 
        isOpen={showAddBrandForm}
        onClose={() => setShowAddBrandForm(false)}
        onSubmit={handleFormSubmit}
      />

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 bg-background/5 text-foreground p-2 text-xs border-t border-border">
          <div>Active Category: {activeCategory || 'All'}</div>
          <div>Search Query: {searchQuery || 'None'}</div>
          <div>Total Brands: {brands.length}</div>
          <div>Visible Brands: {visibleBrandsList.length}</div>
          <div>Filtered Total: {filteredBrands.length}</div>
        </div>
      )}
    </div>
  );
}
