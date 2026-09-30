import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useStarTexture } from './useStarTexture';

/** A quiet, evenly scattered field with no spiral or celestial bodies. */
export function Starfield({ mobile }: { mobile: boolean }) {
  const texture = useStarTexture();
  const geometry = useMemo(() => {
    const count = mobile ? 350 : 1100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const random = (salt: number) => THREE.MathUtils.euclideanModulo(Math.sin(i * 127.1 + salt * 311.7) * 43758.5453, 1);
      positions.set([(random(1) - 0.5) * 65, (random(2) - 0.5) * 42, -8 - random(3) * 35], i * 3);
      const brightness = 0.2 + random(4) * 0.6;
      colors.set([brightness * 0.75, brightness * 0.83, brightness], i * 3);
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return result;
  }, [mobile]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry}>
      <pointsMaterial map={texture} vertexColors size={0.065} transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
