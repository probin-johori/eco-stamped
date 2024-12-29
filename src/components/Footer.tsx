"use client"
import { Button } from "@/components/ui/button";
import { Instagram, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Footer = ({ onShowAddBrandForm }: { onShowAddBrandForm: (show: boolean) => void }) => {
  return (
    <footer className="bg-background w-full">
      <div className="w-full">
        {/* Main Content Section */}
        <div className="py-24 px-4 sm:px-10 lg:px-20">
          <div className="flex flex-col items-center justify-center gap-16 pb-6">
            {/* Signature */}
            <div className="w-full flex justify-center">
              <Image
                src="https://xntdrrorftkvvgelstgs.supabase.co/storage/v1/object/public/brand-assets/covers/ecostampedlogo.svg?t=2024-12-29T00%3A56%3A43.309Z"
                alt="Eco Stamped Signature"
                width={240}
                height={80}
                className="object-contain"
              />
            </div>
            {/* Description */}
            <div className="w-full md:w-[40%] space-y-6 text-center">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                In the heart of a changing India, we're the storytellers of sustainability. Eco Stamped maps the constellation of conscious brands, each certification a star guiding us toward a greener horizon. From artisanal workshops to innovative labs, we unite the pioneers crafting tomorrow's essentials—mindfully made, earth-approved.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Your choices ripple through our shared ecosystem. Join us in painting a vibrant future where every purchase plants seeds of change, and every brand tells a story of hope.
              </p>
            </div>
            {/* CTA Section */}
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground mb-4">
                Discovered a mindful brand? Help us showcase them
              </h3>
              <Button
                className="rounded-full px-8"
                onClick={() => onShowAddBrandForm(true)}
              >
                Add Brand
              </Button>
            </div>
          </div>
        </div>
        {/* Border */}
        <div className="border-t border-border" />
        {/* Links Section - Updated Layout */}
        <div className="py-6 px-4 sm:px-10 lg:px-20">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Legal Links - Left */}
              <div className="flex items-center gap-6 order-2 sm:order-1">
                <Link href="/terms" className="text-sm text-foreground hover:underline">Terms</Link>
                <Link href="/privacy" className="text-sm text-foreground hover:underline">Privacy</Link>
              </div>
              {/* Copyright - Center */}
              <div className="text-sm text-muted-foreground order-1 sm:order-2">
                © 2024 Eco Stamped
              </div>
              {/* Social Icons - Right */}
              <div className="flex items-center gap-6 order-3">
                <Link
                  href="https://instagram.com/ecostamped.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/80"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:connect@sustainablebrands.in"
                  className="text-foreground hover:text-foreground/80"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
