'use client'

import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddBrandForm } from '@/components/AddBrandForm';
import {
  Heart,
  Sprout,
  Users,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do you verify sustainable brands?",
    answer: "We have a comprehensive verification process that evaluates multiple aspects of sustainability including materials used, production processes, labor practices, and environmental impact. We review certifications, documentation, and company practices before listing any brand."
  },
  {
    question: "Can I submit my brand for listing?",
    answer: "Yes! We welcome submissions from sustainable brands. Click the &apos;Add Brand&apos; button in the header to start the submission process. We&apos;ll review your application and get back to you within 5-7 business days."
  },
  {
    question: "What criteria do you use to evaluate sustainability?",
    answer: "We evaluate brands based on multiple criteria including use of eco-friendly materials, sustainable production processes, fair labor practices, transparency, certifications, and overall environmental impact. Brands must demonstrate commitment to sustainability across their operations."
  },
  {
    question: "Is listing on your platform free?",
    answer: "Yes, listing your sustainable brand on our platform is completely free. Our mission is to promote and support sustainable businesses without any barriers to entry."
  },
  {
    question: "How can I report incorrect information?",
    answer: "If you notice any incorrect information about a brand, please contact us through our support channel. We take accuracy seriously and will review and update information promptly."
  }
];

export default function AboutPage() {
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      <div className={`${showAddBrandForm ? 'opacity-40' : ''}`}>
        <Header 
          searchQuery={''} 
          onSearchChange={() => {}}
          showAddBrandForm={showAddBrandForm}
          onShowAddBrandForm={setShowAddBrandForm}
        />

        <main className="pt-24 pb-16">
          <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-foreground mb-6">
                Empowering India&apos;s Sustainable Future
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;re building India&apos;s most comprehensive directory of sustainable brands, 
                making it easier for conscious consumers to discover and support 
                eco-friendly businesses.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Target className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Our Mission</h2>
                </div>
                <p className="text-foreground">
                  To accelerate India&apos;s transition to sustainable consumption by connecting 
                  conscious consumers with ethical brands. We believe in making sustainable 
                  choices accessible and transparent for everyone.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Our Vision</h2>
                </div>
                <p className="text-foreground">
                  To create a future where sustainable business practices are the norm, 
                  not the exception. We envision a thriving ecosystem where ethical 
                  brands can flourish and inspire positive change.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-20">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                  <Heart className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Authenticity</h3>
                  <p className="text-sm text-muted-foreground">
                    We verify and showcase brands that genuinely prioritize sustainability
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                  <Sprout className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Environmental Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    We promote practices that protect and restore our planet
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    We build connections between conscious consumers and ethical brands
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    We provide clear, honest information about sustainability practices
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-20">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50"
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 py-4 bg-muted/25 border-t border-border">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

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
