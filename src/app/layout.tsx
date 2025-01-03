import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
 metadataBase: new URL('https://ecostamped.com'),
 title: {
   default: "Eco Stamped",
   template: "%s | Eco Stamped"
 },
 description: "Your curated directory of India's eco-conscious brands, champions, and artisans making tomorrow's India possible today",
 keywords: ["sustainable", "eco-friendly", "Indian brands", "artisans", "eco-conscious"],
 authors: [{ name: "Eco Stamped" }],
 creator: "Eco Stamped",
 publisher: "Eco Stamped",
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
   title: 'Eco Stamped | Brand Directory for everything sustainable',
   description: 'Your curated directory of India\'s eco-conscious brands, champions, and artisans making tomorrow\'s India possible today',
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
 },
 twitter: {
   card: 'summary_large_image',
   title: 'Eco Stamped',
   description: 'Your curated directory of India\'s eco-conscious brands',
   images: ['/og-preview.png'],
 }
};

export const viewport = {
 themeColor: '#ffffff',
 width: 'device-width',
 initialScale: 1,
 maximumScale: 5,
};

export default function RootLayout({
 children,
 modal
}: {
 children: ReactNode;
 modal: ReactNode;
}) {
 return (
   <html
     lang="en"
     className={`${geistSans.variable} ${geistMono.variable}`}
     suppressHydrationWarning
   >
     <head>
       <link rel="preconnect" href="https://eco-stamped.vercel.app" crossOrigin="anonymous" />
       <link rel="preconnect" href="https://va.vercel-analytics.com" crossOrigin="anonymous" />
     </head>
     <body className="font-sans antialiased">
       <QueryProvider>
         {children}
         {modal}
       </QueryProvider>
       <Analytics />
       <SpeedInsights />
     </body>
   </html>
 );
}
