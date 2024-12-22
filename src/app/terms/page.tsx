'use client'

// src/app/terms/page.tsx
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useState } from 'react'

export default function TermsOfService() {
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);

  return (
    <>
      <Header 
        searchQuery="" 
        onSearchChange={() => {}} 
        showAddBrandForm={false} 
        onShowAddBrandForm={() => {}}
      />
      <main className="max-w-3xl mx-auto px-8 py-72">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-12 font-medium">Last updated: December 22, 2024</p>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
            <p className="mb-4">
              Eco Stamped is a Bangalore-based sustainable brands directory that showcases verified 
              sustainable brands in India. Operating as an individual-owned platform, we are dedicated 
              to promoting sustainable shopping options by providing reliable, curated information 
              about environmentally conscious brands.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Service Description</h2>
            <p className="mb-4">
              Our platform provides a comprehensive sustainable brand directory, featuring detailed 
              sustainability information, brand stories, and regular newsletters about sustainable 
              shopping. We maintain a careful verification process for all listed brands and provide 
              a submission system for new sustainable brands to be considered for inclusion.
            </p>
            <p className="mb-4">
              Each brand profile in our directory includes comprehensive information about the company's 
              sustainability journey. This includes their history, founding details, product ranges, 
              sustainability certifications, and environmental practices. We also include product images 
              and embedded media content to provide a complete picture of each brand's commitment to 
              sustainability.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Brand Listings and Content</h2>
            <p className="mb-4">
              We maintain high standards for our directory through careful verification and regular 
              updates. While we strive for accuracy in all listings, we encourage users to verify 
              critical information directly with brands, as practices and details may change over time.
            </p>
            <p className="mb-4">
              Our content structure reflects various ownership rights. Product images and brand names 
              belong to their respective companies, embedded content remains the property of original 
              creators, and the Eco Stamped content curation and presentation represent our intellectual 
              property.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Brand Rights and Responsibilities</h2>
            <p className="mb-4">
              Featured brands maintain certain rights and responsibilities regarding their listings. 
              We respect their right to request information updates or removal, and we expect brands 
              to maintain accurate sustainability claims. Our platform serves as a bridge between 
              sustainable brands and conscious consumers, built on trust and accuracy.
            </p>
            <h3 className="text-base font-semibold mb-3">Brand Rights</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Request updates to their information</li>
              <li>Submit additional content or clarifications</li>
              <li>Request removal from the directory</li>
              <li>Report inaccuracies in their listing</li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">User Submissions</h2>
            <p className="mb-4">
              When submitting brands for consideration, users must provide accurate information and 
              have the authority to share such information. We maintain a thorough verification process 
              for all submissions and reserve the right to decline listings that don't meet our 
              sustainability criteria.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Acceptable Use</h2>
            <p className="mb-4">
              Users of our platform must not submit false information, misrepresent brands, copy 
              directory data, or attempt to damage or disrupt our services. Any violation of these 
              terms may result in appropriate legal action.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Disclaimers and Liability</h2>
            <p className="mb-4">
              We provide our directory service "as is" without warranty of completeness or endorsement 
              of listed brands. While we strive for accuracy, we cannot guarantee the ongoing accuracy 
              of sustainability claims or brand practices. We are not liable for brand product quality, 
              information accuracy, or changes in brand practices.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
            <p className="mb-4">
              We may update these terms to reflect service improvements or legal requirements. 
              Significant changes will be posted on this page with an updated revision date. 
              Continued use of our service following such changes constitutes acceptance of 
              the updated terms.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-4">
              For questions about these Terms, please contact us at{' '}
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
