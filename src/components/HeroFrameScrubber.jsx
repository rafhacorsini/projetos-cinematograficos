import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// SEQUÊNCIA DE 64 FRAMES WEBP OTIMIZADOS ORIGINAIS (5.33 MB TOTAL)
// =========================================================================
const FRAME_IMAGES = Array.from({ length: 64 }, (_, i) => {
  const frameIndex = String(i + 1).padStart(3, '0');
  return `/frames-optimized/frame-${frameIndex}.webp`;
});

export default function HeroFrameScrubber() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const fadeOverlayRef = useRef(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loadedImagesRef = useRef([]);
  const lastDrawnImageRef = useRef(null);
  const currentFrameRef = useRef(0);

  // 1. Pré-carregamento das imagens em memória
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = FRAME_IMAGES.length;
    const imagesArray = [];

    FRAME_IMAGES.forEach((src, index) => {
      const img = new Image();
      img.src = src;

      const handleImageLoad = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));

        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(handleImageLoad).catch(handleImageLoad);
        } else {
          handleImageLoad();
        }
      };

      img.onerror = () => {
        console.warn(`Erro no carregamento do frame: ${src}`);
        handleImageLoad();
      };

      imagesArray[index] = img;
    });

    loadedImagesRef.current = imagesArray;
  }, []);

  // 2. Renderização do Canvas limpo sem filtros azuis
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const renderFrame = (index) => {
      const frameIndex = Math.min(
        FRAME_IMAGES.length - 1,
        Math.max(0, Math.round(index))
      );

      currentFrameRef.current = frameIndex;

      let img = loadedImagesRef.current[frameIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        img = lastDrawnImageRef.current;
      }

      if (!img) return;

      lastDrawnImageRef.current = img;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const offsetX = (canvasWidth - newWidth) / 2;
      const offsetY = (canvasHeight - newHeight) / 2;

      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const frameSequence = { frame: 0 };

    // GSAP ScrollTrigger Timeline
    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.1,
          onUpdate: () => {
            renderFrame(frameSequence.frame);
          },
        },
      });

      // Passo A: Percorrer todos os 64 frames (0 a 80% da rolagem da Hero)
      tl.to(frameSequence, {
        frame: FRAME_IMAGES.length - 1,
        ease: 'none',
        duration: 0.8,
        onUpdate: () => {
          renderFrame(frameSequence.frame);
        },
      });

      // Passo B: Transição suave para PRETO TOTAL no término dos frames (80% a 100%)
      tl.to(fadeOverlayRef.current, {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 0.2,
      });
    }, sectionRef);

    renderFrame(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctxGsap.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen bg-[#050508] overflow-hidden flex items-center justify-center z-10"
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 z-40 bg-[#050508] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
            {loadProgress}%
          </span>
        </div>
      )}

      {/* Canvas com Frames WebP de Alta Definição */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Overlay de Transição Suave para Preto no Final do Scroll da Hero */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-[#050508] pointer-events-none opacity-0 z-20"
      />
    </section>
  );
}
