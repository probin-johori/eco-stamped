'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Certification {
  name: string;
  description: string;
  logo: string;
}

const certifications: Certification[] = [
  {
    name: 'LEED Certification',
    description: 'Globally recognized rating system for green buildings.',
    logo: '/logos/leed.png',
  },
  {
    name: 'Energy Star',
    description: 'Recognizes energy-efficient products and buildings.',
    logo: '/logos/energy-star.png',
  },
  {
    name: 'Fair Trade Certified',
    description: 'Ensures fair wages, safe working conditions, and sustainability.',
    logo: '/logos/fair-trade.png',
  },
  {
    name: 'Forest Stewardship Council (FSC)',
    description: 'Promotes responsible management of forests.',
    logo: '/logos/fsc.png',
  },
];

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery="" 
        onSearchChange={() => {}}
        showAddBrandForm={false}
        onShowAddBrandForm={() => {}}
      />
      <main className="pt-24 pb-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Certifications for a Sustainable Future
            </h1>
            <p className="text-l text-muted-foreground max-w-3xl mx-auto">
              Explore certifications that ensure eco-friendly, ethical, and sustainable practices across industries.
            </p>
          </div>

          {/* Certifications List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-card shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Logo */}
                <div className="mb-6 relative h-16 w-16">
                  <Image
                    src={cert.logo}
                    alt={`${cert.name} logo`}
                    fill
                    className="object-contain"
                    priority={index < 4}
                  />
                </div>

                {/* Certification Name */}
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {cert.name}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4">
                  {cert.description}
                </p>

                {/* Learn More Link */}
                <Button variant="link" className="text-primary">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer onShowAddBrandForm={() => {}} />
    </div>
  );
}
