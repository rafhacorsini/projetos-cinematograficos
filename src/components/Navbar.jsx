import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/80 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="font-display font-bold text-black text-sm tracking-tighter">VX</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-widest text-white uppercase group-hover:text-cyan-400 transition-colors">
              AEROMAX
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
              APEX // 01 LUXURY
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-slate-300">
          <a href="#hero" className="hover:text-cyan-400 transition-colors py-1 relative group">
            Visão Geral
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#specs-3d" className="hover:text-cyan-400 transition-colors py-1 relative group">
            Modelo 3D
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#tech" className="hover:text-cyan-400 transition-colors py-1 relative group">
            Tecnologia
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            EDIÇÃO LIMITADA
          </div>
          <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <span>Comprar Agora</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-6 py-6 mt-3 flex flex-col gap-4">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono tracking-widest text-slate-200 hover:text-cyan-400 py-2"
          >
            Visão Geral
          </a>
          <a
            href="#specs-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono tracking-widest text-slate-200 hover:text-cyan-400 py-2"
          >
            Modelo 3D
          </a>
          <a
            href="#tech"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono tracking-widest text-slate-200 hover:text-cyan-400 py-2"
          >
            Tecnologia
          </a>
          <button className="w-full mt-2 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider">
            Comprar Agora
          </button>
        </div>
      )}
    </header>
  );
}
