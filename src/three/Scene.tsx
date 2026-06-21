import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Galaxy } from './Galaxy';
import { FloatingPlanet } from './FloatingPlanet';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Camera rig: gentle parallax toward the pointer + a slow drift driven by
 * page scroll, so the cosmos feels alive as you read.
 */
function CameraRig() {
  const { camera, pointer } = useThree();
  const scrollRef = useRef(0);

  useFrame(() => {
    scrollRef.current =
      window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);

    const targetX = pointer.x * 1.2;
    const targetY = 1.6 + pointer.y * 0.6 + scrollRef.current * 2.5;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, scrollRef.current * 1.2, 0);
  });

  return null;
}

export function Scene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // Scale the cosmos down on small / low-power devices.
  const galaxyCount = isMobile ? 16000 : 60000;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];
  const enableBloom = !isMobile && !reducedMotion;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={dpr}
        frameloop="always"
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 1.6, 9], fov: 62 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#05010f']} />
          <fog attach="fog" args={['#05010f', 12, 26]} />

          <ambientLight intensity={0.4} />
          <pointLight position={[6, 4, 6]} intensity={40} color="#a855f7" />
          <pointLight position={[-8, -3, -4]} intensity={28} color="#22d3ee" />

          <Stars
            radius={70}
            depth={50}
            count={isMobile ? 1800 : 4500}
            factor={4}
            saturation={0}
            fade
            speed={reducedMotion ? 0 : 0.6}
          />

          <Galaxy count={galaxyCount} size={isMobile ? 0.06 : 0.045} />

          {!isMobile && (
            <>
              <FloatingPlanet
                position={[-6.5, 2.6, -3]}
                scale={1.1}
                color="#c084fc"
                emissive="#6d28d9"
                ring
                speed={0.9}
              />
              <FloatingPlanet
                position={[6.8, -2.2, -2]}
                scale={0.7}
                color="#22d3ee"
                emissive="#0e7490"
                speed={1.2}
              />
            </>
          )}

          <Sparkles
            count={isMobile ? 40 : 90}
            scale={[18, 10, 10]}
            size={3}
            speed={reducedMotion ? 0 : 0.4}
            color="#f0abfc"
            opacity={0.7}
          />

          {!reducedMotion && <CameraRig />}

          {enableBloom && (
            <EffectComposer>
              <Bloom
                intensity={1.15}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.25} darkness={0.85} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
