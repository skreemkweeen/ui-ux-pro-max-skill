'use client';

import { useRef, MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Orb geometry + animation ──────────────────────────────────────────── */
interface OrbProps {
  mousePos: MutableRefObject<{ x: number; y: number }>;
}

function Orb({ mousePos }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  /* Separate tracking refs avoid React re-renders on every frame */
  const currentX = useRef(0.65);
  const currentY = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    /* Slow, continuous world-space rotation */
    meshRef.current.rotation.y += 0.0035;
    meshRef.current.rotation.z += 0.001;

    /* Organic float on Y axis */
    const floatY = Math.sin(t * 0.45) * 0.12;

    /* Target position driven by mouse parallax */
    const targetX = 0.65 + mousePos.current.x * 0.45;
    const targetY = floatY + mousePos.current.y * 0.28;

    /* Smooth lerp — the slower the factor, the more "weight" the sphere has */
    currentX.current += (targetX - currentX.current) * 0.035;
    currentY.current += (targetY - currentY.current) * 0.035;

    meshRef.current.position.x = currentX.current;
    meshRef.current.position.y = currentY.current;
  });

  return (
    <mesh ref={meshRef} position={[0.65, 0, 0]}>
      {/* High vertex count for smooth transmission gradients */}
      <sphereGeometry args={[1.45, 128, 128]} />
      <MeshTransmissionMaterial
        /* Glass body */
        transmission={1}
        thickness={0.45}
        roughness={0.02}
        /* Optical effects */
        chromaticAberration={0.06}
        anisotropy={0.15}
        /* Iridescent sheen */
        iridescence={0.9}
        iridescenceIOR={1.25}
        iridescenceThicknessRange={[0, 1400]}
        /* Transmission rendering */
        backside
        backsideThickness={0.3}
        samples={12}
        resolution={512}
        /* Subtle geometric distortion */
        distortionScale={0.25}
        temporalDistortion={0.07}
        /* Tint — near-clear with slight warm cast */
        color="#e8e8e8"
        attenuationColor="#f0ece8"
        attenuationDistance={0.9}
        /* Environment influence */
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ─── Canvas wrapper ─────────────────────────────────────────────────────── */
interface SceneProps {
  mousePos: MutableRefObject<{ x: number; y: number }>;
}

export default function Scene({ mousePos }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      {/* Subtle fill light from top-front */}
      <ambientLight intensity={0.08} />
      {/* Key light — cool white */}
      <spotLight position={[6, 8, 4]} intensity={2.5} color="#ffffff" angle={0.35} penumbra={1} />
      {/* Rim light — warm, from behind-right */}
      <spotLight position={[-4, -3, -3]} intensity={0.6} color="#ffeecc" angle={0.5} penumbra={1} />
      {/* Accent fill — tiny red echo matching the UI accent */}
      <pointLight position={[0, -4, 2]} intensity={0.3} color="#ff2222" />
      {/* HDR environment for refraction content */}
      <Environment
        preset="studio"
        resolution={256}
        backgroundBlurriness={1}
        backgroundIntensity={0}
      />
      <Orb mousePos={mousePos} />
    </Canvas>
  );
}
