'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Palette,
  Layers,
  Sparkles,
  Sliders,
  ExternalLink,
  Search,
} from 'lucide-react';
import { generateBadgeSvg } from '@/lib/svg-engine';
import { POPULAR_ICONS, getIcon } from '@/lib/icons';
import { COLOR_PRESETS, GRADIENT_PRESETS, type BadgeStyle } from '@/lib/themes';

export interface BadgeConfig {
  label: string;
  status: string;
  color: string;
  labelColor: string;
  logo: string;
  logoColor: string;
  style: BadgeStyle;
  height: number;
}

interface BadgeStudioProps {
  initialConfig?: Partial<BadgeConfig>;
}

export function BadgeStudio({ initialConfig }: BadgeStudioProps) {
  const [label, setLabel] = useState(initialConfig?.label ?? 'Docker');
  const [status, setStatus] = useState(initialConfig?.status ?? 'ready');
  const [color, setColor] = useState(initialConfig?.color ?? '#007ec6');
  const [labelColor, setLabelColor] = useState(initialConfig?.labelColor ?? '#1f2328');
  const [logo, setLogo] = useState(initialConfig?.logo ?? 'docker');
  const [logoColor, setLogoColor] = useState(initialConfig?.logoColor ?? '#ffffff');
  const [style, setStyle] = useState<BadgeStyle>(initialConfig?.style ?? 'pro');
  const [height, setHeight] = useState<number>(initialConfig?.height ?? 20);

  // Studio UI states
  const [zoom, setZoom] = useState<number>(2);
  const [bgPreview, setBgPreview] = useState<'github-dark' | 'github-light' | 'obsidian'>('github-dark');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [iconSearch, setIconSearch] = useState('');

  const origin = React.useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.origin : 'https://apex-badges.vercel.app'),
    () => 'https://apex-badges.vercel.app'
  );

  // Generate SVG string
  const svgContent = generateBadgeSvg({
    label,
    status,
    color,
    labelColor: labelColor !== '#1f2328' ? labelColor : undefined,
    logo,
    logoColor: logoColor !== '#ffffff' ? logoColor : undefined,
    style,
    height,
  });

  // Build query string
  const queryParams = new URLSearchParams();
  if (label) queryParams.set('label', label);
  if (status) queryParams.set('status', status);
  if (color && color !== '#2ea44f') queryParams.set('color', color.replace('#', ''));
  if (labelColor && labelColor !== '#1f2328') queryParams.set('labelColor', labelColor.replace('#', ''));
  if (logo) queryParams.set('logo', logo);
  if (logoColor && logoColor !== '#ffffff') queryParams.set('logoColor', logoColor.replace('#', ''));
  if (style !== 'pro') queryParams.set('style', style);
  if (height !== 20) queryParams.set('height', String(height));

  const endpointPath = `/api/badge?${queryParams.toString()}`;
  const fullUrl = `${origin}${endpointPath}`;

  const markdownSnippet = `![${label || 'badge'}](${fullUrl})`;
  const htmlSnippet = `<img src="${fullUrl}" alt="${label}: ${status}" />`;

  const copyToClipboard = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${label || 'badge'}-${status || 'status'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredIcons = POPULAR_ICONS.filter((ic) =>
    ic.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <section id="studio" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Sliders className="w-7 h-7 text-cyan-400" />
            <span>Interactive Badge Studio</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Personaliza en tiempo real texto, logos vectoriales, esquinas, colores y obtén código 1-click para tu README.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl glass-panel space-y-5 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Configuración del Badge</span>
                </span>
                <span className="text-xs text-slate-400">Estilo Pro Split compatible</span>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="badge-label-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Label (Lado Izquierdo)
                  </label>
                  <input
                    id="badge-label-input"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Ej. Docker, Deno, Licencia"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="badge-status-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Status / Valor (Lado Derecho)
                  </label>
                  <input
                    id="badge-status-input"
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Ej. ready, ^1.40.0, passing"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Style Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estilo Visual</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['pro', 'flat', 'pill', 'glass', 'cyber', 'gradient'] as BadgeStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStyle(st)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                        style === st
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Color Palette */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Color del Status</span>
                  </label>
                  <span className="text-xs font-mono text-cyan-400">{color}</span>
                </div>

                {/* Color quick pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(COLOR_PRESETS).slice(0, 10).map(([name, hex]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColor(hex)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 ${
                        color.toLowerCase() === hex.toLowerCase()
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={name}
                    >
                      {color.toLowerCase() === hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  {/* Gradients */}
                  {Object.entries(GRADIENT_PRESETS).slice(0, 3).map(([name, [g1, g2]]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColor(name)}
                      className={`px-2 h-7 rounded-lg text-[10px] font-bold text-white border transition-transform hover:scale-105 flex items-center ${
                        color.toLowerCase() === name
                          ? 'border-white scale-105 shadow-lg'
                          : 'border-white/20'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                      title={`Gradient ${name}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                {/* Custom Hex input */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">#</span>
                    <input
                      type="text"
                      value={color.replace('#', '')}
                      onChange={(e) => setColor(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                      placeholder="007ec6"
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <input
                    type="color"
                    value={color.startsWith('#') && color.length === 7 ? color : '#007ec6'}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-9 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              {/* Logo Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Icono Vectorial (Simple Icons / Dev Icons)</span>
                  </label>
                  {logo && (
                    <button
                      type="button"
                      onClick={() => setLogo('')}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Quitar icono
                    </button>
                  )}
                </div>

                <div className="relative mb-2.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Buscar icono (docker, deno, lefthook, github, react, python...)"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-black/20 border border-white/5">
                  {filteredIcons.map((ic) => {
                    const iconInfo = getIcon(ic);
                    return (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setLogo(ic)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          logo.toLowerCase() === ic.toLowerCase()
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {iconInfo && (
                          <svg
                            className="w-3.5 h-3.5 shrink-0"
                            viewBox={iconInfo.viewBox || '0 0 24 24'}
                            fill="currentColor"
                          >
                            <path d={iconInfo.path} />
                          </svg>
                        )}
                        <span>{ic}</span>
                      </button>
                    );
                  })}
                  {iconSearch.trim() && !filteredIcons.some((i) => i.toLowerCase() === iconSearch.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => setLogo(iconSearch.trim())}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Usar &quot;{iconSearch.trim()}&quot; (Simple Icons)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Fine Tuning */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Color Fondo Label</label>
                  <input
                    type="text"
                    value={labelColor}
                    onChange={(e) => setLabelColor(e.target.value)}
                    placeholder="#1f2328"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Color del Icono</label>
                  <input
                    type="text"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    placeholder="#ffffff"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Altura del Badge</label>
                  <div className="flex gap-2">
                    {[20, 24, 28].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHeight(h)}
                        className={`flex-1 py-1 rounded-lg border text-xs ${
                          height === h
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {h}px
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview & Code Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Live Preview Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Vista Previa en Vivo</span>
                </span>

                {/* Zoom Control */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px]">
                  {[1, 1.5, 2, 3].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoom(z)}
                      className={`px-1.5 py-0.5 rounded ${
                        zoom === z ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Theme Selector */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Fondo de simulación:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBgPreview('github-dark')}
                    className={`px-2 py-0.5 rounded text-[11px] border ${
                      bgPreview === 'github-dark'
                        ? 'bg-[#0d1117] border-cyan-500 text-cyan-400'
                        : 'bg-[#0d1117] border-white/10 text-slate-400'
                    }`}
                  >
                    GitHub Dark
                  </button>
                  <button
                    onClick={() => setBgPreview('github-light')}
                    className={`px-2 py-0.5 rounded text-[11px] border ${
                      bgPreview === 'github-light'
                        ? 'bg-white border-cyan-500 text-cyan-700 font-medium'
                        : 'bg-white border-white/10 text-slate-700'
                    }`}
                  >
                    GitHub Light
                  </button>
                  <button
                    onClick={() => setBgPreview('obsidian')}
                    className={`px-2 py-0.5 rounded text-[11px] border ${
                      bgPreview === 'obsidian'
                        ? 'bg-[#05070a] border-cyan-500 text-cyan-400'
                        : 'bg-[#05070a] border-white/10 text-slate-400'
                    }`}
                  >
                    Obsidian
                  </button>
                </div>
              </div>

              {/* Preview Canvas Box */}
              <div
                className={`min-h-[160px] rounded-xl p-8 flex items-center justify-center transition-colors border ${
                  bgPreview === 'github-dark'
                    ? 'bg-[#0d1117] border-[#30363d]'
                    : bgPreview === 'github-light'
                    ? 'bg-[#ffffff] border-slate-200'
                    : 'bg-[#05070a] border-white/10'
                }`}
              >
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>

              {/* Download & Raw Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadSvg}
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Descargar .SVG</span>
                </button>
                <a
                  href={endpointPath}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir API</span>
                </a>
              </div>
            </div>

            {/* Ready-to-use Code Snippets */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-4">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copiar para tu README.md</span>
              </span>

              {/* Markdown Box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-300">Markdown (Recomendado)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(markdownSnippet, 'markdown')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    {copiedFormat === 'markdown' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-cyan-200 break-all select-all">
                  {markdownSnippet}
                </div>
              </div>

              {/* Direct URL Box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-300">URL Directa del Endpoint</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fullUrl, 'url')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    {copiedFormat === 'url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar URL</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-slate-300 break-all select-all">
                  {fullUrl}
                </div>
              </div>

              {/* HTML Snippet */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-300">HTML Tag</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(htmlSnippet, 'html')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    {copiedFormat === 'html' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-slate-400 break-all select-all">
                  {htmlSnippet}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
