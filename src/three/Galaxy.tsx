import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStarTexture } from './useStarTexture';

interface GalaxyProps {
  count?: number;
  branches?: number;
  radius?: number;
  spin?: number;
  randomness?: number;
  randomnessPower?: number;
  insideColor?: string;
  outsideColor?: string;
  size?: number;
}

/**
 * A spiral galaxy built as a single Points cloud — the classic generator:
 * particles are distributed along rotating branches, scattered with a
 * power-curved randomness, and colour-lerped from a hot core to a cool rim.
 */
export function Galaxy({
  count = 60000,
  branches = 5,
  radius = 9,
  spin = 1.1,
  randomness = 0.25,
  randomnessPower = 3.2,
  insideColor = '#f6b8ff',
  outsideColor = '#22d3ee',
  size = 0.045,
}: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const starTexture = useStarTexture();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r;
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r *
        0.5;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixed = colorInside.clone().lerp(colorOutside, r / radius);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    return { positions, colors };
  }, [count, branches, radius, spin, randomness, randomnessPower, insideColor, outsideColor]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef} rotation={[Math.PI * 0.06, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
        map={starTexture}
        alphaMap={starTexture}
      />
    </points>
  );
}
