'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Candlestick({ position = [0, 0, 0], color = '#10b981', scrollProgress = 0 }: { position?: [number, number, number], color?: string, scrollProgress?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation based on scroll position + gentle auto-rotation
      const scrollRotation = scrollProgress * Math.PI * 2;
      const autoRotation = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = scrollRotation + autoRotation + (hovered ? 0.5 : 0);
      meshRef.current.rotation.x = scrollProgress * 0.5;

      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Candle body */}
      <mesh>
        <boxGeometry args={[0.4, 2, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Upper wick */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Lower wick */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Glow effect */}
      <pointLight color={color} intensity={hovered ? 2 : 1} distance={3} />
    </group>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Candlestick position={[0, 0, 0]} color="#10b981" scrollProgress={scrollProgress} />
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <Candlestick position={[2, 0.5, -1]} color="#ef4444" scrollProgress={scrollProgress} />
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <Candlestick position={[-2, -0.3, -0.5]} color="#10b981" scrollProgress={scrollProgress} />
      </Float>

      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.35}>
        <Candlestick position={[1.5, -0.8, -2]} color="#ef4444" scrollProgress={scrollProgress} />
      </Float>

      <Float speed={1.7} rotationIntensity={0.45} floatIntensity={0.45}>
        <Candlestick position={[-1.5, 0.8, -1.5]} color="#10b981" scrollProgress={scrollProgress} />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function CandlestickScene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
