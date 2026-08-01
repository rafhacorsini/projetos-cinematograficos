import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalFooterSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const logoRef = useRef(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      /* 1. ANIMAÇÃO DE REVELAÇÃO DO TÍTULO DE FECHAMENTO NO SCROLL */
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0.15, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 88%',
            end: 'top 45%',
            scrub: 0.6,
          },
        }
      );

      /* 2. LOGO GIGANTE LUCID® NO SCROLL SCRUB EXPANDINDO LETTER-SPACING */
      gsap.fromTo(
        logoRef.current,
        { opacity: 0.2, scale: 0.95, letterSpacing: '-0.05em' },
        {
          opacity: 1,
          scale: 1,
          letterSpacing: '0.02em',
          ease: 'none',
          scrollTrigger: {
            trigger: logoRef.current,
            start: 'top 92%',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="w-full bg-[#ffffff] text-slate-900 select-none relative overflow-hidden border-t border-slate-200/80 pt-20 sm:pt-32 pb-8 px-6 sm:px-12"
    >
      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28">

        {/* 1. BANNER MANIFESTO DE FECHAMENTO (TÍTULO 100% EM UMA SÓ LINHA) */}
        <div className="text-center space-y-8 max-w-5xl mx-auto overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-pink-500 font-mono text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span>JOIN THE BEAUTY MOVEMENT</span>
          </div>

          {/* TÍTULO EM UMA SÓ LINHA */}
          <h2
            ref={headlineRef}
            className="font-display font-medium text-xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-950 tracking-tight uppercase whitespace-nowrap leading-none"
          >
            O FUTURO DA BELEZA É <span className="text-pink-500 font-semibold">LUCID.</span>
          </h2>

          <p className="font-mono text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold leading-relaxed max-w-xl mx-auto">
            INSCREVA-SE PARA ACESSO ANTECIPADO A NOVOS LANÇAMENTOS, EDICÕES LIMITADAS E EXPERIÊNCIAS DE GLOW EXCLUSIVAS.
          </p>

          {/* FORMULÁRIO DE NEWSLETTER ELEGANTE */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="SEU MELHOR E-MAIL..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3.5 font-mono text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-black hover:bg-slate-900 text-pink-400 px-8 py-3.5 rounded-full font-mono text-xs font-bold tracking-widest transition-all cursor-pointer whitespace-nowrap active:scale-95 border border-black shadow-sm"
            >
              {subscribed ? 'INSCRITO! ✦' : 'ENTRAR →'}
            </button>
          </form>

        </div>

        {/* 2. GRID DE NAVEGAÇÃO DO RODAPÉ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-200/80 font-mono text-xs uppercase tracking-widest">
          
          <div className="space-y-3">
            <span className="text-slate-400 font-bold text-[10px]">COLEÇÃO</span>
            <ul className="space-y-2 text-slate-700 font-semibold">
              <li><a href="#shop" className="hover:text-pink-500 transition-colors">LIP OILS</a></li>
              <li><a href="#shop" className="hover:text-pink-500 transition-colors">SKINCARE</a></li>
              <li><a href="#shop" className="hover:text-pink-500 transition-colors">SHADE FINDER</a></li>
              <li><a href="#shop" className="hover:text-pink-500 transition-colors">THE FORMULA</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-bold text-[10px]">SOBRE</span>
            <ul className="space-y-2 text-slate-700 font-semibold">
              <li><a href="#about" className="hover:text-pink-500 transition-colors">SOBRE A MARCA</a></li>
              <li><a href="#gallery" className="hover:text-pink-500 transition-colors">GALERIA VISUAL</a></li>
              <li><a href="#about" className="hover:text-pink-500 transition-colors">CALIFORNIA LAB</a></li>
              <li><a href="#about" className="hover:text-pink-500 transition-colors">SUSTENTABILIDADE</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-bold text-[10px]">SOCIAL</span>
            <ul className="space-y-2 text-slate-700 font-semibold">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors">INSTAGRAM ↗</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors">TIKTOK ↗</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors">PINTEREST ↗</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-bold text-[10px]">LAB STATUS</span>
            <div className="text-slate-700 font-semibold space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE 24/7</span>
              </p>
              <p className="text-[10px] text-slate-400 pt-1">LOS ANGELES, CA</p>
            </div>
          </div>

        </div>

        {/* 3. LOGO GIGANTE LUCID® QUE EXPANDE NO SCROLL */}
        <div className="w-full text-center pt-8 border-t border-slate-200/80">
          <div
            ref={logoRef}
            className="font-display font-medium text-[16vw] sm:text-[15vw] leading-none text-black tracking-tighter uppercase pointer-events-none inline-flex items-start justify-center"
          >
            <span>LUCID</span>
            <span className="font-sans text-[0.38em] ml-1 font-extrabold align-top text-black">®</span>
          </div>
        </div>

        {/* 4. DIREITOS E INFORMATIVOS */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest pt-4">
          <div>LUCID® BEAUTY LABS © 2026 // TODOS OS DIREITOS RESERVADOS</div>
          <div>HIGH PERFORMANCE BEAUTY FORMULATED IN CALIFORNIA</div>
        </div>

      </div>
    </footer>
  );
}
