'use client';

import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-muted-foreground mb-6">The brand you're looking for doesn't exist.</p>
        <a href="/" className="text-primary hover:text-primary/80">
          Return Home
        </a>
      </div>
    </div>
  );
}
