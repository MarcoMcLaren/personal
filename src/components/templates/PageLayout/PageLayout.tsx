import { Suspense, lazy, type ReactNode } from 'react';
import { Navbar } from '@/components/organisms/Navbar/Navbar';
import { Footer } from '@/components/organisms/Footer/Footer';
import { CursorTrail } from '@/effects/CursorTrail';
import styles from './PageLayout.module.css';

// Defer the WebGL bundle so first paint isn't blocked by Three.js.
const Scene = lazy(() =>
  import('@/three/Scene').then((m) => ({ default: m.Scene }))
);

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * The page chrome: scroll-driven mesh sculpture, readability scrim, cursor comet,
 * navigation and footer. Pages drop their organisms into the <main> slot.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <a className={styles.skipLink} href="#about">
        Skip to content
      </a>

      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <div className={styles.scrim} aria-hidden="true" />

      <CursorTrail />
      <Navbar />

      <main className={styles.main}>{children}</main>

      <Footer />
    </>
  );
}
