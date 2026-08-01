import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 sm:p-10 flex items-start justify-between pointer-events-auto text-white select-none mix-blend-difference">
      {/* 1. LOGO: ORVEN SHIELD® */}
      <div className="flex items-center gap-1 cursor-pointer">
        <span className="font-display font-black text-xl sm:text-2xl tracking-tighter uppercase text-white">
          ORVEN SHIELD
        </span>
        <span className="font-mono text-xs align-top font-bold text-white">®</span>
      </div>

      {/* 2. NAVEGAÇÃO MINIMALISTA DESCONSTRUÍDA (3 ITENS VERTICAIS + ESPAÇO + 2 ITENS VERTICAIS) */}
      <nav className="hidden md:flex items-start gap-12 font-mono text-[11px] sm:text-xs uppercase tracking-tight text-white">
        {/* GRUPO 1: 3 ITENS NA VERTICAL */}
        <div className="flex flex-col gap-1.5 text-left border-l border-white/50 pl-3">
          <a href="#design" className="hover:opacity-60 transition-opacity">01 / DESIGN</a>
          <a href="#optics" className="hover:opacity-60 transition-opacity">02 / OPTICS</a>
          <a href="#specs" className="hover:opacity-60 transition-opacity">03 / SPECS</a>
        </div>

        {/* ESPAÇO ENTRE OS GRUPOS DE MENU */}
        <div className="w-12" />

        {/* GRUPO 2: 2 ITENS NA VERTICAL */}
        <div className="flex flex-col gap-1.5 text-left border-l border-white/50 pl-3">
          <a href="#performance" className="hover:opacity-60 transition-opacity">04 / PERFORMANCE</a>
          <a href="#innovation" className="hover:opacity-60 transition-opacity">05 / INNOVATION</a>
        </div>
      </nav>

      {/* 3. CANTO DIREITO: CARRINHO (CART / BAG) */}
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tight cursor-pointer hover:opacity-75 transition-opacity">
        <ShoppingBag className="w-4 h-4 text-white" />
        <span className="hidden sm:inline">BAG</span>
        <span className="text-[10px] font-bold text-white font-mono border border-white px-1.5 py-0.5 rounded-full">
          0
        </span>
      </div>
    </header>
  );
}
