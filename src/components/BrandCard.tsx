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
}

const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
};

export const BrandCard = ({ brand, onClick, isPriority = false }: BrandCardProps) => {
    const [coverError, setCoverError] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const detailsPath = `/${slugify(brand.name)}`;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div className="relative w-full">
            <Link
                href={detailsPath}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl block"
                onClick={handleClick}
            >
                <Card className="relative rounded-3xl border-0 overflow-hidden">
                    {brand.isCuratorsPick && (
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                                <span className="text-foreground">Eco Champion</span>
                            </div>
                        </div>
                    )}
                    <div className="relative w-full pt-[100%]">
                        <div className="absolute inset-0 w-full h-full bg-neutral-50">
                            {brand.cover && !coverError ? (
                                <Image
                                    src={brand.cover}
                                    alt={`${brand.name} banner`}
                                    fill
                                    quality={85}
                                    priority={isPriority}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 sm:hover:scale-105"
                                    onError={() => setCoverError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                    <span className="text-neutral-400">{brand.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-x-3 bottom-3">
                            <div className="bg-white rounded-full">
                                <div className="flex items-center justify-center p-2 gap-2">
                                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-neutral-100 rounded-full overflow-hidden">
                                        {brand.logo && !logoError ? (
                                            <Image
                                                src={brand.logo}
                                                alt={`${brand.name} logo`}
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                                onError={() => setLogoError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs text-neutral-400">
                                                    {brand.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="font-semibold text-sm text-gray-900 truncate" style={{ lineHeight: '20px' }}>
                                            {brand.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate" style={{ lineHeight: '18px' }}>
                                            {brand.categories.join(', ')}
                                        </div>
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
