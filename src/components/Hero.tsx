'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { generateBadgeSvg } from '@/lib/svg-engine';

interface PresetItem {
  label: string;
  status: string;
  color: string;
  logo: string;
  labelColor?: string;
  style?: string;
}

export const HERO_PRESETS: PresetItem[] = [
  { label: 'Deno', status: '^1.40.0', color: '#111317', logo: 'deno', style: 'pro' },
  { label: 'Docker', status: 'ready', color: '#007ec6', logo: 'docker', style: 'pro' },
  { label: 'lefthook', status: 'enabled', color: '#3fb950', logo: 'lefthook', style: 'pro' },
  { label: 'CodeQL', status: 'passing', color: '#2ea44f', logo: 'github', style: 'pro' },
  { label: 'Code License', status: 'GPLv3', color: '#0969da', logo: '', style: 'pro' },
  { label: 'Text License', status: 'CC BY 4.0', color: '#6e7681', logo: '', style: 'pro' },
  { label: 'Visitas', status: '1,430', color: '#8a2be2', logo: 'visitas', style: 'pro' },
];

export function Hero({ onSelectPreset }: { onSelectPreset?: (preset: PresetItem) => void }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compatible al 100% con <strong>GitHub Camo Proxy</strong> y <strong>Vercel Edge</strong></span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Generador de <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Badges Dinámicos</span> de Nivel Pro
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Crea badges SVG vectoriales con la estética exacta de los repositorios top de GitHub.
          Sub-5ms de latencia, evasión automática de caché, soporte para miles de logos y endpoints en tiempo real.
        </p>

        {/* Feature badges */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sin dependencias pesadas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Sub-5ms Edge Runtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Anti-Caché Camo Headers</span>
          </div>
        </div>

        {/* Exact Showcase from User's Reference */}
        <div className="mt-10 p-5 rounded-2xl glass-panel max-w-4xl mx-auto border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-200">Badges de Referencia (Haz clic en cualquiera para personalizar)</span>
            </div>
            <span className="hidden sm:inline text-slate-500">Renderizados en tiempo real como SVG nativo</span>
          </div>

          {/* First Row of Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
            {HERO_PRESETS.slice(0, 4).map((preset, idx) => {
              const svgContent = generateBadgeSvg({
                label: preset.label,
                status: preset.status,
                color: preset.color,
                logo: preset.logo,
                style: preset.style,
              });

              return (
                <button
                  key={idx}
                  onClick={() => onSelectPreset && onSelectPreset(preset)}
                  title={`Haz clic para editar ${preset.label}`}
                  className="transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              );
            })}
          </div>

          {/* Second Row of Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
            {HERO_PRESETS.slice(4).map((preset, idx) => {
              const svgContent = generateBadgeSvg({
                label: preset.label,
                status: preset.status,
                color: preset.color,
                logo: preset.logo,
                style: preset.style,
              });

              return (
                <button
                  key={idx}
                  onClick={() => onSelectPreset && onSelectPreset(preset)}
                  title={`Haz clic para editar ${preset.label}`}
                  className="transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
