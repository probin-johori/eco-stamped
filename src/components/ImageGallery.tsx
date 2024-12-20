'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Grid } from 'lucide-react';
import { type BrandImage } from '@/lib/brands';

interface ImageGalleryProps {
  images: BrandImage[];
  brandName: string;
}

export function ImageGallery({ images, brandName }: ImageGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState(0);
  const [loadedMainImage, setLoadedMainImage] = useState(false);
  const fullscreenThumbnailsRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);

  const getImagePath = (image: BrandImage) => {
    if (!image?.url) return '';
    return image.url.replace('/brands/', '/brandimages/');
  };

  const scrollToFullscreenThumbnail = (index: number) => {
    if (fullscreenThumbnailsRef.current) {
      const thumbnail = fullscreenThumbnailsRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        const containerWidth = fullscreenThumbnailsRef.current.clientWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.clientWidth;
        const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        fullscreenThumbnailsRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  const handleMobileScroll = () => {
    if (mobileScrollContainerRef.current) {
      const container = mobileScrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);
      if (newIndex !== currentFullscreenIndex) {
        setCurrentFullscreenIndex(newIndex);
      }
    }
  };

  const renderMedia = (index: number, isFullscreen: boolean = false) => {
    const image = images[index];
    if (!image) return null;
    
    return (
      <>
        {(!loadedMainImage && index === 0) && (
          <div className="absolute inset-0 w-full h-full shimmer" />
        )}
        <Image
          src={getImagePath(image)}
          alt={`${brandName} - Image ${index + 1}`}
          fill
          className={`${isFullscreen ? 'object-contain' : 'object-cover'} ${index === 0 && !loadedMainImage ? 'opacity-0' : 'transition-opacity duration-200'}`}
          priority={index === 0}
          onLoad={() => {
            if (index === 0) setLoadedMainImage(true);
          }}
        />
      </>
    );
  };

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';

      // Scroll main image
      if (mobileScrollContainerRef.current) {
        const container = mobileScrollContainerRef.current;
        container.scrollLeft = currentFullscreenIndex * container.clientWidth;
      }

      // Auto scroll thumbnail into view
      const thumbnailContainer = document.querySelector('.thumbnail-scroll');
      const activeThumb = thumbnailContainer?.children[currentFullscreenIndex] as HTMLElement;
      if (thumbnailContainer && activeThumb) {
        const scrollLeft = activeThumb.offsetLeft - (thumbnailContainer.clientWidth / 2) + (activeThumb.clientWidth / 2);
        thumbnailContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [currentFullscreenIndex, isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowRight':
          if (currentFullscreenIndex < images.length - 1) {
            setCurrentFullscreenIndex(prev => prev + 1);
          }
          break;
        case 'ArrowLeft':
          if (currentFullscreenIndex > 0) {
            setCurrentFullscreenIndex(prev => prev - 1);
          }
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentFullscreenIndex, images.length]);

  if (!images || images.length === 0) {
    return null;
  }
  return (
    <>
      <div className="relative">
        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-5 gap-2 p-1 mb-3">
          <div className="col-span-3 relative aspect-auto">
            <button 
              className="w-full h-full relative group focus:outline-none focus-visible:ring-2 
                focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl overflow-hidden"
              onClick={() => {
                setCurrentFullscreenIndex(0);
                setIsFullscreen(true);
              }}
            >
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                {renderMedia(0)}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
            </button>
          </div>

          <div className="col-span-2 grid grid-rows-2 grid-cols-2 gap-2">
            {[...Array(4)].map((_, index) => {
              const mediaIndex = index + 1;
              if (mediaIndex >= images.length) {
                return <div key={index} className="aspect-square bg-neutral-100 rounded-xl" />;
              }
              
              return (
                <div key={index} className="aspect-square relative">
                  <button 
                    className="w-full h-full relative group focus:outline-none focus-visible:ring-2 
                      focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl overflow-hidden"
                    onClick={() => {
                      setCurrentFullscreenIndex(mediaIndex);
                      setIsFullscreen(true);
                    }}
                  >
                    {renderMedia(mediaIndex)}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto scrollbar-none -mx-4 px-4 gap-1"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
            {images.map((_, index) => (
              <div 
                key={index} 
                className="flex-none w-full first:pl-0"
              >
                <div className="pr-1">
                  <button 
                    className="relative aspect-[4/3] w-full rounded-xl overflow-hidden focus:outline-none 
                      focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => {
                      setCurrentFullscreenIndex(index);
                      setIsFullscreen(true);
                    }}
                  >
                    {renderMedia(index)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className="absolute right-4 bottom-6 flex items-center gap-2 px-4 py-2 bg-white/90 
            rounded-full shadow-md hover:bg-white transition-colors focus:outline-none 
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Grid className="w-4 h-4" />
          <span className="text-sm font-medium">Gallery</span>
        </button>
      </div>

      {/* Fullscreen gallery modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <span className="text-white/80 text-sm">
              {currentFullscreenIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full hover:bg-black/75 focus:outline-none"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Mobile fullscreen layout */}
          <div className="sm:hidden flex flex-col h-full">
            {/* Main image scroll container */}
            <div className="flex-1">
              <div className="h-[50vh] overflow-hidden">
                <div 
                  ref={mobileScrollContainerRef}
                  className="flex h-full w-full overflow-x-auto scrollbar-none"
                  style={{ 
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  onScroll={handleMobileScroll}
                >
                  {images.map((_, index) => (
                    <div 
                      key={index} 
                      className="flex-none w-full h-full"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="h-full relative">
                        {renderMedia(index, true)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description and thumbnails */}
            <div className="p-4 bg-black/75">
              <p className="text-white/90 text-sm mb-8 text-center">
                {images[currentFullscreenIndex]?.description}
              </p>
              
              {/* Thumbnails row */}
              <div className="px-0">
                <div 
                  className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2 thumbnail-scroll"
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Update current index
                        setCurrentFullscreenIndex(index);

                        // Scroll main image
                        if (mobileScrollContainerRef.current) {
                          const container = mobileScrollContainerRef.current;
                          container.scrollLeft = index * container.clientWidth;
                        }

                        // Scroll thumbnail into view
                        const button = document.activeElement as HTMLButtonElement;
                        if (button) {
                          const parent = button.parentElement;
                          if (parent) {
                            const scrollLeft = button.offsetLeft - (parent.clientWidth / 2) + (button.clientWidth / 2);
                            parent.scrollTo({
                              left: scrollLeft,
                              behavior: 'smooth'
                            });
                          }
                        }
                      }}
                      className={`relative h-14 aspect-square flex-shrink-0 rounded-lg overflow-hidden 
                        transition-all duration-200 ${
                        index === currentFullscreenIndex 
                          ? 'ring-2 ring-white scale-105' 
                          : 'opacity-50 hover:opacity-70'
                      }`}
                    >
                      {renderMedia(index)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop fullscreen layout - unchanged */}
          <div className="hidden sm:flex flex-1 flex-col">
            <div className="flex-1 relative py-8">
              {currentFullscreenIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentFullscreenIndex(prev => prev - 1);
                  }}
                  className="absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 
                    hover:bg-black/75 z-10 focus:outline-none focus-visible:ring-2 
                    focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
              )}

              <div className="h-full flex items-center px-20">
                <div className="mx-auto flex w-[calc(100%-8rem)]">
                  <div className="relative rounded-lg overflow-hidden w-[70%] h-[70vh]">
                    {renderMedia(currentFullscreenIndex, true)}
                  </div>

                  <div className="flex-1 flex items-center ml-8">
                    <div className="w-full rounded-lg p-6">
                      <p className="text-white/90 text-sm">
                        {images[currentFullscreenIndex]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {currentFullscreenIndex < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentFullscreenIndex(prev => prev + 1);
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 
                    hover:bg-black/75 z-10 focus:outline-none focus-visible:ring-2 
                    focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              )}
            </div>

            <div className="p-4 flex justify-center">
              <div 
                ref={fullscreenThumbnailsRef}
                className="flex gap-2 p-2 bg-neutral-800 rounded-2xl overflow-x-auto scroll-smooth scrollbar-none"
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFullscreenIndex(index)}
                    className={`relative h-16 aspect-square flex-shrink-0 rounded-lg overflow-hidden 
                      transition-all duration-200 focus:outline-none focus-visible:ring-2 
                      focus-visible:ring-primary focus-visible:ring-offset-2 
                      focus-visible:ring-offset-neutral-800 ${
                      index === currentFullscreenIndex 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-800 scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {renderMedia(index)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
