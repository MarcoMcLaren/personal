import { useEffect, useRef } from 'react';
import { useHasFinePointer } from '@/hooks/useMediaQuery';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

const PALETTE = [280, 265, 300, 190, 320]; // violet / cyan / magenta hues

/**
 * A full-viewport canvas that draws a glowing comet "shooting star" that
 * chases the cursor: a tapering trail + emitted sparks that drift and fade.
 * Pure canvas for performance; never intercepts pointer events.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasFinePointer = useHasFinePointer();

  useEffect(() => {
    if (!hasFinePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    document.body.classList.add('cursor-trail-active');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sparks: Spark[] = [];
    const trail: TrailPoint[] = [];
    const MAX_TRAIL = 22;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let prevX = mouseX;
    let prevY = mouseY;
    let hasMoved = false;
    let visible = false;
    let hueShift = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMoved = true;
      visible = true;
    };
    const onLeave = () => {
      visible = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave, { passive: true });

    const spawnSparks = (speed: number) => {
      // More movement → more sparks, like a comet shedding light.
      const count = Math.min(4, 1 + Math.floor(speed / 12));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 1.4;
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * spread - (mouseX - prevX) * 0.06,
          vy: Math.sin(angle) * spread - (mouseY - prevY) * 0.06 + 0.2,
          life: 0,
          maxLife: 45 + Math.random() * 35,
          size: 0.6 + Math.random() * 1.8,
          hue: PALETTE[(Math.floor(hueShift) + i) % PALETTE.length],
        });
      }
    };

    const drawStar = (x: number, y: number, r: number, hue: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4);
      grad.addColorStop(0, `hsla(${hue}, 100%, 92%, ${alpha})`);
      grad.addColorStop(0.4, `hsla(${hue}, 95%, 70%, ${alpha * 0.5})`);
      grad.addColorStop(1, `hsla(${hue}, 90%, 60%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 4, 0, Math.PI * 2);
      ctx.fill();

      // 4-point sparkle
      ctx.strokeStyle = `hsla(${hue}, 100%, 95%, ${alpha})`;
      ctx.lineWidth = Math.max(0.6, r * 0.5);
      ctx.beginPath();
      ctx.moveTo(-r * 2.6, 0);
      ctx.lineTo(r * 2.6, 0);
      ctx.moveTo(0, -r * 2.6);
      ctx.lineTo(0, r * 2.6);
      ctx.stroke();
      ctx.restore();
    };

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      const speed = Math.hypot(dx, dy);
      hueShift += 0.4;

      if (hasMoved && visible) {
        trail.push({ x: mouseX, y: mouseY, age: 0 });
        if (trail.length > MAX_TRAIL) trail.shift();
        if (speed > 1.5) spawnSparks(speed);
      }

      // ---- Comet trail (additive glow) ----
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];
        const t = i / trail.length;
        const hue = PALETTE[(Math.floor(hueShift * 0.5) + i) % PALETTE.length];
        ctx.strokeStyle = `hsla(${hue}, 100%, 75%, ${t * 0.5})`;
        ctx.lineWidth = t * 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      // ---- Sparks ----
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.012; // gentle gravity
        s.vx *= 0.99;
        s.vy *= 0.99;
        const lifeT = 1 - s.life / s.maxLife;
        if (lifeT <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 88%, ${lifeT})`);
        grad.addColorStop(1, `hsla(${s.hue}, 100%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- The cursor star itself ----
      if (visible) {
        const headHue = PALETTE[Math.floor(hueShift * 0.5) % PALETTE.length];
        drawStar(mouseX, mouseY, 3 + Math.min(speed * 0.12, 3), headHue, 0.95);
      }

      ctx.globalCompositeOperation = 'source-over';
      prevX = mouseX;
      prevY = mouseY;
    };
    render();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', resize);
      document.body.classList.remove('cursor-trail-active');
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    />
  );
}
