'use client';

import React, { useState } from 'react';
import { Eye, Package, Globe, Copy, Check, RefreshCw, Zap } from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function DynamicBadgesSection() {
  const [activeTab, setActiveTab] = useState<'views' | 'github' | 'npm' | 'json'>('views');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Views state
  const [viewId, setViewId] = useState('mi-repositorio-pro');
  const [viewLabel, setViewLabel] = useState('Visitas');
  const [viewColor, setViewColor] = useState('8a2be2');
  const [viewRefreshKey, setViewRefreshKey] = useState(0);

  // GitHub state
  const [ghOwner, setGhOwner] = useState('denoland');
  const [ghRepo, setGhRepo] = useState('deno');
  const [ghMetric, setGhMetric] = useState('release');

  // NPM state
  const [npmPkg, setNpmPkg] = useState('next');

  // JSON state
  const [jsonUrl, setJsonUrl] = useState('https://api.github.com/repos/vercel/next.js');
  const [jsonQuery, setJsonQuery] = useState('stargazers_count');
  const [jsonLabel, setJsonLabel] = useState('stars');

  const origin = React.useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.origin : 'https://apex-badges.vercel.app'),
    () => 'https://apex-badges.vercel.app'
  );

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Views URL
  const viewsUrl = `${origin}/api/badge/views?id=${encodeURIComponent(viewId)}&label=${encodeURIComponent(viewLabel)}&color=${viewColor}&logo=visitas`;
  const viewsMarkdown = `![${viewLabel}](${viewsUrl})`;

  // GitHub URL
  const githubUrl = `${origin}/api/badge/github/${ghOwner}/${ghRepo}/${ghMetric}`;
  const githubMarkdown = `![${ghMetric}](${githubUrl})`;

  // NPM URL
  const npmUrl = `${origin}/api/badge/npm/${encodeURIComponent(npmPkg)}?color=red`;
  const npmMarkdown = `![npm version](${npmUrl})`;

  // JSON URL
  const customJsonUrl = `${origin}/api/badge/dynamic?url=${encodeURIComponent(jsonUrl)}&query=${encodeURIComponent(jsonQuery)}&label=${encodeURIComponent(jsonLabel)}&color=blue`;
  const customJsonMarkdown = `![${jsonLabel}](${customJsonUrl})`;

  return (
    <section id="dynamic" className="py-12 md:py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Datos en Tiempo Real</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Badges Dinámicos con Evasión de Caché
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Conéctalos a GitHub, registros de paquetes, APIs REST o utiliza el contador de visitas con soporte para Upstash Redis.
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('views')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'views'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Contador de Visitas</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'github'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              <span>Métricas de GitHub</span>
            </button>

            <button
              onClick={() => setActiveTab('npm')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'npm'
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-rose-400" />
              <span>Versión NPM</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'json'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>API JSON Personalizada</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {/* TAB 1: VISITAS */}
          {activeTab === 'views' && (
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>Contador de Visitas en Vivo (Page Views)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cada vez que alguien carga tu README en GitHub, este badge se incrementa automáticamente.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewRefreshKey((k) => k + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-medium text-purple-300 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Simular Visita (+1)</span>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ID Único del Repo / Usuario
                  </label>
                  <input
                    type="text"
                    value={viewId}
                    onChange={(e) => setViewId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Texto de la Etiqueta</label>
                  <input
                    type="text"
                    value={viewLabel}
                    onChange={(e) => setViewLabel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Color HEX</label>
                  <input
                    type="text"
                    value={viewColor}
                    onChange={(e) => setViewColor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 flex flex-col items-center justify-center gap-3">
                <span className="text-xs text-slate-400">Resultado en tiempo real:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${viewsUrl}&_t=${viewRefreshKey}`}
                  alt="Visitas"
                  className="scale-125 transition-transform"
                />
              </div>

              {/* Copy snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Código Markdown para tu README:</span>
                  <button
                    onClick={() => copyText(viewsMarkdown, 'views')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'views' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'views' ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-purple-200 select-all break-all">
                  {viewsMarkdown}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB METRICS */}
          {activeTab === 'github' && (
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-cyan-400" />
                  <span>Métricas Dinámicas de GitHub</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Obtén estrellas, forks, releases o licencias directamente desde la API oficial de GitHub con caché de 60 segundos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Organización / Usuario</label>
                  <input
                    type="text"
                    value={ghOwner}
                    onChange={(e) => setGhOwner(e.target.value)}
                    placeholder="denoland"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Repositorio</label>
                  <input
                    type="text"
                    value={ghRepo}
                    onChange={(e) => setGhRepo(e.target.value)}
                    placeholder="deno"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Métrica</label>
                  <select
                    value={ghMetric}
                    onChange={(e) => setGhMetric(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#151a24] border border-white/10 text-white text-xs"
                  >
                    <option value="release">Última Release</option>
                    <option value="stars">Estrellas (Stars)</option>
                    <option value="forks">Forks</option>
                    <option value="issues">Issues Abiertos</option>
                    <option value="license">Licencia (SPDX)</option>
                    <option value="size">Tamaño del Repo</option>
                    <option value="language">Lenguaje Principal</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 flex flex-col items-center justify-center gap-3">
                <span className="text-xs text-slate-400">Badge generado en vivo:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={githubUrl} alt={ghMetric} className="scale-125" />
              </div>

              {/* Copy snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Código Markdown para tu README:</span>
                  <button
                    onClick={() => copyText(githubMarkdown, 'github')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'github' ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-cyan-200 select-all break-all">
                  {githubMarkdown}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NPM */}
          {activeTab === 'npm' && (
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-rose-400" />
                  <span>Versión de Paquete en NPM</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Muestra la versión de lanzamiento más reciente de cualquier paquete público en el registro de NPM.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Paquete NPM</label>
                <input
                  type="text"
                  value={npmPkg}
                  onChange={(e) => setNpmPkg(e.target.value)}
                  placeholder="next, react, @glastor-dev/readmegen"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 flex flex-col items-center justify-center gap-3">
                <span className="text-xs text-slate-400">Badge generado en vivo:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={npmUrl} alt="NPM Version" className="scale-125" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Código Markdown para tu README:</span>
                  <button
                    onClick={() => copyText(npmMarkdown, 'npm')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'npm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'npm' ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-rose-200 select-all break-all">
                  {npmMarkdown}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM JSON */}
          {activeTab === 'json' && (
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Badge desde API JSON Personalizada</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Consulta cualquier endpoint JSON público y extrae un campo específico mediante notación de objeto (ej. <code>data.version</code>).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">URL de la API JSON</label>
                  <input
                    type="text"
                    value={jsonUrl}
                    onChange={(e) => setJsonUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ruta del Campo (Query)</label>
                  <input
                    type="text"
                    value={jsonQuery}
                    onChange={(e) => setJsonQuery(e.target.value)}
                    placeholder="stargazers_count o status"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Etiqueta (Label)</label>
                  <input
                    type="text"
                    value={jsonLabel}
                    onChange={(e) => setJsonLabel(e.target.value)}
                    placeholder="stars"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 flex flex-col items-center justify-center gap-3">
                <span className="text-xs text-slate-400">Badge generado en vivo:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={customJsonUrl} alt="JSON Badge" className="scale-125" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Código Markdown para tu README:</span>
                  <button
                    onClick={() => copyText(customJsonMarkdown, 'json')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'json' ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-blue-200 select-all break-all">
                  {customJsonMarkdown}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
