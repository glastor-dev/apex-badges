import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#06080c] py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span className="font-semibold text-slate-400">Apex Badges Pro</span>
          <span>— Generador de Badges SVG de Alto Rendimiento</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Licencia Dual (GPLv3 &amp; CC BY 4.0)</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Diseñado para Vercel Edge con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </span>
        </div>
      </div>
    </footer>
  );
}
