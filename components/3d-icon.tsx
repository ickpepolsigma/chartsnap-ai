'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function Icon3D({ shape, color, position }: { shape: 'candlestick' | 'arrow' | 'chart', color: string, position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const renderShape = () => {
    switch (shape) {
      case 'candlestick':
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.3, 1.2, 0.3]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      case 'arrow':
        return (
          <group>
            <mesh>
              <coneGeometry args={[0.3, 0.6, 4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      case 'chart':
        return (
          <group>
            <mesh position={[-0.3, -0.2, 0]}>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.15, 0.7, 0.15]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0.3, 0.4, 0]}>
              <boxGeometry args={[0.15, 1.0, 0.15]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderShape()}
    </group>
  );
}

function Scene({ shape, color }: { shape: 'candlestick' | 'arrow' | 'chart', color: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color={color} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Icon3D shape={shape} color={color} position={[0, 0, 0]} />
      </Float>
    </>
  );
}

export default function FloatingIcon3D({ shape, color }: { shape: 'candlestick' | 'arrow' | 'chart', color: string }) {
  return (
    <div className="w-16 h-16 relative">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene shape={shape} color={color} />
      </Canvas>
    </div>
  );
}
