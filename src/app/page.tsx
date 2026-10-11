'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BadgeStudio, type BadgeConfig } from '@/components/BadgeStudio';
import { DynamicBadgesSection } from '@/components/DynamicBadgesSection';
import { ApiDocsSection } from '@/components/ApiDocsSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [selectedPreset, setSelectedPreset] = useState<Partial<BadgeConfig> | undefined>(undefined);

  const handleSelectPreset = (preset: {
    label: string;
    status: string;
    color: string;
    logo: string;
    style?: string;
  }) => {
    setSelectedPreset({
      label: preset.label,
      status: preset.status,
      color: preset.color,
      logo: preset.logo,
      style: (preset.style as BadgeConfig['style']) || 'pro',
    });

    // Scroll to studio smoothly
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] bg-grid-pattern text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main className="flex-1">
        <Hero onSelectPreset={handleSelectPreset} />
        <BadgeStudio
          key={`${selectedPreset?.label ?? 'default'}-${selectedPreset?.status ?? ''}`}
          initialConfig={selectedPreset}
        />
        <DynamicBadgesSection />
        <ApiDocsSection />
      </main>
      <Footer />
    </div>
  );
}
