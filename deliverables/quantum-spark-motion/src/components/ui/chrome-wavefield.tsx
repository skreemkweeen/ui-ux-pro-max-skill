import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { gsap } from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WaveDef {
  depth: number;
  amplitude: number;
  frequency: number;
  speed: number;       // radians per millisecond
  opacity: number;
  yFrac: number;       // vertical center, 0–1 fraction of canvas height
  thickness: number;
  phase: number;       // initial phase offset in radians
}

interface Particle {
  x: number; y: number;
  size: number; opacity: number;
  vx: number; vy: number;
  life: number; maxLife: number;
}

// ─── Layer config: depth 0 = farthest back, 1 = closest foreground ───────────
const WAVES: WaveDef[] = [
  { depth: 0.05, amplitude: 12, frequency: 0.0028, speed: 0.00080, opacity: 0.06, yFrac: 0.08, thickness: 0.6, phase: 0.00 },
  { depth: 0.12, amplitude: 20, frequency: 0.0022, speed: 0.00120, opacity: 0.10, yFrac: 0.22, thickness: 1.0, phase: 1.30 },
  { depth: 0.24, amplitude: 32, frequency: 0.0016, speed: 0.00180, opacity: 0.17, yFrac: 0.35, thickness: 1.7, phase: 2.55 },
  { depth: 0.40, amplitude: 46, frequency: 0.0012, speed: 0.00260, opacity: 0.27, yFrac: 0.49, thickness: 2.5, phase: 0.80 },
  { depth: 0.58, amplitude: 60, frequency: 0.00090, speed: 0.00370, opacity: 0.40, yFrac: 0.62, thickness: 3.6, phase: 1.95 },
  { depth: 0.76, amplitude: 76, frequency: 0.00065, speed: 0.00520, opacity: 0.55, yFrac: 0.75, thickness: 5.0, phase: 3.10 },
  { depth: 0.92, amplitude: 94, frequency: 0.00048, speed: 0.00740, opacity: 0.70, yFrac: 0.87, thickness: 7.0, phase: 0.55 },
];

const PARTICLE_COUNT = 85;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function newParticle(w: number, h: number, spawnLeft = false): Particle {
  return {
    x: spawnLeft ? -4 : Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 1.2 + 0.2,
    opacity: Math.random() * 0.28 + 0.04,
    vx: Math.random() * 0.13 + 0.03,
    vy: (Math.random() - 0.5) * 0.04,
    life: spawnLeft ? 0 : Math.floor(Math.random() * 200),
    maxLife: Math.random() * 260 + 120,
  };
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  wave: WaveDef,
  t: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
  alpha: number,
) {
  const { amplitude, frequency, speed, opacity, yFrac, thickness, phase, depth } = wave;
  const baseY = yFrac * h;
  // Cursor influence scales with depth (foreground reacts most)
  const cursorShift = (cy - 0.5) * amplitude * depth * 0.55;
  const cursorPhase = (cx - 0.5) * Math.PI * 0.7 * depth;
  const a = opacity * alpha;

  ctx.beginPath();
  for (let x = 0; x <= w; x += 1.5) {
    const y = baseY + cursorShift + Math.sin(x * frequency + t * speed + phase + cursorPhase) * amplitude;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }

  // Chrome sheen: horizontal gradient simulates metallic light reflection
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0.00, `rgba(40,42,62,${a * 0.35})`);
  g.addColorStop(0.20, `rgba(110,112,142,${a * 0.65})`);
  g.addColorStop(0.40, `rgba(195,197,222,${a * 0.92})`);
  g.addColorStop(0.50, `rgba(235,237,255,${a})`);
  g.addColorStop(0.60, `rgba(195,197,222,${a * 0.92})`);
  g.addColorStop(0.80, `rgba(110,112,142,${a * 0.65})`);
  g.addColorStop(1.00, `rgba(40,42,62,${a * 0.35})`);
  ctx.strokeStyle = g;
  ctx.lineWidth = thickness;
  ctx.stroke();

  // Violet glow halo on foreground layers only
  if (depth > 0.50) {
    ctx.save();
    ctx.shadowColor = `rgba(140,80,255,${a * 0.30})`;
    ctx.shadowBlur = thickness * 4;
    ctx.strokeStyle = `rgba(140,80,255,${a * 0.18})`;
    ctx.lineWidth = thickness * 2;
    ctx.stroke();
    ctx.restore();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ChromeWavefield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const enteredRef = useRef(false);
  const enteredAtRef = useRef(0); // t-relative ms captured when inView fires

  const heroRef = useRef<HTMLElement>(null);
  const typRef = useRef<HTMLDivElement>(null);
  const inView = useInView(heroRef as React.RefObject<Element>, { once: true, margin: "-8% 0px" });

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 34, damping: 22, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 34, damping: 22, mass: 0.9 });

  // Mouse tracking → spring-smoothed cursor position
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  // GSAP cinematic entrance when section enters viewport
  useEffect(() => {
    if (!inView || !typRef.current) return;
    enteredRef.current = true;
    const els = typRef.current.querySelectorAll("[data-r]");
    gsap.fromTo(
      els,
      { y: "110%", opacity: 0, rotationX: 10 },
      {
        y: "0%",
        opacity: 1,
        rotationX: 0,
        duration: 1.35,
        ease: "power4.out",
        stagger: 0.065,
        delay: 0.15,
      }
    );
  }, [inView]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let W = 0;
    let H = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        newParticle(W, H)
      );
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const t0 = performance.now();

    function tick() {
      if (!ctx) return;
      const t = performance.now() - t0;

      // Latch entry time on first tick after inView fires
      if (enteredRef.current && enteredAtRef.current === 0) {
        enteredAtRef.current = t;
      }
      const elapsed = enteredRef.current ? t - enteredAtRef.current : 0;
      const alpha = Math.min(elapsed / 1500, 1);

      ctx.clearRect(0, 0, W, H);

      const cx = sx.get();
      const cy = sy.get();

      // Render wave layers back to front
      for (const wave of WAVES) {
        drawWave(ctx, wave, t, cx, cy, W, H, alpha);
      }

      // Ambient drifting particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > W || p.life >= p.maxLife) {
          particlesRef.current[i] = newParticle(W, H, true);
          continue;
        }
        const lf = p.life / p.maxLife;
        const fadeEnv =
          Math.min(lf * 6, 1) * (1 - Math.max((lf - 0.75) / 0.25, 0));
        ctx.fillStyle = `rgba(205,207,235,${p.opacity * fadeEnv * alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Radial vignette — darkens corners while keeping center luminous
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.20, W / 2, H / 2, H * 0.80);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,6,0.65)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [sx, sy]);

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative flex h-screen min-h-[680px] w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "#00000a" }}
    >
      {/* Chrome wavefield canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />

      {/* Thin grid — subliminal structure */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Top / bottom edge fades into surrounding page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(to bottom,#00000a,transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top,#00000a,transparent)" }}
      />

      {/* Violet ambient bloom behind typography */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%,rgba(140,80,255,0.045) 0%,transparent 58%)",
        }}
      />

      {/* ── Floating UI panel — top left ──────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute left-6 top-20 md:left-14"
        initial={{ opacity: 0, x: -14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
      >
        <div
          className="rounded-sm border px-4 py-3 backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <div
            className="mb-2 h-px"
            style={{ background: "rgba(140,80,255,0.6)" }}
          />
          <p
            className="text-[9px] uppercase tracking-[0.30em]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            CHROME WAVEFIELD
          </p>
          <p
            className="mt-0.5 text-[10px] font-semibold tracking-widest"
            style={{ color: "rgba(255,255,255,0.62)" }}
          >
            v 2026.1
          </p>
        </div>
      </motion.div>

      {/* ── Floating UI panel — top right ─────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute right-6 top-20 md:right-14"
        initial={{ opacity: 0, x: 14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.25 }}
      >
        <div
          className="rounded-sm border px-4 py-3 backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <div
            className="mb-2 h-px"
            style={{ background: "rgba(140,80,255,0.6)" }}
          />
          <p
            className="text-[9px] uppercase tracking-[0.30em]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            DEPTH LAYERS
          </p>
          <p
            className="mt-0.5 text-[10px] font-semibold tracking-widest"
            style={{ color: "rgba(255,255,255,0.62)" }}
          >
            07 ACTIVE
          </p>
        </div>
      </motion.div>

      {/* ── Floating UI panel — bottom right ──────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute bottom-20 right-6 md:right-14"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
      >
        <div
          className="flex items-center gap-2.5 rounded-sm border px-4 py-3 backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <div
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background: "rgba(140,80,255,0.95)",
              boxShadow: "0 0 7px rgba(140,80,255,0.75)",
            }}
          />
          <p
            className="text-[9px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(255,255,255,0.32)" }}
          >
            SIGNAL ACTIVE
          </p>
        </div>
      </motion.div>

      {/* ── Central editorial typography ───────────────────────────────── */}
      <div
        ref={typRef}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Eyebrow line */}
        <div style={{ overflow: "hidden", marginBottom: 28 }}>
          <p
            data-r
            className="text-[10px] uppercase tracking-[0.42em]"
            style={{ color: "rgba(255,255,255,0.24)" }}
          >
            Digital Design Studio · 2026
          </p>
        </div>

        {/* Studio wordmark — each word in its own overflow-hidden clip */}
        <h1 aria-label="ELEMENT UX" style={{ lineHeight: 0.84, letterSpacing: "-0.04em" }}>
          {["ELEMENT", "UX"].map((word) => (
            <span key={word} style={{ display: "block", overflow: "hidden" }}>
              <span
                data-r
                style={{
                  display: "block",
                  fontSize: "clamp(4.5rem,15vw,14rem)",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Violet/white ruled separator */}
        <motion.div
          className="my-8 h-px"
          style={{
            width: "min(18rem, 90vw)",
            background:
              "linear-gradient(90deg,transparent,rgba(140,80,255,0.65) 35%,rgba(255,255,255,0.5) 55%,transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        />

        {/* Sub-copy */}
        <div style={{ overflow: "hidden" }}>
          <p
            data-r
            className="max-w-sm text-[13px] leading-loose"
            style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}
          >
            We design and engineer interactive systems
            <br />
            for brands that treat detail as a discipline.
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-12 flex items-center gap-8">
          <div style={{ overflow: "hidden" }}>
            <a
              data-r
              href="/#work"
              className="group flex items-center gap-3"
              style={{ color: "rgba(255,255,255,0.52)" }}
            >
              <span
                className="inline-block h-px transition-all duration-500 ease-out group-hover:w-14"
                style={{ width: 28, background: "currentColor" }}
              />
              <span className="text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 group-hover:text-white">
                Selected Work
              </span>
            </a>
          </div>
          <div style={{ overflow: "hidden" }}>
            <a
              data-r
              href="/contact"
              className="rounded-sm border px-5 py-2.5 text-[10px] uppercase tracking-[0.26em] transition-all duration-300"
              style={{
                borderColor: "rgba(140,80,255,0.4)",
                color: "rgba(255,255,255,0.52)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(140,80,255,0.85)";
                el.style.color = "#fff";
                el.style.background = "rgba(140,80,255,0.07)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(140,80,255,0.4)";
                el.style.color = "rgba(255,255,255,0.52)";
                el.style.background = "transparent";
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>

      {/* Scroll pulse indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.9 }}
      >
        <motion.div
          className="h-10 w-px"
          style={{
            background:
              "linear-gradient(to bottom,transparent,rgba(140,80,255,0.55),transparent)",
          }}
          animate={{ scaleY: [1, 0.35, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <p
          className="text-[8px] uppercase tracking-[0.34em]"
          style={{ color: "rgba(255,255,255,0.17)" }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
