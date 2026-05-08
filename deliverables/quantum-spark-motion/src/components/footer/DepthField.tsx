import { useEffect, useRef, type RefObject } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  depth: number;
  driftX: number;
  driftY: number;
  life: number;
  maxLife: number;
}

interface DepthFieldProps {
  containerRef: RefObject<HTMLElement>;
  count?: number;
}

function makeParticle(w: number, h: number, spawnAtBottom = false): Particle {
  const depth = Math.random();
  return {
    x: Math.random() * w,
    y: spawnAtBottom ? h + 8 : Math.random() * h,
    size: 0.4 + depth * 2.2,
    baseOpacity: 0.06 + depth * 0.38,
    depth,
    driftX: (Math.random() - 0.5) * 0.25,
    driftY: -(0.08 + Math.random() * 0.35) * (0.4 + depth * 0.6),
    life: spawnAtBottom ? 0 : Math.random() * 400,
    maxLife: 300 + Math.random() * 400,
  };
}

export function DepthField({ containerRef, count = 60 }: DepthFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.offsetWidth;
      canvas.height = p.offsetHeight;
      particlesRef.current = Array.from({ length: count }, () =>
        makeParticle(canvas.width, canvas.height)
      );
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const el = containerRef.current;
    const onMove = (e: MouseEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - r.left) / r.width;
      mouseRef.current.y = (e.clientY - r.top) / r.height;
    };
    if (el) el.addEventListener('mousemove', onMove);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      // Subtle static light shafts
      const shaft = (x0: number, x1: number, rr: number, g: number, b: number, a: number) => {
        const grad = ctx.createLinearGradient(x0 * w, 0, x1 * w, h);
        grad.addColorStop(0, `rgba(${rr},${g},${b},0)`);
        grad.addColorStop(0.35, `rgba(${rr},${g},${b},${a})`);
        grad.addColorStop(0.65, `rgba(${rr},${g},${b},${a * 0.6})`);
        grad.addColorStop(1, `rgba(${rr},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      };
      shaft(0.18, 0.26, 100, 80, 200, 0.025);
      shaft(0.72, 0.80, 80, 100, 200, 0.018);

      // Parallax offsets scale with depth (deeper = less movement)
      const px = (mouseRef.current.x - 0.5) * 28;
      const py = (mouseRef.current.y - 0.5) * 18;

      for (const p of particlesRef.current) {
        p.life += 1;
        p.x += p.driftX;
        p.y += p.driftY;

        const ox = p.x + px * p.depth;
        const oy = p.y + py * p.depth;

        const lifeFrac = p.life / p.maxLife;
        const fadeIn = lifeFrac < 0.12 ? lifeFrac / 0.12 : 1;
        const fadeOut = lifeFrac > 0.85 ? 1 - (lifeFrac - 0.85) / 0.15 : 1;
        const alpha = p.baseOpacity * fadeIn * fadeOut;

        const r = 170 + (p.depth * 50) | 0;
        const g = 155 + (p.depth * 30) | 0;
        const b = 215 + (p.depth * 40) | 0;

        ctx.beginPath();
        ctx.arc(ox, oy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Soft glow halo for near (high depth) particles
        if (p.depth > 0.65) {
          const haloR = p.size * 4;
          const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, haloR);
          grd.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.35})`);
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(ox, oy, haloR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Respawn below when particle exits top / sides / exhausted life
        if (
          p.y < -12 ||
          p.x < -12 ||
          p.x > w + 12 ||
          p.life >= p.maxLife
        ) {
          Object.assign(p, makeParticle(w, h, true));
        }
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (el) el.removeEventListener('mousemove', onMove);
    };
  }, [count, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 1 }}
    />
  );
}
