import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Package,
  Sun,
  ShieldCheck,
  LampDesk,
  User
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

// Helper function to format certification values
const formatCertification = (cert: Certification): string => {
  return cert.toString();  // Return the value directly since it's already in the correct format
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
        {founder.map((founder) => (
  <div key={founder.name} className="flex gap-3">
    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
      {founder.imageUrl && founder.imageUrl !== '/placeholder-founder.jpg' ? (
        <Image
          src={founder.imageUrl}
          alt={founder.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
    </div>
    <div>
      <div className="text-sm text-muted-foreground mb-0.5">Founder</div>
      <div className="text-sm font-medium text-foreground">{founder.name}</div>
    </div>
  </div>
))}

        {workforce && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <LampDesk strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">Workforce</div>
                <div className="text-sm font-medium text-foreground">{workforce.description}</div>
              </div>
            </div>
          </>
        )}

        {(origin.city || origin.country) && (
          <>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <MapPin strokeWidth={1.5} className="w-6 h-6" />
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

        {businessStartDate && (
          <div className="flex gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Sun strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-0.5">Launched</div>
              <div className="text-sm font-medium text-foreground">{businessStartDate}</div>
            </div>
          </div>
        )}

        {productRange.length > 0 && (
          <div className="flex gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Package strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-0.5">Product Range</div>
              <div className="text-sm font-medium text-foreground">{productRange.join(", ")}</div>
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="flex gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <ShieldCheck strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-0.5">Certifications</div>
              <div className="text-sm font-medium text-foreground">
                {certifications.map(cert => formatCertification(cert)).join(", ")}
              </div>
            </div>
          </div>
        )}

        {retailers.length > 0 && (
  <>
    <div className="h-px w-full bg-border" />
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Retailers</div>
      <div className="grid grid-cols-2 gap-2">
        {retailers.map(({ marketplace, url }) => (
          <Link
            key={marketplace}
            href={url || '#'}
            target="_blank"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground rounded-xl p-2 transition-colors"
          >
            <div className="w-5 h-5 relative flex-shrink-0">
              <Image
                src={`/logos/${marketplace.toLowerCase()}.svg`}
                alt={marketplace}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="truncate">{marketplace}</span>
          </Link>
        ))}
      </div>
    </div>
  </>
)}
      </div>
    </Card>
  );
};

export default BrandSidebar;
