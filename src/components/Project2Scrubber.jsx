import React, { useState } from 'react';
import ShopSection from './ShopSection';
import AboutSection from './AboutSection';
import GallerySection from './GallerySection';
import FinalFooterSection from './FinalFooterSection';

export default function Project2Scrubber() {
  const [cartCount, setCartCount] = useState(1);

  return (
    <div className="w-full bg-[#ffffff] text-slate-900 select-none overflow-x-hidden">
      {/* 1. SEÇÃO HERO DO PROJETO 2 */}
      <section
        id="projeto2"
        className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-8"
      >
        {/* TOP HEADER - CHIC FEMININE BEAUTY BOUTIQUE */}
        <header className="w-full flex items-center justify-between py-4 px-4 sm:px-8 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
          {/* LOGO MINIMALISTA E ELEGANTE (LUCID // BEAUTY LABS) */}
          <div className="flex items-center gap-1">
            <span className="font-display font-black text-xl sm:text-2xl text-black tracking-tighter uppercase">
              LUCID
            </span>
            <span className="font-mono text-slate-300 text-xs font-normal mx-1">
              //
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-pink-400">
              BEAUTY LABS
            </span>
          </div>

          {/* NAVEGAÇÃO FEMININA COM CATEGORIAS DE COSMÉTICOS & HOVER DE GLOW */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-[11px] font-semibold text-slate-700 tracking-widest uppercase">
            <a href="#shop" className="hover:text-black transition-colors flex items-center gap-1.5 py-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              LIP OILS
            </a>
            <a href="#shop" className="hover:text-black transition-colors flex items-center gap-1.5 py-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              SKINCARE
            </a>
            <a href="#about" className="hover:text-black transition-colors flex items-center gap-1.5 py-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ABOUT BRAND
            </a>
            <a href="#gallery" className="hover:text-black transition-colors flex items-center gap-1.5 py-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ATMOSPHERE
            </a>
          </nav>

          {/* BOTÃO DO CARRINHO BAG EM FUNDO PRETO COM TEXTO ROSA */}
          <button
            onClick={() => setCartCount(prev => prev + 1)}
            className="bg-black hover:bg-slate-900 text-pink-400 px-5 py-2.5 rounded-full font-mono text-[11px] font-bold tracking-widest transition-all shadow-sm cursor-pointer flex items-center gap-2.5 active:scale-95 border border-black"
          >
            <svg className="w-3.5 h-3.5 stroke-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-pink-400">BAG</span>
            <span className="bg-pink-400 text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {cartCount}
            </span>
          </button>
        </header>

        {/* ÁREA PRINCIPAL HERO */}
        <div className="relative w-full my-auto py-2 flex flex-col items-center">
          <div className="relative w-full max-w-7xl mx-auto border-x border-slate-200/80 pt-2 sm:pt-4">
            <div className="w-full text-center relative z-20 pb-3 pt-1 pointer-events-none">
              <h1 className="font-display font-black text-[11vw] sm:text-[9.5vw] md:text-[8.5vw] leading-none text-[#09090b] tracking-tighter uppercase select-none inline-flex items-start justify-center">
                <span>LUCID</span>
                <span className="font-sans text-[0.38em] ml-1 font-extrabold align-top text-black">®</span>
              </h1>
            </div>

            <div className="relative w-full h-[52vh] sm:h-[62vh] md:h-[68vh] rounded-none overflow-hidden bg-slate-100 border-t border-b border-slate-200/80 z-10">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video-projeto2.mp4" type="video/mp4" />
                <source src="https://res.cloudinary.com/dwmrunhxa/video/upload/v1785186294/000_docq9l.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>
        </div>

        {/* FOOTER HERO */}
        <footer className="w-full py-3 px-2 sm:px-6 border-t border-slate-200/80 flex justify-between items-center font-mono text-[10px] text-slate-400 uppercase tracking-widest">
          <div>LUCID® BEAUTY LABS © 2026</div>
          <div>HIGH PERFORMANCE COSMETICS</div>
        </footer>
      </section>

      {/* 2. SEÇÃO SHOP */}
      <ShopSection />

      {/* 3. SEÇÃO ABOUT BRAND */}
      <AboutSection />

      {/* 4. SEÇÃO GALERIA EXPERIMENTAL */}
      <GallerySection />

      {/* 5. SEÇÃO FINAL / RODAPÉ MANIFESTO COM ANIMAÇÃO NO SCROLL */}
      <FinalFooterSection />
    </div>
  );
}
