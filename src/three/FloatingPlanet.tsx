import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingPlanetProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  emissive?: string;
  ring?: boolean;
  speed?: number;
}

/**
 * A softly morphing, self-lit planet that drifts in place. An optional tilted
 * ring gives it a Saturn-like silhouette. Used as a depth accent behind content.
 */
export function FloatingPlanet({
  position = [0, 0, 0],
  scale = 1,
  color = '#a855f7',
  emissive = '#5b21b6',
  ring = false,
  speed = 1,
}: FloatingPlanetProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15 * speed;
    }
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.5} floatIntensity={1.1}>
      <group ref={group} position={position} scale={scale}>
        <mesh>
          <icosahedronGeometry args={[1, 12]} />
          <MeshDistortMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.6}
            roughness={0.35}
            metalness={0.4}
            distort={0.28}
            speed={1.6}
          />
        </mesh>
        {ring && (
          <mesh rotation={[Math.PI * 0.42, 0.3, 0]}>
            <ringGeometry args={[1.5, 2.2, 80]} />
            <meshBasicMaterial
              color={color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.28}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}
