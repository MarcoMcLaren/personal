import { Component, Suspense, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { MeshSculpture } from './MeshSculpture';
import { Starfield } from './Starfield';
import { chapters, useJourney } from './journey';
import styles from './Scene.module.css';

/** Keep the portfolio usable if WebGL is unavailable or its context fails. */
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function Scene() {
  const mobile = useIsMobile();
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const { state, chapter, progressBar } = useJourney();
  const status = useRef<HTMLSpanElement>(null);
  const activities = useRef(new Float32Array(3));
  const current = chapters[chapter];

  return (
    <>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.halo} />
        <SceneBoundary onFailure={() => setUnavailable(true)}>
          <Canvas
            dpr={mobile ? [1, 1.25] : [1, 1.75]}
            frameloop={paused ? 'demand' : 'always'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 11], fov: 42, near: 0.1, far: 100 }}
            fallback={null}
          >
            <Suspense fallback={null}>
              <Starfield mobile={mobile} />
              {([0, 1, 2] as const).map(role => (
                <MeshSculpture key={role} role={role} journey={state} mobile={mobile} paused={paused} activities={activities} status={status} />
              ))}
              {!mobile && !paused && (
                <EffectComposer multisampling={0}>
                  <Bloom intensity={0.35} luminanceThreshold={0.9} luminanceSmoothing={0.4} mipmapBlur />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>
        </SceneBoundary>
      </div>
      <div className={styles.journey} aria-hidden="true">
        <span className={styles.journeyTitle}>Living geometry</span>
        <span className={styles.chapter}><span className={styles.number}>{String(chapter + 1).padStart(2, '0')}</span> / 06 <span className={styles.chapterName}>{current.label}</span></span>
        <div className={styles.progress}><div ref={progressBar} className={styles.progressFill} /></div>
      </div>
      {!unavailable && (
        <aside className={styles.controls} aria-label="Background animation" data-mesh-ui>
          <div className={styles.feedback}>
            <span ref={status} className={styles.status}>Three meshes · continuous transformation</span>
            <span className={styles.hint}>{mobile ? 'Scroll to transform & travel · touch to interact' : 'Scroll to transform & travel · move to scatter · hold to gather'}</span>
          </div>
          <button
            className={styles.pause}
            onClick={() => setPaused(value => !value)}
            aria-pressed={paused}
            aria-label={paused ? 'Resume background motion' : 'Pause background motion'}
          >
            <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        </aside>
      )}
    </>
  );
}
