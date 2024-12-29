import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { DetailedHTMLProps, HtmlHTMLAttributes } from 'react';

declare module 'react' {
  interface IntrinsicElements {
    html: DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
  }
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Eco Stamped",
  description: "Your curated directory of Indias eco-conscious brands, champions, and artisans making tomorrows India possible today",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Eco Stamped | Brand Directory for everthing sustainable',
    description: 'Your curated directory of Indias eco-conscious brands, champions, and artisans making tomorrows India possible today',
    url: 'https://ecostamped.com',
    siteName: 'Eco Stamped',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Eco Stamped - Discover Sustainable Brands',
      }
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://eco-stamped.vercel.app" crossOrigin="anonymous" />
        <link rel="preload" href="globals.css" as="style" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
