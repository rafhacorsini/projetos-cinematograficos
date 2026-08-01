import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// ASSETS: SEQUÊNCIA DOS 79 NOVOS FRAMES 1080P OTIMIZADOS E MODELO 3D (.GLB)
// =========================================================================
const FRAME_IMAGES = Array.from({ length: 79 }, (_, i) => {
  const frameIndex = String(i + 1).padStart(3, '0');
  return `/frames-optimized/frame-${frameIndex}.webp`;
});

const MODEL_PATH = '/3d-oculos/curved_sunglasses.glb';

function ChoreographedGlasses({ scrollData }) {
  const groupRef = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  // Material Físico Cyan Neon HD
  const materials = useMemo(() => {
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#06b6d4'),
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f172a'),
      metalness: 0.8,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2e8f0'),
      metalness: 1.0,
      roughness: 0.05,
      side: THREE.DoubleSide,
    });

    return { lensMat, frameMat, accentMat };
  }, []);

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const matName = child.material ? child.material.name : '';

        if (matName.includes('006') || child.name.includes('006')) {
          child.material = materials.lensMat;
        } else if (matName.includes('1') || child.name.includes('(1)')) {
          child.material = materials.accentMat;
        } else {
          child.material = materials.frameMat;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, materials]);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x = gsap.utils.interpolate(groupRef.current.rotation.x, scrollData.current.rotX, 0.08);
    groupRef.current.rotation.y = gsap.utils.interpolate(groupRef.current.rotation.y, scrollData.current.rotY, 0.08);
    groupRef.current.rotation.z = gsap.utils.interpolate(groupRef.current.rotation.z, scrollData.current.rotZ, 0.08);

    groupRef.current.position.x = gsap.utils.interpolate(groupRef.current.position.x, scrollData.current.posX, 0.08);
    groupRef.current.position.y = gsap.utils.interpolate(groupRef.current.position.y, scrollData.current.posY, 0.08);
    groupRef.current.position.z = gsap.utils.interpolate(groupRef.current.position.z, scrollData.current.posZ, 0.08);

    const scale = gsap.utils.interpolate(groupRef.current.scale.x, scrollData.current.scale, 0.08);
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

function LoadingFallback() {
  return (
    <mesh>
      <torusGeometry args={[0.5, 0.15, 16, 100]} />
      <meshStandardMaterial color="#06b6d4" wireframe />
    </mesh>
  );
}

export default function UnifiedExperience() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const container3DRef = useRef(null);

  // Refs dos 3 Blocos de Texto da Coreografia 3D
  const textBlock1Ref = useRef(null);
  const textBlock2Ref = useRef(null);
  const textBlock3Ref = useRef(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loadedImagesRef = useRef([]);
  const lastDrawnImageRef = useRef(null);
  const currentFrameRef = useRef(0);
  const textAnimRef = useRef({ opacity: 1, offsetY: 0 });

  const scrollData = useRef({
    rotX: 0,
    rotY: Math.PI,
    rotZ: 0,
    scale: 0.014,
    posX: 0,
    posY: 0,
    posZ: 0,
  });

  // 1. Pré-carregamento dos 79 WebPs 1080p
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
        console.warn(`Erro no frame: ${src}`);
        handleImageLoad();
      };

      imagesArray[index] = img;
    });

    loadedImagesRef.current = imagesArray;
  }, []);

  // 2. Renderização no Canvas (79 Frames 1080p + Máscara Permanente + Saída Normal sem Blur)
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

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Desenha a Imagem do Frame 1080p no Canvas
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      const scaleFactor = canvasWidth / 1920;

      // 2. MÁSCARA PRETA GRADIENTE PERMANENTE NA BASE
      const bottomMaskHeight = Math.round(450 * scaleFactor);
      const bottomGlow = ctx.createLinearGradient(0, canvasHeight - bottomMaskHeight, 0, canvasHeight);
      bottomGlow.addColorStop(0, 'rgba(5, 5, 8, 0)');
      bottomGlow.addColorStop(0.4, 'rgba(5, 5, 8, 0.45)');
      bottomGlow.addColorStop(1, 'rgba(5, 5, 8, 0.85)');

      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, canvasHeight - bottomMaskHeight, canvasWidth, bottomMaskHeight);

      // 3. RENDERIZAÇÃO DA TIPOGRAFIA DA HERO (SAÍDA NORMAL SEM BLUR SUBINDO)
      const textOpacity = textAnimRef.current.opacity;
      if (textOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = textOpacity;
        ctx.globalCompositeOperation = 'difference';

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const textOffsetY = Math.round(textAnimRef.current.offsetY * scaleFactor);

        // --- LADO ESQUERDO: TÍTULO SHIELD® GIGANTE ---
        const fontSize = Math.max(72, Math.round(210 * scaleFactor));
        ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'left';

        const paddingLeft = Math.round(70 * scaleFactor);
        const paddingBottom = Math.round(140 * scaleFactor);

        const shieldY = canvasHeight - paddingBottom + textOffsetY;
        ctx.fillText('SHIELD®', paddingLeft, shieldY);

        // Subtítulo em 2 Linhas
        const subFontSize = Math.max(11, Math.round(16 * scaleFactor));
        ctx.font = `500 ${subFontSize}px "Courier New", monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'top';

        const line1 = 'ENGENHARIA AERODINÂMICA ULTRALEVE ESCULPIDA EM CARBONO BIOMÉTRICO.';
        const line2 = 'VISÃO ÓPTICA DE ALTA DEFINIÇÃO CALIBRADA PARA EXTREMA PERFORMANCE.';

        const lineSpacing = Math.round(24 * scaleFactor);
        const subY = shieldY + Math.round(16 * scaleFactor);

        const indentX = paddingLeft + Math.round(220 * scaleFactor);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(2, Math.round(3 * scaleFactor));
        ctx.beginPath();
        ctx.moveTo(indentX - Math.round(18 * scaleFactor), subY);
        ctx.lineTo(indentX - Math.round(18 * scaleFactor), subY + lineSpacing * 2 - 4);
        ctx.stroke();

        ctx.fillText(line1, indentX, subY);
        ctx.fillText(line2, indentX, subY + lineSpacing);

        // --- LADO DIREITO: HUD TÉCNICO ---
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        const paddingRight = Math.round(70 * scaleFactor);
        const rightY = canvasHeight - Math.round(140 * scaleFactor) + textOffsetY;

        const spec1 = '[ 01 // SPECIFICATIONS ]';
        const spec2 = 'FRAME: BIOMETRIC CARBON MATRIX';
        const spec3 = 'WEIGHT: 32.4G // CYBER-CYAN HD';

        ctx.font = `700 ${subFontSize}px "Courier New", monospace`;
        ctx.fillText(spec1, canvasWidth - paddingRight, rightY - lineSpacing * 2);

        ctx.font = `400 ${subFontSize - 1}px "Courier New", monospace`;
        ctx.fillText(spec2, canvasWidth - paddingRight, rightY - lineSpacing);
        ctx.fillText(spec3, canvasWidth - paddingRight, rightY);

        ctx.restore();
      }
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

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 0.8,
          onUpdate: () => {
            renderFrame(frameSequence.frame);
          },
        },
      });

      // ETAPA 1A: Percorrer os 79 frames 1080p da Hero (0% a 40%)
      tl.to(frameSequence, {
        frame: FRAME_IMAGES.length - 1,
        ease: 'none',
        duration: 4,
        onUpdate: () => {
          renderFrame(frameSequence.frame);
        },
      }, 0);

      // ETAPA 1B: Efeito de Saída Normal dos Textos da Hero (Desliza para CIMA sem Blur)
      tl.to(textAnimRef.current, {
        opacity: 0,
        offsetY: -75,
        ease: 'power2.inOut',
        duration: 2.2,
        onUpdate: () => {
          renderFrame(frameSequence.frame);
        },
      }, 1.2);

      // ETAPA 2: Fade para Preto Total (40% a 48%)
      tl.to(fadeOverlayRef.current, {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 1,
      });

      // ETAPA 3: Revelação do Óculos 3D no centro da tela preta (48% a 55%)
      tl.to(container3DRef.current, {
        opacity: 1,
        ease: 'power2.out',
        duration: 1,
      });

      // ETAPA 4: COREOGRAFIA 3D + ENTRADA DOS 3 BLOCOS DE TEXTO (SUBINDO DE BAIXO PARA CIMA)
      tl.to(scrollData.current, {
        posX: 0.9,
        rotY: Math.PI + Math.PI * 0.3,
        rotX: 0.12,
        scale: 0.021,
        duration: 2.5,
        ease: 'power1.inOut',
      }, 'phase1');

      tl.fromTo(textBlock1Ref.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        'phase1+=0.2'
      );
      tl.to(textBlock1Ref.current,
        { y: -70, opacity: 0, duration: 1, ease: 'power2.in' },
        'phase1+=1.5'
      );

      tl.to(scrollData.current, {
        posX: -0.9,
        rotY: Math.PI - Math.PI * 0.35,
        rotX: -0.08,
        scale: 0.016,
        duration: 3,
        ease: 'power1.inOut',
      }, 'phase2');

      tl.fromTo(textBlock2Ref.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, ease: 'power2.out' },
        'phase2+=0.2'
      );
      tl.to(textBlock2Ref.current,
        { y: -70, opacity: 0, duration: 1.1, ease: 'power2.in' },
        'phase2+=1.8'
      );

      tl.to(scrollData.current, {
        posX: 0,
        rotY: Math.PI * 2.25,
        rotX: 0.1,
        scale: 0.023,
        duration: 2.5,
        ease: 'power1.inOut',
      }, 'phase3');

      tl.fromTo(textBlock3Ref.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out' },
        'phase3+=0.3'
      );

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
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
      className="relative w-full h-screen bg-[#050508] overflow-hidden flex items-center justify-center"
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 bg-[#050508] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
            {loadProgress}%
          </span>
        </div>
      )}

      {/* 1. CANVAS DA HERO */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* 2. OVERLAY DE TRANSIÇÃO PARA PRETO ABSOLUTO NO FINAL DOS FRAMES */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-[#050508] pointer-events-none opacity-0 z-20"
      />

      {/* 3. CANVAS 3D DOS ÓCULOS (REVELADO NO MESMO LUGAR) */}
      <div
        ref={container3DRef}
        className="absolute inset-0 w-full h-full z-30 opacity-0 cursor-grab active:cursor-grabbing"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Iluminação de Estúdio */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 7]} intensity={3.5} color="#ffffff" castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={2.0} color="#06b6d4" />
          <spotLight position={[0, 8, 2]} intensity={3.0} angle={0.6} penumbra={1} color="#ffffff" />

          {/* Sombra de Contato no Chão */}
          <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={5} blur={1.5} far={2} color="#000000" />

          {/* Ambiente Reflexivo */}
          <Environment preset="city" />

          <Suspense fallback={<LoadingFallback />}>
            <ChoreographedGlasses scrollData={scrollData} />
          </Suspense>
        </Canvas>
      </div>

      {/* 4. OS 3 BLOCOS DE TEXTO DA COREOGRAFIA (SUBINDO DE BAIXO PARA CIMA) */}
      <div
        ref={textBlock1Ref}
        className="absolute left-8 sm:left-16 bottom-16 sm:bottom-24 max-w-sm sm:max-w-md z-40 pointer-events-none opacity-0"
      >
        <div className="border-l-2 border-cyan-400 pl-4 sm:pl-6 space-y-2 bg-[#050508]/40 p-4 rounded-r-lg backdrop-blur-sm">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase block font-semibold">
            01 // AERODYNAMICS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            AIRFLOW ARCHITECTURE
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            Estrutura curvada ergonomicamente projetada para canalizar o fluxo de ar e reduzir o arraste dinâmico.
          </p>
        </div>
      </div>

      <div
        ref={textBlock2Ref}
        className="absolute right-8 sm:right-16 bottom-16 sm:bottom-24 max-w-sm sm:max-w-md text-right z-40 pointer-events-none opacity-0"
      >
        <div className="border-r-2 border-cyan-400 pr-4 sm:pr-6 space-y-2 bg-[#050508]/40 p-4 rounded-l-lg backdrop-blur-sm">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase block font-semibold">
            02 // OPTICAL CLARITY
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            CYBER-CYAN SPECTRUM
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            Lentes físicas de polímero com filtragem espectral UV400 e nitidez óptica cristalina em alta definição.
          </p>
        </div>
      </div>

      <div
        ref={textBlock3Ref}
        className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:bottom-16 max-w-lg text-center z-40 pointer-events-none opacity-0"
      >
        <div className="space-y-2 border-t-2 border-cyan-400/50 pt-4 px-6 bg-[#050508]/60 p-4 rounded-t-xl backdrop-blur-sm">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase block font-semibold">
            03 // BIOMETRIC EDITION
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            ORVEN SHIELD — SERIES 01
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            A fusão definitiva entre engenharia aerodinâmica, estética cyber e performance profissional.
          </p>
        </div>
      </div>
    </section>
  );
}
