'use client'

import { Category, type SustainableBrand } from '@/lib/brands';
import { BrandCard } from '@/components/BrandCard';
import { BrandCardSkeleton } from '@/components/BrandCardSkeleton';
import { Header } from '@/components/Header';
import { QuickFilter } from "@/components/QuickFilter";
import { Footer } from '@/components/Footer';
import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { AddBrandForm } from '@/components/AddBrandForm';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/lib/hooks/useBrands';
import { useQueryClient } from '@tanstack/react-query';

const BRANDS_PER_PAGE = 16;
const HEADER_HEIGHT = 132;
const SCROLL_THRESHOLD = 400;

const MemoizedBrandCard = memo(BrandCard, (prev, next) => {
  return prev.brand.id === next.brand.id && 
         prev.isPriority === next.isPriority;
});

const BrandGrid = memo(({ brands, onBrandClick, visibleCount }: { 
  brands: SustainableBrand[], 
  onBrandClick: (brand: SustainableBrand) => void,
  visibleCount: number 
}) => {
  const visibleBrands = brands.slice(0, visibleCount);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {visibleBrands.map((brand, index) => (
        <MemoizedBrandCard 
          key={brand.id} 
          brand={brand}
          onClick={() => onBrandClick(brand)}
          isPriority={index < 3}
          index={index}
        />
      ))}
    </div>
  );
});

BrandGrid.displayName = 'BrandGrid';

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
  
  const ticking = useRef<boolean>(false);
  const gridStartRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: brands = [], isLoading, error } = useBrands();

  const handleBrandClick = useCallback((brand: SustainableBrand) => {
    router.push(`/${slugify(brand.name)}`);
  }, [router]);

  const filteredBrands = useMemo(() => {
    if (!brands.length) return [];
    
    const searchTerms = searchQuery.toLowerCase().split(' ');
    
    return brands.filter(brand => {
      if (activeCategory) {
        if (activeCategory === 'eco-champion' && !brand.isCuratorsPick) {
          return false;
        }
        if (activeCategory !== 'eco-champion' && !brand.categories.includes(activeCategory)) {
          return false;
        }
      }
      
      if (searchQuery) {
        return searchTerms.every(term => 
          brand.name.toLowerCase().includes(term) ||
          brand.categories.some(cat => cat.toLowerCase().includes(term))
        );
      }
      
      return true;
    });
  }, [brands, activeCategory, searchQuery]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 0 !== showShadow) {
          setShowShadow(currentScrollY > 0);
        }
        
        if (currentScrollY !== lastScrollY && !isSelectingCategories) {
          const shouldHideHeader = 
            currentScrollY >= SCROLL_THRESHOLD && 
            currentScrollY > lastScrollY;
          
          if (shouldHideHeader !== isHeaderHidden) {
            setIsHeaderHidden(shouldHideHeader);
          }
          setLastScrollY(currentScrollY);
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [lastScrollY, isSelectingCategories, showShadow, isHeaderHidden]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore && visibleBrands < filteredBrands.length) {
          setIsLoadingMore(true);
          requestAnimationFrame(() => {
            setVisibleBrands(prev => Math.min(prev + BRANDS_PER_PAGE, filteredBrands.length));
            setIsLoadingMore(false);
          });
        }
      },
      { 
        rootMargin: '200px',
        threshold: 0.1 
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, filteredBrands.length, visibleBrands]);

  useEffect(() => {
    setVisibleBrands(BRANDS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  const handleFormSubmit = useCallback(async (data: Omit<SustainableBrand, 'id'>) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['brands'] });
      setShowAddBrandForm(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  }, [queryClient]);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <p className="text-destructive">
          Error: {error instanceof Error ? error.message : 'Failed to load brands'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div 
        className={`fixed inset-x-0 top-0 bg-background transform transition-transform duration-300 will-change-transform ${
          isHeaderHidden ? '-translate-y-full sm:translate-y-0' : 'translate-y-0'
        }`} 
        style={{ zIndex: 49 }}
      >
        <div className="transition-shadow duration-200">
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
          
          <div className="relative" style={{ zIndex: 50 }}>
            <QuickFilter 
              activeCategory={activeCategory}
              onCategoryChange={(category) => {
                requestAnimationFrame(() => {
                  setIsSelectingCategories(true);
                  setActiveCategory(category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setIsSelectingCategories(false), 1000);
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="h-[132px] sm:h-[152px]" />

      <main className="flex-1" role="main">
        <div className="px-4 sm:px-20">
          {!activeCategory && !searchQuery && !isLoading && filteredBrands.length > 0 && (
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
                It seems we don't have any matching brands in our directory currently. 
                We're continuously working to make our collection more comprehensive.
              </p>
            </div>
          )}

          {(isLoading || filteredBrands.length > 0) && (
            <div ref={gridStartRef} className="h-full pb-20">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: BRANDS_PER_PAGE }).map((_, index) => (
                    <BrandCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="h-full">
                  <BrandGrid 
                    brands={filteredBrands}
                    onBrandClick={handleBrandClick}
                    visibleCount={visibleBrands}
                  />
                </div>
              )}
            </div>
          )}

          {!isLoading && visibleBrands < filteredBrands.length && (
            <div ref={loadMoreRef} className="h-20" aria-hidden="true" />
          )}
        </div>
      </main>

      <Footer onShowAddBrandForm={setShowAddBrandForm} />

      <AddBrandForm 
        isOpen={showAddBrandForm}
        onClose={() => setShowAddBrandForm(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
