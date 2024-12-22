'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useState } from 'react'

export default function PrivacyPolicy() {
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);

  return (
    <>
      <Header 
        searchQuery="" 
        onSearchChange={() => {}} 
        showAddBrandForm={false} 
        onShowAddBrandForm={() => {}}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-48 sm:py-72">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 font-medium">Last updated: December 22, 2024</p>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Who We Are</h2>
            <p className="text-sm sm:text-base mb-4">
              Eco Stamped is an individual-owned sustainable brands directory based in Bangalore, India. 
              Our mission is to curate and provide comprehensive information about sustainable brands, 
              enabling consumers to make environmentally conscious purchasing decisions.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Information We Collect and Use</h2>
            
            <h3 className="text-sm sm:text-base font-semibold mb-3">1. Brand Directory Information</h3>
            <p className="text-sm sm:text-base mb-4">
              We compile and maintain detailed information about sustainable brands through careful research 
              and verification. Our brand profiles include comprehensive details about each company's 
              sustainability journey, including their certifications, environmental initiatives, product 
              ranges, and founding history.
            </p>

            <h3 className="text-sm sm:text-base font-semibold mb-3">2. Brand Profile Components</h3>
            <ul className="text-sm sm:text-base list-disc pl-5 space-y-2 mb-4">
              <li>Company details including name, founding date, and location</li>
              <li>Sustainability certifications and environmental practices</li>
              <li>Product categories and sustainable materials used</li>
              <li>Product images from brand websites</li>
              <li>Brand stories and founding history</li>
              <li>Workforce information and ethical practices</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">User-Submitted Information</h2>
            <p className="text-sm sm:text-base mb-4">
              When someone submits a brand for consideration in our directory, we collect the submitter's 
              name and email address, along with basic information about the brand including its name 
              and website URL. This information helps us verify submissions and maintain the accuracy 
              of our directory.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Newsletter Subscription</h2>
            <p className="text-sm sm:text-base mb-4">
              For those who choose to subscribe to our newsletter, we collect email addresses and basic 
              subscription preferences. This enables us to share updates about sustainable brands, 
              directory improvements, and valuable insights about sustainable shopping.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Technical Information</h2>
            <p className="text-sm sm:text-base mb-4">
              Through our use of Vercel Analytics, we automatically collect certain technical information 
              that helps us improve our service. This includes your browser type, operating system, 
              IP address, pages visited, and access timestamps. This data helps us understand website 
              performance and enhance user experience.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Data Security</h2>
            <p className="text-sm sm:text-base mb-4">
              We implement appropriate security measures to protect your information, including secure 
              data transmission, regular security assessments, limited access to personal information, 
              and secure data storage practices.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">International Data Transfers</h2>
            <p className="text-sm sm:text-base mb-4">
              While we currently focus on India, future expansion may involve international data transfers. 
              Your information may be processed in countries with different data protection laws, but we 
              maintain appropriate safeguards to protect your privacy.
            </p>
          </section>

          <section className="mb-8 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Changes to This Policy</h2>
            <p className="text-sm sm:text-base mb-4">
              As our services evolve, we may update this policy. We will notify you of significant 
              changes through website announcements and email notifications for newsletter subscribers.
            </p>
          </section>

          <section className="mb-4 sm:mb-16">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-sm sm:text-base mb-4">
              For privacy-related questions or requests, please contact us at{' '}
              <a 
                href="mailto:contact@ecostamped.com" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                contact@ecostamped.com
              </a>. 
              We are based in Bangalore, India.
            </p>
          </section>
        </div>
      </main>
      <Footer onShowAddBrandForm={setShowAddBrandForm} />
    </>
  )
}
