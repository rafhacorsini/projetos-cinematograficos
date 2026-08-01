import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MODEL_PATH = '/3d-oculos/curved_sunglasses.glb';

function ChoreographedGlasses({ scrollData }) {
  const groupRef = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  // Material Cyan Neon HD Permanente
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

  // Interpolação fluida frame a frame
  useFrame(() => {
    if (!groupRef.current) return;

    // Rotação suave nos eixos X, Y, Z
    groupRef.current.rotation.x = gsap.utils.interpolate(groupRef.current.rotation.x, scrollData.current.rotX, 0.08);
    groupRef.current.rotation.y = gsap.utils.interpolate(groupRef.current.rotation.y, scrollData.current.rotY, 0.08);
    groupRef.current.rotation.z = gsap.utils.interpolate(groupRef.current.rotation.z, scrollData.current.rotZ, 0.08);

    // Posição suave X, Y, Z
    groupRef.current.position.x = gsap.utils.interpolate(groupRef.current.position.x, scrollData.current.posX, 0.08);
    groupRef.current.position.y = gsap.utils.interpolate(groupRef.current.position.y, scrollData.current.posY, 0.08);
    groupRef.current.position.z = gsap.utils.interpolate(groupRef.current.position.z, scrollData.current.posZ, 0.08);

    // Escala suave controlada
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

export default function GlassesPage() {
  const sectionRef = useRef(null);

  // Estado inicial: Óculos Reto de Frente, Centralizado, 100% Enquadrado
  const scrollData = useRef({
    rotX: 0,
    rotY: Math.PI, // 180° de frente
    rotZ: 0,
    scale: 0.014,  // Escala segura dentro da viewport
    posX: 0,       // Centro inicial
    posY: 0,
    posZ: 0,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.8,
        },
      });

      // FASE 1: Na primeira rolagem, o óculos JÁ GIRA DE LADO (30°) enquanto aproxima suavemente (Zoom In sutil)
      tl.to(scrollData.current, {
        posX: 0.9,                       // Move para a direita mantendo 100% visível sem cortar
        rotY: Math.PI + Math.PI * 0.3,   // Rotação dinâmica de lado
        rotX: 0.12,                      // Ligeira inclinação 3D estática
        scale: 0.021,                    // Aproximação controlada
        duration: 0.3,
        ease: 'power1.inOut',
      });

      // FASE 2: Afasta sutilmente (Zoom Out) enquanto gira continuamente e atravessa para o lado esquerdo
      tl.to(scrollData.current, {
        posX: -0.9,                      // Move para a esquerda mantendo 100% visível sem cortar
        rotY: Math.PI - Math.PI * 0.35,  // Inverte a rotação mostrando o perfil esquerdo
        rotX: -0.08,                     // Inclinação sutil oposta
        scale: 0.016,                    // Afasta um pouco (dinâmica de zoom out)
        duration: 0.4,
        ease: 'power1.inOut',
      });

      // FASE 3: Giro de destaque final, re-aproximação (Zoom In) e posicionamento hero central
      tl.to(scrollData.current, {
        posX: 0,                         // Retorna ao centro perfeito
        rotY: Math.PI * 2.25,            // Giro 3D fluido completando o panorama
        rotX: 0.1,                       // Ângulo de exibição estético
        scale: 0.023,                    // Zoom final de destaque 100% dentro dos limites
        duration: 0.3,
        ease: 'power1.inOut',
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-screen h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden"
    >
      {/* Fundo escuro com brilho radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* CANVAS 3D DA COREOGRAFIA DINÂMICA ENQUADRADA */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Iluminação de Estúdio Profissional */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 7]} intensity={3.5} color="#ffffff" castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={2.0} color="#06b6d4" />
          <spotLight position={[0, 8, 2]} intensity={3.0} angle={0.6} penumbra={1} color="#ffffff" />

          {/* Sombra de Contato Dinâmica no Chão */}
          <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={5} blur={1.5} far={2} color="#000000" />

          {/* Ambiente Reflexivo */}
          <Environment preset="city" />

          <Suspense fallback={<LoadingFallback />}>
            <ChoreographedGlasses scrollData={scrollData} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
