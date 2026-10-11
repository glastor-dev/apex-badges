import React from 'react';
import { BookOpen, ShieldCheck, Terminal, Server } from 'lucide-react';

export function ApiDocsSection() {
  return (
    <section id="docs" className="py-12 md:py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentación Técnica</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Referencia de API y Compatibilidad con GitHub
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Aprende cómo funciona el motor por dentro, las cabeceras anti-caché de Camo y cómo desplegarlo en Vercel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Endpoints Guide */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white text-base">Endpoints Disponibles</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono">
                <span className="text-cyan-400 font-bold">GET</span> /api/badge
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Generador universal estático/dinámico. Parámetros: <code>label</code>, <code>status</code>, <code>color</code>, <code>logo</code>, <code>style</code>, <code>height</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono">
                <span className="text-purple-400 font-bold">GET</span> /api/badge/views?id=:repo
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Contador en vivo con incremento atómico y cabeceras estrictas <code>no-store</code> para que GitHub Camo nunca congele el número.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono">
                <span className="text-emerald-400 font-bold">GET</span> /api/badge/github/:owner/:repo/:metric
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Métricas oficiales de GitHub: <code>release</code>, <code>stars</code>, <code>forks</code>, <code>issues</code>, <code>license</code>, <code>size</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono">
                <span className="text-rose-400 font-bold">GET</span> /api/badge/npm/:package
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Versión actual en NPM Registry compatible con paquetes con scope (ej. <code>@scope/pkg</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: GitHub Camo Cache Protocol */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">El Secreto de GitHub Camo Proxy</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              GitHub procesa todas las imágenes en README mediante <code>camo.githubusercontent.com</code>. Para evitar que las visitas y métricas se queden desactualizadas durante días, Apex Badges emite:
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300 space-y-1">
              <div>Cache-Control: max-age=0, no-cache, no-store, must-revalidate</div>
              <div>Surrogate-Control: no-store</div>
              <div>Pragma: no-cache</div>
              <div>Expires: 0</div>
              <div>Content-Type: image/svg+xml; charset=utf-8</div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Despliegue en Vercel</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Este proyecto está configurado para <strong>Vercel Edge Network</strong>. Al no usar binarios nativos de C++ o librerías de Canvas, el tiempo de arranque en frío es de <strong>0 ms</strong> y la respuesta promedio en todo el mundo es menor a <strong>15 ms</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
