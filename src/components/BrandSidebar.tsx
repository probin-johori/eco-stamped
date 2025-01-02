'use client'

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Package,
  Sun,
  ShieldCheck,
  LampDesk,
  User,
  Store
} from "lucide-react";
import { Certification, MarketplaceAvailability, Founder, Workforce, BrandOrigin } from '@/lib/brands';

type BrandSidebarProps = {
  founder: Founder[];
  workforce?: Workforce;
  origin: BrandOrigin;
  businessStartDate: string;
  productRange: string[];
  certifications: Certification[];
  retailers: MarketplaceAvailability[];
  url: string;
};

const FounderImage = ({ founder }: { founder: Founder }) => {
  const [error, setError] = useState(false);

  if (error || !founder.imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <User className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={founder.imageUrl}  // Use the full URL directly from Airtable
      alt={founder.name}
      fill
      sizes="40px"
      className="object-cover"
      loading="eager"
      onError={() => setError(true)}
    />
  );
};

const BrandSidebar = ({
  founder,
  workforce,
  origin,
  businessStartDate,
  productRange,
  certifications,
  retailers,
}: BrandSidebarProps) => {
  return (
    <Card className="p-4 sm:p-6 rounded-3xl shadow-none">
      <div className="space-y-4">
        {/* Founder Section */}
        {founder.map((founderItem) => (
          <div key={founderItem.name} className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
              <FounderImage founder={founderItem} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-0.5">Founder</div>
              <div className="text-sm font-medium text-foreground">{founderItem.name}</div>
            </div>
          </div>
        ))}

        {/* Workforce Section */}
        {workforce && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <LampDesk strokeWidth={1.5} className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Workforce</div>
                <div className="text-sm font-medium text-foreground">{workforce.description}</div>
              </div>
            </div>
          </>
        )}

        {/* Origin Section */}
        {(origin.city || origin.country) && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <MapPin strokeWidth={1.5} className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Origin</div>
                <div className="text-sm font-medium text-foreground">
                  {[origin.city, origin.country].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Launch Date Section */}
        {businessStartDate && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <Sun strokeWidth={1.5} className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Launched</div>
                <div className="text-sm font-medium text-foreground">{businessStartDate}</div>
              </div>
            </div>
          </>
        )}

        {/* Product Range Section */}
        {productRange.length > 0 && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <Package strokeWidth={1.5} className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Product Range</div>
                <div className="text-sm font-medium text-foreground">{productRange.join(", ")}</div>
              </div>
            </div>
          </>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <ShieldCheck strokeWidth={1.5} className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Certifications</div>
                <div className="text-sm font-medium text-foreground">
                  {certifications.map(cert => cert.toString()).join(", ")}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Retailers Section */}
        {retailers.length > 0 && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Retailers</div>
              <div className="grid grid-cols-2 gap-2">
                {retailers.map(({ marketplace, url }) => {
                  const [logoError, setLogoError] = useState(false);
                  
                  return (
                    <Link
                      key={marketplace}
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground rounded-xl p-2 transition-colors"
                    >
                      <div className="w-5 h-5 relative flex-shrink-0">
                        {!logoError ? (
                          <Image
                            src={`/logos/${marketplace.toLowerCase()}.svg`}
                            alt={marketplace}
                            width={20}
                            height={20}
                            className="object-contain"
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <Store className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="truncate">{marketplace}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default BrandSidebar;
