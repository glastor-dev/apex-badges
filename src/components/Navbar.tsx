import { ShieldCheck, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Apex Badges
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Dynamic SVG Generator for GitHub & Vercel</p>
          </div>
        </div>

        {/* Status Pill & Links */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vercel Edge Ready: &lt;5ms</span>
          </div>

          <a
            href="#studio"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Studio
          </a>
          <a
            href="#dynamic"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Dinámicos
          </a>
          <a
            href="#docs"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            API Docs
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
