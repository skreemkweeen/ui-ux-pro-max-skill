import { useEffect, useRef } from 'react';

interface GrainOverlayProps {
  opacity?: number;
  fps?: number;
}

export function GrainOverlay({ opacity = 0.04, fps = 20 }: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const intervalMs = 1000 / fps;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const sync = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    sync();

    const ro = new ResizeObserver(sync);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const tick = (t: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (t - lastTimeRef.current < intervalMs) return;
      lastTimeRef.current = t;

      const { width: w, height: h } = canvas;
      if (!w || !h) return;

      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = n;
        d[i + 3] = (Math.random() * 80) | 0;
      }
      ctx.putImageData(img, 0, 0);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [intervalMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity, mixBlendMode: 'overlay', zIndex: 50 }}
    />
  );
}
