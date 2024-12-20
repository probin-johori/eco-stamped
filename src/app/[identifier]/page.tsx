'use client'

import { useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrands, sustainableFeatureDefinitions, type SustainableBrand } from "@/lib/brands";
import { AirtableService } from '@/lib/airtableBase/service';
import { ImageGallery } from "@/components/ImageGallery";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddBrandForm } from '@/components/AddBrandForm';
import BrandSidebar from "@/components/BrandSidebar";
import ExpandableFeatures from "@/components/ExpandableFeatures";
import CustomVimeoPlayer from "@/components/CustomVimeoPlayer";
import { BrandCard } from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { 
  Sprout, Recycle, CircleDot, Leaf, Droplets, Sun, MapPin, HeartHandshake, 
  Flower2, PackageX, RefreshCw, Trees, Users, Package, ShieldCheck, Palmtree, 
  ArrowUpCircle, Palette, Hand, Heart 
} from "lucide-react";

const IconMap = {
  Sprout,      // For ORGANIC_MATERIALS
  Recycle,     // For RECYCLED_MATERIALS
  CircleDot,   // For ZERO_WASTE
  Leaf,        // For CARBON_NEUTRAL
  Droplets,    // For WATER_CONSERVATION
  Sun,         // For RENEWABLE_ENERGY
  MapPin,      // For LOCAL_PRODUCTION
  HeartHandshake, // For FAIR_TRADE
  Flower2,     // For VEGAN
  PackageX,    // For PLASTIC_FREE
  RefreshCw,   // For CIRCULAR_ECONOMY
  Trees,       // For BIODEGRADABLE
  Users,       // For ETHICAL_LABOR
  Package,     // For SUSTAINABLE_PACKAGING
  ShieldCheck, // For CHEMICAL_FREE
  Palmtree,    // For TREE_PLANTING
  ArrowUpCircle, // For UPCYCLED
  Palette,     // For NATURAL_DYES
  Hand,        // For HANDCRAFTED
  Heart,       // For CRUELTY_FREE
} as const;

const slugify = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};

interface Props {
  params: {
    identifier: string;
  };
}

export default function BrandPage({ params }: Props) {
  const { identifier } = params;
  const [brand, setBrand] = useState<SustainableBrand | null>(null);
  const [allBrands, setAllBrands] = useState<SustainableBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);

  useEffect(() => {
    const testAirtableConnection = async () => {
      try {
        const isConnected = await AirtableService.testConnection();
        console.log('Airtable connection test:', {
          success: isConnected,
          timestamp: new Date().toISOString()
        });
        return isConnected;
      } catch (error) {
        console.error('Airtable connection test failed:', error);
        return false;
      }
    };

    const fetchBrands = async () => {
      try {
        const isConnected = await testAirtableConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to Airtable');
        }

        const brands = await getBrands();
        setAllBrands(brands);
        const foundBrand = brands.find(
          (b) => slugify(b.name) === identifier || b.id === identifier
        );
        setBrand(foundBrand || null);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching brands:', {
          error,
          message: errorMessage,
          timestamp: new Date().toISOString()
        });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [identifier]);

  const relatedBrands = useMemo(() => {
    if (!brand) return [];
    
    const otherBrands = allBrands.filter(b => b.id !== brand.id);
    
    const scoredBrands = otherBrands.map(b => {
      let score = 0;
      
      const categoryMatch = b.categories.some(cat => 
        brand.categories.includes(cat));
      if (categoryMatch) score += 3;
      
      if (b.origin.country === brand.origin.country) score += 1;
      
      const currentFeatures = brand.content.sustainableFeatures.map(f => f.title);
      const commonFeatures = b.content.sustainableFeatures
        .map(f => f.title)
        .filter(f => currentFeatures.includes(f));
      score += commonFeatures.length;

      return { brand: b, score };
    });

    return scoredBrands
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.brand);
  }, [brand, allBrands]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className={`${showAddBrandForm ? 'opacity-40' : ''}`}>
          <Header 
            searchQuery={''} 
            onSearchChange={(value: string) => {
              console.log('Search value:', value);
            }}
            showAddBrandForm={showAddBrandForm}
            onShowAddBrandForm={setShowAddBrandForm}
          />
    
          <div className="pt-24 pb-16">
            <div className="px-4 sm:px-40">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 shimmer rounded-xl mb-4" />
                <div className="text-center">
                  <div className="h-8 w-64 shimmer rounded-full mx-auto" />
                  <div className="h-4 w-48 shimmer rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddBrandForm
          isOpen={showAddBrandForm}
          onClose={() => setShowAddBrandForm(false)}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            setShowAddBrandForm(false);
          }}
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-2">Error Loading Brands</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  if (!brand) {
    notFound();
  }

  const hasCategories = brand.categories?.length > 0;
  const hasAbout = brand.content?.about;
  const hasImages = brand.images?.length > 0;
  const hasImpact = brand.content?.impact;
  const hasSustainableFeatures = brand.content?.sustainableFeatures?.length > 0;
  const hasSidebarContent = brand.founder?.length > 0 || brand.workforce || brand.origin?.city || 
    brand.origin?.country || brand.businessStartDate || brand.productRange?.length > 0 || 
    brand.certifications?.length > 0 || brand.retailers?.length > 0;
  const hasRelatedBrands = relatedBrands.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className={`${showAddBrandForm ? 'opacity-50' : ''}`}>
        <Header 
          searchQuery={''} 
          onSearchChange={(value: string) => {
            console.log('Search value:', value);
          }}
          showAddBrandForm={showAddBrandForm}
          onShowAddBrandForm={setShowAddBrandForm}
        />

        <div className="pt-24 pb-16">
          <div className="px-4 sm:px-40">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white border border-border/50 rounded-xl mb-4 overflow-hidden">
                {brand.logo ? (
                  <Image 
                    src={brand.logo}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-medium text-neutral-400">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-4xl font-bold text-foreground">{brand.name}</div>
                {hasCategories && (
                  <div className="mt-0">
                    <span className="text-sm sm:text-base text-muted-foreground leading-none">
                      {brand.categories.map((category, index) => (
                        <span key={category}>
                          {category}
                          {index < brand.categories.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {hasAbout && (
              <div className="w-full sm:max-w-[50%] space-y-2 mx-auto text-center">
                <div>
                  <div className={`text-sm sm:text-base text-foreground ${!isExpanded ? 'line-clamp-3 sm:line-clamp-2' : ''}`}>
                    {brand.content.about}
                  </div>
                  {!isExpanded && brand.content.about.split(' ').length > 30 && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium mt-0.5"
                    >
                      More
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium mt-1"
                    >
                      Less
                    </button>
                  )}
                </div>
                
                <div className="flex justify-center gap-4 pt-3">
                  {brand.url && (
                    <Button variant="secondary" size="sm" className="flex items-center gap-2 rounded-full">
                      <a href={brand.url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" className="rounded-full">
                    Share
                  </Button>
                </div>
              </div>
            )}

            {hasImages && (
              <div className="mt-8">
                <ImageGallery 
                  images={brand.images} 
                  brandName={brand.name}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mt-8">
              <div className="lg:col-span-8">
                {/* Mobile-only Sidebar */}
                {hasSidebarContent && (
                  <div className="block lg:hidden mb-8">
                    <BrandSidebar 
                      founder={brand.founder}
                      workforce={brand.workforce}
                      origin={brand.origin}
                      businessStartDate={brand.businessStartDate}
                      productRange={brand.productRange}
                      certifications={brand.certifications}
                      retailers={brand.retailers}
                      url={brand.url}
                    />
                  </div>
                )}

                <div className="space-y-8 sm:space-y-16">
                  {hasImpact && (
                    <div>
                      <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-foreground">Impact</div>
                      <div className="text-sm sm:text-base text-foreground">
                        {brand.content.impact}
                      </div>
                    </div>
                  )}

                  {hasImpact && hasSustainableFeatures && (
                    <div className="h-px w-full bg-border" />
                  )}

                  {hasSustainableFeatures && (
                    <div className="space-y-4">
                      <div className="text-lg sm:text-xl font-semibold mb-4 sm:mb-8 text-foreground">
                        What makes this brand sustainable
                      </div>
                      <ExpandableFeatures 
                        features={brand.content.sustainableFeatures}
                        IconMap={IconMap}
                        sustainableFeatureDefinitions={sustainableFeatureDefinitions}
                      />
                    </div>
                  )}

                  {hasSustainableFeatures && brand.brandVideo && (
                    <div className="h-px w-full bg-border" />
                  )}

                  {brand.brandVideo && (
                    <div>
                      <div className="text-lg sm:text-xl font-semibold mb-4 sm:mb-8 text-foreground">Brand Story</div>
                      <div className="h-full rounded-xl overflow-hidden">
                        <CustomVimeoPlayer vimeoUrl={brand.brandVideo} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop-only Sidebar */}
              {hasSidebarContent && (
                <div className="hidden lg:block lg:col-span-4">
                  <BrandSidebar 
                    founder={brand.founder}
                    workforce={brand.workforce}
                    origin={brand.origin}
                    businessStartDate={brand.businessStartDate}
                    productRange={brand.productRange}
                    certifications={brand.certifications}
                    retailers={brand.retailers}
                    url={brand.url}
                  />
                </div>
              )}
            </div>

            {hasRelatedBrands && (
              <div className="mt-8 sm:mt-16">
                <div className="h-px w-full bg-border" />
                <div className="mt-8 sm:mt-16">
                  <div className="text-lg sm:text-xl font-semibold mb-4 sm:mb-8 text-foreground">
                    Explore other sustainable brands
                  </div>
                  {/* Desktop/Tablet view */}
                  <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 hidden">
                    {relatedBrands.map((relatedBrand) => (
                      <div key={relatedBrand.id}>
                        <BrandCard 
                          brand={relatedBrand} 
                          onClick={() => {
                            const brandIdentifier = slugify(relatedBrand.name);
                            window.location.href = `/${brandIdentifier}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile horizontal scroll */}
                  <div className="sm:hidden">
                    <div 
                      className="flex overflow-x-auto no-scrollbar -mx-4 px-4 gap-4 pb-4"
                      style={{ 
                        scrollBehavior: 'smooth',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                      }}
                    >
                      {relatedBrands.map((relatedBrand) => (
                        <div 
                          key={relatedBrand.id} 
                          className="flex-none w-[75%]"
                        >
                          <BrandCard 
                            brand={relatedBrand} 
                            onClick={() => {
                              const brandIdentifier = slugify(relatedBrand.name);
                              window.location.href = `/${brandIdentifier}`;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer onShowAddBrandForm={setShowAddBrandForm} />
      </div>

      <AddBrandForm
        isOpen={showAddBrandForm}
        onClose={() => setShowAddBrandForm(false)}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          setShowAddBrandForm(false);
        }}
      />
    </div>
  );
}
