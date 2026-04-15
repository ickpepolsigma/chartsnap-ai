'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Badge3D({ text, color, position, scrollProgress = 0 }: { text: string, color: string, position: [number, number, number], scrollProgress?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation based on scroll + subtle mouse tilt
      const scrollRotation = scrollProgress * Math.PI * 2;
      const mouseX = (state.mouse.x * 0.5);
      const mouseY = (state.mouse.y * 0.5);
      groupRef.current.rotation.x = scrollRotation * 0.3 + mouseY * 0.3;
      groupRef.current.rotation.y = scrollRotation + mouseX * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Badge background */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 0.6, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>

      {/* Glow effect */}
      <pointLight color={color} intensity={0.5} distance={2} />
    </group>
  );
}

function Scene({ decision, scrollProgress }: { decision: 'Buy' | 'Sell' | 'Nothing', scrollProgress: number }) {
  const colors = {
    Buy: '#10b981',
    Sell: '#ef4444',
    Nothing: '#6b7280'
  };

  const text = {
    Buy: 'BUY',
    Sell: 'SELL',
    Nothing: 'WAIT'
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color={colors[decision]} />

      <Badge3D text={text[decision]} color={colors[decision]} position={[0, 0, 0]} scrollProgress={scrollProgress} />
    </>
  );
}

export default function DecisionBadge3D({ decision }: { decision: 'Buy' | 'Sell' | 'Nothing' }) {
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
    <div className="w-full h-24 relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene decision={decision} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
