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
import Head from 'next/head';

const BRANDS_PER_PAGE = 16;
const HEADER_HEIGHT = 132;
const SCROLL_THRESHOLD = 400;

// Separate component for the brand grid to optimize re-renders
const BrandGrid = ({ brands, onBrandClick, visibleCount }: { 
  brands: SustainableBrand[], 
  onBrandClick: (brand: SustainableBrand) => void,
  visibleCount: number 
}) => {
  const visibleBrands = brands.slice(0, visibleCount);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {visibleBrands.map((brand, index) => (
        <BrandCard 
          key={brand.id} 
          brand={brand}
          onClick={() => onBrandClick(brand)}
          isPriority={index < 3}
          index={index}
        />
      ))}
    </div>
  );
};

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
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const { data: brands = [], isLoading, error } = useBrands();

  const handleBrandClick = useCallback((brand: SustainableBrand) => {
    router.push(`/${slugify(brand.name)}`);
  }, [router]);

  const filteredBrands = useMemo(() => {
    if (!brands.length) return [];
    
    let filtered = brands;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(brand => 
        brand.name.toLowerCase().includes(query) ||
        brand.categories.some(category => category.toLowerCase().includes(query))
      );
    }
    
    if (activeCategory) {
      filtered = activeCategory === 'eco-champion' 
        ? filtered.filter(brand => brand.isCuratorsPick)
        : filtered.filter(brand => brand.categories.includes(activeCategory));
    }
    
    return filtered;
  }, [brands, activeCategory, searchQuery]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      setShowShadow(currentScrollY > 0);
      
      if (currentScrollY !== lastScrollY && !isSelectingCategories) {
        if (currentScrollY < SCROLL_THRESHOLD) {
          setIsHeaderHidden(false);
        } else if (currentScrollY > lastScrollY) {
          setIsHeaderHidden(true);
        } else {
          setIsHeaderHidden(false);
        }
        setLastScrollY(currentScrollY);
      }
    }, 10);
  }, [lastScrollY, isSelectingCategories]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
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
      <>
        <Head>
          <meta name="robots" content="index,follow" />
          <title>Eco Stamped - Sustainable Brands Directory</title>
          <meta name="description" content="Discover sustainable and eco-friendly brands in India" />
        </Head>
        <div className="min-h-screen bg-background p-4">
          <p className="text-destructive">Error: {error instanceof Error ? error.message : 'Failed to load brands'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="index,follow" />
        <title>Eco Stamped - Sustainable Brands Directory</title>
        <meta name="description" content="Discover sustainable and eco-friendly brands in India" />
      </Head>
      <div className="flex flex-col min-h-screen bg-background">
        <div 
          className={`fixed inset-x-0 top-0 bg-background transition-transform duration-300 sm:transform-none ${
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
                  setIsSelectingCategories(true);
                  setActiveCategory(category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setIsSelectingCategories(false), 1000);
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-[132px] sm:h-[152px]" />

        <main className="flex-1">
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
                  It seems we don't have any matching brands in our directory currently. We're continuously working to make our collection more comprehensive.
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
    </>
  );
}
