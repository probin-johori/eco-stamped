'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { SustainableBrand } from '@/lib/brands'

interface BrandCardProps {
    brand: SustainableBrand;
    onClick?: () => void;
    isPriority?: boolean;
    index?: number;
}

const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
};

export const BrandCard = ({ 
    brand, 
    onClick, 
    isPriority = false,
    index = 0 
}: BrandCardProps) => {
    const [coverError, setCoverError] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const detailsPath = `/${slugify(brand.name)}`;

    // Determine loading strategy based on index
    const loadingStrategy = index < 4 ? "eager" : "lazy";
    const shouldPrioritize = isPriority || index < 2;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div className="w-full h-full" style={{ contain: 'content' }}>
            <Link
                href={detailsPath}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl block h-full"
                onClick={handleClick}
            >
                <Card className="relative rounded-3xl border-0 overflow-hidden h-full">
                    {brand.isCuratorsPick && (
                        <div className="absolute top-3 left-3 z-10" style={{ contentVisibility: 'auto' }}>
                            <div className="bg-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                                <span className="text-foreground">Eco Champion</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Main image container with fixed aspect ratio */}
                    <div className="relative aspect-square w-full bg-neutral-50" style={{ contain: 'layout' }}>
                        {brand.cover && !coverError ? (
                            <Image
                                src={brand.cover}
                                alt={`${brand.name} banner`}
                                fill
                                loading={loadingStrategy}
                                quality={75}
                                priority={shouldPrioritize}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 sm:group-hover:scale-105"
                                onError={() => setCoverError(true)}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHyAiIB0gICAuICYmJy4mICYmKDEsJicxKCg0LSY/OTExP0dHR2NfYl9jOTj/2wBDARUXFx4YHh8fHh4oJSU6Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                <span className="text-neutral-700">{brand.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Brand info container with fixed positioning */}
                    <div className="absolute left-3 right-3 bottom-3" style={{ contain: 'content' }}>
                        <div className="bg-white rounded-full w-full">
                            <div className="flex items-center p-2 gap-2">
                                {/* Logo container with fixed dimensions */}
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-neutral-100 rounded-full overflow-hidden">
                                    {brand.logo && !logoError ? (
                                        <Image
                                            src={brand.logo}
                                            alt={`${brand.name} logo`}
                                            width={40}
                                            height={40}
                                            loading={loadingStrategy}
                                            className="object-contain"
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xs text-neutral-700">
                                                {brand.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Text content with proper truncation */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 truncate">
                                        {brand.name}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {brand.categories.join(', ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default BrandCard;
