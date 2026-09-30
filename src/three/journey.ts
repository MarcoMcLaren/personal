import { useEffect, useRef, useState } from 'react';

export const chapters = [
  { id: 'top', label: 'Genesis', shape: 'Icosahedron' },
  { id: 'about', label: 'Origin', shape: 'Toroidal lattice' },
  { id: 'experience', label: 'Trajectory', shape: 'Octahedral spire' },
  { id: 'skills', label: 'Systems', shape: 'Twisted hexahedron' },
  { id: 'awards', label: 'Radiance', shape: 'Stellated polyhedron' },
  { id: 'contact', label: 'Connection', shape: 'Open constellation' },
] as const;

export interface JourneyState {
  stage: number;
  formation: number;
  progress: number;
  scrollSpeed: number;
  scrollTime: number;
  pointer: { x: number; y: number; active: boolean; pressed: boolean; speed: number; movedAt: number; release: number };
}

/** Measure chapter anchors only when layout changes, never in the render loop. */
export function useJourney() {
  const state = useRef<JourneyState>({
    stage: 0, formation: 1, progress: 0, scrollSpeed: 0, scrollTime: 0,
    pointer: { x: 0, y: 0, active: false, pressed: false, speed: 0, movedAt: 0, release: 0 },
  });
  const [chapter, setChapter] = useState(0);
  const progressBar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let anchors: number[] = [];
    let pageHeight = 1;
    let previousY = window.scrollY;
    let previousScrollTime = performance.now();
    const update = () => {
      const y = window.scrollY;
      const now = performance.now();
      state.current.scrollSpeed = Math.min(2, Math.abs(y - previousY) / Math.max(16, now - previousScrollTime) * 0.08);
      state.current.scrollTime = now;
      previousY = y;
      previousScrollTime = now;
      let index = 0;
      while (index < anchors.length - 1 && y >= anchors[index + 1]) index++;
      const next = anchors[index + 1];
      const fraction = Math.min(1, Math.max(0, (y - anchors[index]) / Math.max(1, (next ?? pageHeight) - anchors[index])));
      // Every pixel advances the morph. Surfaces stay assembled through transitions.
      state.current.stage = index + (next === undefined ? 0 : fraction);
      state.current.progress = Math.min(1, Math.max(0, y / pageHeight));
      setChapter(index);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${state.current.progress})`;
    };
    const measure = () => {
      pageHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      anchors = chapters.map(({ id }, index) => {
        const element = document.getElementById(id);
        const top = element ? element.getBoundingClientRect().top + window.scrollY : pageHeight;
        return index === 0 ? 0 : Math.min(pageHeight, Math.max(0, top - window.innerHeight * 0.28));
      });
      update();
    };
    const pointer = (event: PointerEvent) => {
      const p = state.current.pointer;
      const x = event.clientX / window.innerWidth * 2 - 1;
      const y = 1 - event.clientY / window.innerHeight * 2;
      const now = performance.now();
      p.speed = Math.min(4, Math.hypot(x - p.x, y - p.y) / Math.max(0.016, (now - p.movedAt) / 1000));
      p.x = x; p.y = y; p.movedAt = now;
      p.active = !(event.target instanceof Element && event.target.closest('[data-mesh-ui], header, footer, a, button, input, textarea, select, [role="button"]'));
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointer(event);
      state.current.pointer.pressed = state.current.pointer.active;
      // Mesh gestures on open background must not start a page text selection.
      // Touch keeps its native scrolling behaviour; glass panels remain normal UI.
      if (state.current.pointer.pressed && event.pointerType !== 'touch') event.preventDefault();
    };
    const up = (event?: PointerEvent) => {
      if (state.current.pointer.pressed) state.current.pointer.release++;
      state.current.pointer.pressed = false;
      if (event?.pointerType === 'touch') state.current.pointer.active = false;
    };
    const resetPointer = () => { up(); state.current.pointer.active = false; state.current.pointer.speed = 0; };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('pointerdown', down, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', resetPointer);
    window.addEventListener('blur', resetPointer);
    document.documentElement.addEventListener('pointerleave', resetPointer);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', resetPointer);
      window.removeEventListener('blur', resetPointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
    };
  }, []);
  return { state, chapter, progressBar };
}
