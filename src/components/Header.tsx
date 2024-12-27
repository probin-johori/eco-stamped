'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrands, type SustainableBrand } from '@/lib/brands';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import Link from "next/link";

interface HeaderProps {
    className?: string;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    disableShadow?: boolean;
    showAddBrandForm: boolean;
    onShowAddBrandForm: (value: boolean) => void;
}

const slugify = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};

export function Header({
    className = "fixed top-0 left-0 right-0 bg-background z-50",
    searchQuery,
    onSearchChange,
    disableShadow = false,
    showAddBrandForm,
    onShowAddBrandForm
}: HeaderProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showHover, setShowHover] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
    const [brands, setBrands] = useState<SustainableBrand[]>([]);
    const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
    const [isLocalhost, setIsLocalhost] = useState(true);
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }, []);

    useEffect(() => {
        if (showMobileSearch) {
            lockScroll();
        } else {
            unlockScroll();
        }

        return () => {
            unlockScroll();
        };
    }, [showMobileSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && searchRef.current && 
                !dropdownRef.current.contains(event.target as Node) && 
                !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const fetchedBrands = await getBrands();
                setBrands(fetchedBrands);
            } catch (error) {
                console.error('Error fetching brands for search:', error);
            }
        };

        fetchBrands();
    }, []);

    const searchResults = brands
        .filter(brand => brand.name.toLowerCase().includes(localSearchQuery.toLowerCase()))
        .slice(0, 5);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 7);
        };

        if (!disableShadow) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [disableShadow]);

    const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setLocalSearchQuery('');
        setShowDropdown(false);
    };

    const handleCloseSearch = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setLocalSearchQuery('');
        setShowDropdown(false);
        setShowMobileSearch(false);
    };

    const MobileSearchOverlay = () => (
        <div className="fixed inset-0 z-[60]">
            <div className="fixed inset-0 min-h-screen bg-white">
                <div className="h-full">
                    <div className="px-4 pt-20 pb-2 sticky top-0 bg-white">
                        <button
                            onClick={handleCloseSearch}
                            className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                        
                        <div className="relative">
                            <Input 
                                placeholder="Search sustainable brands..." 
                                className="w-full pl-10 pr-16 h-10 rounded-full bg-muted border-0 text-base"
                                value={localSearchQuery}
                                onChange={(e) => setLocalSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            {localSearchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
    
                    <div className="px-4 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <>
                                <div className="pt-4 pb-2">
                                    <span className="text-sm text-muted-foreground block mb-0">
                                        {localSearchQuery ? 'Search results' : 'Top Sustainable Brands'}
                                    </span>
                                </div>
                                <div>
                                    {searchResults.map((brand) => (
                                        <Link 
                                            href={`/${slugify(brand.name)}`}
                                            key={brand.id}
                                            className="flex items-center gap-3 p-2 hover:bg-muted"
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setLocalSearchQuery('');
                                                setShowMobileSearch(false);
                                            }}
                                        >
                                            <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 bg-neutral-100">
                                                {brand.logo ? (
                                                    <Image
                                                        src={brand.logo}
                                                        alt={brand.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-base font-medium text-neutral-400">
                                                            {brand.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-base text-foreground">
                                                {brand.name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-40 flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">
                                    No brands found
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className={`${className} ${!disableShadow && isScrolled ? 'shadow-sm' : ''} ${showAddBrandForm ? 'relative z-[70]' : ''}`}>
                <div className="px-4 sm:px-10 lg:px-20">
                    <div className="h-16 flex items-center justify-between">
                        <div className="w-[120px] sm:w-[200px]">
                            <Link href="/" className="relative w-auto h-8">
                                <Image
                                    src="/logos/sustainable-brands.svg"
                                    alt="Sustainable Brands Logo"
                                    width={120}
                                    height={32}
                                    className="h-8 w-auto"
                                    priority
                                />
                            </Link>
                        </div>

                        <div className="hidden sm:flex flex-1 justify-center max-w-lg mx-auto">
                            <div className="relative w-full" ref={searchRef}>
                                <Input 
                                    placeholder="Search sustainable brands..." 
                                    className="w-full pl-10 pr-12 h-10 rounded-full bg-muted border-0 focus:bg-background"
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                {localSearchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                )}

                                {showDropdown && (
                                    <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-sm border border-border overflow-hidden">
                                        <div className="pt-2 pb-2 px-4">
                                            <span className="text-[12px] text-muted-foreground block mb-0">
                                                {localSearchQuery ? 'Search results' : 'Top Sustainable Brands'}
                                            </span>
                                        </div>
                                        {searchResults.length > 0 ? (
                                            <div className="px-2 pb-2">
                                                {searchResults.map((brand, index) => (
                                                    <Link 
                                                        href={`/${slugify(brand.name)}`}
                                                        key={brand.id}
                                                        className={`flex items-center gap-3 p-2 cursor-pointer rounded-md transition-colors
                                                            ${index === 0 && !showHover ? 'bg-muted' : 'hover:bg-muted'}`}
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            setLocalSearchQuery('');
                                                        }}
                                                        onMouseEnter={() => setShowHover(true)}
                                                        onMouseLeave={() => setShowHover(false)}
                                                    >
                                                        <div className="w-8 h-8 relative rounded-full overflow-hidden flex-shrink-0 bg-neutral-100">
                                                            {brand.logo ? (
                                                                <Image
                                                                    src={brand.logo}
                                                                    alt={brand.name}
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-neutral-400">
                                                                        {brand.name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-foreground">
                                                            {brand.name}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-40 flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">
                                                    No brands found
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden rounded-full"
                                onClick={() => setShowMobileSearch(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {isLocalhost && (
                                <>
                                    <Link
                                        href="/certification"
                                        className="hidden sm:block rounded-full px-3 py-2 hover:bg-muted transition-colors text-sm font-medium text-slate-800"
                                    >
                                        Certification
                                    </Link>

                                    <Link
                                        href="/about"
                                        className="hidden sm:block rounded-full px-3 py-2 hover:bg-muted transition-colors text-sm font-medium text-slate-800"
                                    >
                                        About
                                    </Link>
                                </>
                            )}

                            <Button
                                variant="default"
                                className="hidden sm:block rounded-full px-4 py-2 h-auto text-sm font-medium"
                                onClick={() => {
                                    setShowMobileSearch(false);
                                    setShowDropdown(false);
                                    setLocalSearchQuery('');
                                    onShowAddBrandForm(true);
                                }}
                            >
                                Add Brand
                            </Button>

                            <Button
                                variant="secondary"
                                size="icon"
                                className="sm:hidden rounded-full"
                                onClick={() => {
                                    setShowMobileSearch(false);
                                    setShowDropdown(false);
                                    setLocalSearchQuery('');
                                    onShowAddBrandForm(true);
                                }}
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {showMobileSearch && <MobileSearchOverlay />}
        </>
    );
}
