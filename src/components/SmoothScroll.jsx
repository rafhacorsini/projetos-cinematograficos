import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Inicialização do Lenis com parâmetros de suavização "amanteigada" (butter-smooth)
    const lenis = new Lenis({
      duration: 1.4, // Duração da interpolação do scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial suave
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Sincronizar Lenis com o GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Integrar a função raf do Lenis com o Ticker principal do GSAP
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Previne saltos de frame no GSAP

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
