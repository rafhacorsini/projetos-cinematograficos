import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, Center } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// CAMINHO DO MODELO 3D (.GLB) NA PASTA PUBLIC
// =========================================================================
const MODEL_PATH = '/3d-oculos/curved_sunglasses.glb';

function GlassesModel({ scrollData }) {
  const groupRef = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  useFrame(() => {
    if (!groupRef.current) return;

    // Rotação suave X/Y
    groupRef.current.rotation.x = gsap.utils.interpolate(
      groupRef.current.rotation.x,
      scrollData.current.rotX,
      0.1
    );
    groupRef.current.rotation.y = gsap.utils.interpolate(
      groupRef.current.rotation.y,
      scrollData.current.rotY,
      0.1
    );

    // Zoom em escala muito mais sutil e controlado
    const scale = gsap.utils.interpolate(
      groupRef.current.scale.x,
      scrollData.current.scale,
      0.1
    );
    groupRef.current.scale.set(scale, scale, scale);

    groupRef.current.position.y = gsap.utils.interpolate(
      groupRef.current.position.y,
      scrollData.current.posY,
      0.1
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Centralização exata do modelo no ponto [0,0,0] */}
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

export default function Product3DViewer() {
  const sectionRef = useRef(null);
  const container3DRef = useRef(null);

  // Escala compacta e elegante (0.008 inicial para 0.025 no zoom máximo)
  const scrollData = useRef({
    rotX: 0.15,
    rotY: Math.PI * 0.2,
    scale: 0.008, // Tamanho compacto e elegante inicial
    posY: 0,      // Totalmente centralizado no eixo Y
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.8,
        },
      });

      // 1. Fade-in do modelo centralizado a partir da tela preta
      tl.fromTo(
        container3DRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.3 }
      );

      // 2. Rotação em 360 Graus e Zoom-In proporcional elegante
      tl.to(
        scrollData.current,
        {
          rotY: Math.PI * 2.5,
          rotX: Math.PI * 0.35,
          scale: 0.025, // Zoom elegante que mantém o produto centralizado e limpo
          posY: 0,
          ease: 'power1.inOut',
          duration: 0.7,
        },
        '-=0.05'
      );

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs-3d"
      className="relative w-full h-screen bg-[#050508] overflow-hidden flex items-center justify-center z-20"
    >
      {/* Brilho radial de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* CONTAINER DO MODELO 3D CENTRALIZADO */}
      <div
        ref={container3DRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing opacity-0"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Iluminação de Estúdio */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 7]} intensity={3.0} color="#ffffff" castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#06b6d4" />
          <spotLight position={[0, 8, 2]} intensity={2.5} angle={0.6} penumbra={1} color="#38bdf8" />

          {/* Sombra de Contato no Chão ajustada ao novo tamanho */}
          <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={4} blur={1.5} far={2} color="#000000" />

          {/* Ambiente Reflexivo */}
          <Environment preset="city" />

          <Suspense fallback={<LoadingFallback />}>
            <GlassesModel scrollData={scrollData} />
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>
    </section>
  );
}
