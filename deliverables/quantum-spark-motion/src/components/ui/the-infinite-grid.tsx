import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";

// ─── Content ──────────────────────────────────────────────────────────────────
type Phrase = [line1: string, line2: string];

const PHRASES: Phrase[] = [
  ["WE DESIGN", "WHAT THE FUTURE FEELS LIKE"],
  ["DIGITAL WORLDS", "BUILT WITH INTENTION"],
  ["BRANDS ENGINEERED", "FOR THE NEXT ERA"],
  ["DESIGNING SIGNALS", "IN THE DIGITAL VOID"],
  ["WHERE INTERFACES", "BECOME EXPERIENCES"],
  ["MOTION ·", "INTERFACE · ATMOSPHERE"],
  ["THE FUTURE HAS", "A VISUAL LANGUAGE"],
  ["BUILDING BRANDS", "THAT FEEL ALIVE"],
];

const LABELS = [
  "SYSTEM",
  "SIGNAL",
  "LIVE",
  "ENGINEERED",
  "INTERFACE",
  "ARCHIVE",
  "MOTION",
];

// ─── Grid config ──────────────────────────────────────────────────────────────
interface GridLayer {
  size: number;     // cell size in px
  opacity: number;  // line opacity at alpha = 1
  speedX: number;   // horizontal drift in px/sec
  speedY: number;   // vertical drift in px/sec
  parallax: number; // cursor influence factor
}

// Two layers: fine mesh drifts faster than coarse scaffold
const GRID_LAYERS: GridLayer[] = [
  { size: 44,  opacity: 0.030, speedX: 4.0, speedY: 2.5, parallax: 0.008 },
  { size: 132, opacity: 0.050, speedX: 7.0, speedY: 4.0, parallax: 0.018 },
];

// ─── Signal pulse ─────────────────────────────────────────────────────────────
interface Signal {
  id: number;
  axis: "x" | "y";
  pos: number;     // current position in px
  speed: number;   // px per ms
  maxDist: number; // screen width or height
}

// ─── Canvas draw helpers ──────────────────────────────────────────────────────
function drawGridLayer(
  ctx: CanvasRenderingContext2D,
  layer: GridLayer,
  t: number,
  cx: number,
  cy: number,
  W: number,
  H: number,
  alpha: number,
) {
  const ox = ((t * layer.speedX) / 1000 + (cx - 0.5) * W * layer.parallax) % layer.size;
  const oy = ((t * layer.speedY) / 1000 + (cy - 0.5) * H * layer.parallax) % layer.size;
  const lineAlpha = layer.opacity * alpha;

  ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = (ox % layer.size) - layer.size; x <= W + layer.size; x += layer.size) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = (oy % layer.size) - layer.size; y <= H + layer.size; y += layer.size) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();

  // Accent intersection dots on the coarse grid only
  if (layer.size >= 132) {
    ctx.fillStyle = `rgba(255,255,255,${lineAlpha * 2.2})`;
    for (let x = (ox % layer.size) - layer.size; x <= W + layer.size; x += layer.size) {
      for (let y = (oy % layer.size) - layer.size; y <= H + layer.size; y += layer.size) {
        ctx.beginPath();
        ctx.arc(x, y, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawSignals(
  ctx: CanvasRenderingContext2D,
  signals: Signal[],
  W: number,
  H: number,
  alpha: number,
) {
  for (const sig of signals) {
    const { axis, pos, maxDist } = sig;
    const fadeIn = Math.min(pos / 220, 1);
    const fadeOut = Math.min((maxDist - pos) / 220, 1);
    const a = fadeIn * fadeOut * 0.13 * alpha;
    if (a < 0.001) continue;

    if (axis === "x") {
      const g = ctx.createLinearGradient(pos - 55, 0, pos + 55, 0);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.35, `rgba(255,255,255,${a * 0.45})`);
      g.addColorStop(0.50, `rgba(255,255,255,${a})`);
      g.addColorStop(0.65, `rgba(255,255,255,${a * 0.45})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(pos - 55, 0, 110, H);
    } else {
      const g = ctx.createLinearGradient(0, pos - 55, 0, pos + 55);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.35, `rgba(255,255,255,${a * 0.45})`);
      g.addColorStop(0.50, `rgba(255,255,255,${a})`);
      g.addColorStop(0.65, `rgba(255,255,255,${a * 0.45})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, pos - 55, W, 110);
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TheInfiniteGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const signalsRef = useRef<Signal[]>([]);
  const sigIdRef = useRef(0);
  const nextSignalRef = useRef(8000); // t-value of next signal spawn
  const enteredRef = useRef(false);
  const enteredAtRef = useRef(0); // t-relative ms when inView fired

  const heroRef = useRef<HTMLElement>(null);
  const typRef = useRef<HTMLDivElement>(null);
  const inView = useInView(heroRef as React.RefObject<Element>, {
    once: true,
    margin: "-5% 0px",
  });

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [labelIdx, setLabelIdx] = useState(0);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 28, damping: 25, mass: 1.2 });
  const sy = useSpring(my, { stiffness: 28, damping: 25, mass: 1.2 });

  // Mouse tracking → spring-smoothed cursor position
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  // GSAP entrance + phrase/label cycling
  useEffect(() => {
    if (!inView) return;
    enteredRef.current = true;

    if (typRef.current) {
      const els = typRef.current.querySelectorAll("[data-r]");
      gsap.fromTo(
        els,
        { y: "100%", opacity: 0, rotationX: 8 },
        {
          y: "0%",
          opacity: 1,
          rotationX: 0,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.2,
        }
      );
    }

    let phraseTimer: ReturnType<typeof setInterval>;
    const phraseStart = setTimeout(() => {
      phraseTimer = setInterval(
        () => setPhraseIdx((i) => (i + 1) % PHRASES.length),
        4500
      );
    }, 2000);

    const labelTimer = setInterval(
      () => setLabelIdx((i) => (i + 1) % LABELS.length),
      3200
    );

    return () => {
      clearTimeout(phraseStart);
      clearInterval(phraseTimer);
      clearInterval(labelTimer);
    };
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
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const t0 = performance.now();
    let lastT = 0;

    function tick(now: number) {
      const t = now - t0;
      const dt = lastT === 0 ? 16 : t - lastT;
      lastT = t;

      // Latch entry timestamp on first tick after inView fires
      if (enteredRef.current && enteredAtRef.current === 0) {
        enteredAtRef.current = t;
      }
      const elapsed = enteredRef.current ? t - enteredAtRef.current : 0;
      const alpha = Math.min(elapsed / 1800, 1);

      ctx.clearRect(0, 0, W, H);

      const cx = sx.get();
      const cy = sy.get();

      // Grid layers (fine → coarse)
      for (const layer of GRID_LAYERS) {
        drawGridLayer(ctx, layer, t, cx, cy, W, H, alpha);
      }

      // Cursor-reactive brightness highlight
      if (alpha > 0) {
        const curX = cx * W;
        const curY = cy * H;
        const rg = ctx.createRadialGradient(curX, curY, 0, curX, curY, 320);
        rg.addColorStop(0, `rgba(255,255,255,${0.028 * alpha})`);
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
      }

      // Signal pulse spawn
      if (enteredRef.current && t > nextSignalRef.current) {
        const axis = Math.random() > 0.5 ? "x" : "y";
        signalsRef.current.push({
          id: sigIdRef.current++,
          axis,
          pos: 0,
          speed: 0.15 + Math.random() * 0.09,
          maxDist: axis === "x" ? W : H,
        });
        nextSignalRef.current = t + 7000 + Math.random() * 6000;
      }

      // Advance and cull signals
      signalsRef.current = signalsRef.current.filter(
        (s) => s.pos < s.maxDist + 80
      );
      for (const sig of signalsRef.current) sig.pos += sig.speed * dt;
      drawSignals(ctx, signalsRef.current, W, H, alpha);

      // Atmospheric vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,2,0.72)");
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

  const [line1, line2] = PHRASES[phraseIdx];

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050508" }}
    >
      {/* Infinite grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />

      {/* Atmospheric depth overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 50%,rgba(12,12,18,0) 25%,rgba(5,5,8,0.82) 100%)",
        }}
      />

      {/* Edge fades into surrounding page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-36"
        style={{ background: "linear-gradient(to bottom,#050508,transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
        style={{ background: "linear-gradient(to top,#050508,transparent)" }}
      />

      {/* Subtle chrome bloom at center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 28% at 50% 42%,rgba(220,222,240,0.018) 0%,transparent 55%)",
        }}
      />

      {/* ── Thin horizontal UI dividers ─────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 px-8 md:px-16"
        style={{ top: "18%" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.8, delay: 1.2 }}
      >
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.055) 20%,rgba(255,255,255,0.055) 80%,transparent)",
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 px-8 md:px-16"
        style={{ bottom: "18%" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.8, delay: 1.3 }}
      >
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.055) 20%,rgba(255,255,255,0.055) 80%,transparent)",
          }}
        />
      </motion.div>

      {/* ── Corner UI indicators ─────────────────────────────────────── */}

      {/* Top left: system + cycling label */}
      <motion.div
        className="pointer-events-none absolute left-6 top-8 md:left-10 md:top-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.4 }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-px w-4" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span
              className="text-[8px] uppercase tracking-[0.38em]"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              SYS / 2026
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={labelIdx}
              className="pl-6 text-[8px] uppercase tracking-[0.38em]"
              style={{ color: "rgba(255,255,255,0.11)" }}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.5 }}
            >
              {LABELS[labelIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Top right: studio name */}
      <motion.div
        className="pointer-events-none absolute right-6 top-8 md:right-10 md:top-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.5 }}
      >
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="text-[8px] uppercase tracking-[0.38em]"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              ELEMENT UX
            </span>
            <div className="h-px w-4" style={{ background: "rgba(255,255,255,0.2)" }} />
          </div>
          <span
            className="pr-6 text-[8px] uppercase tracking-[0.38em]"
            style={{ color: "rgba(255,255,255,0.11)" }}
          >
            STUDIO
          </span>
        </div>
      </motion.div>

      {/* Bottom left: studio descriptor */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-6 md:left-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.6 }}
      >
        <div className="flex flex-col gap-1">
          <div className="h-px w-7" style={{ background: "rgba(255,255,255,0.12)" }} />
          <span
            className="text-[8px] uppercase tracking-[0.38em]"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            DIGITAL DESIGN STUDIO
          </span>
        </div>
      </motion.div>

      {/* Bottom right: live pulse */}
      <motion.div
        className="pointer-events-none absolute bottom-10 right-6 md:right-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.7 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "rgba(210,212,230,0.65)" }}
            animate={{ opacity: [0.65, 0.18, 0.65] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-[8px] uppercase tracking-[0.38em]"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            LIVE
          </span>
        </div>
      </motion.div>

      {/* ── Central editorial typography ─────────────────────────────── */}
      <div
        ref={typRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Eyebrow */}
        <div style={{ overflow: "hidden", marginBottom: 36 }}>
          <p
            data-r
            className="text-[9px] uppercase tracking-[0.50em]"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            Est. 2026 · Digital Design Studio
          </p>
        </div>

        {/* Rotating headline — fixed-height container prevents layout shift */}
        <div
          className="relative w-full"
          style={{ minHeight: "clamp(4rem,14vw,16rem)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIdx}
              className="absolute inset-x-0 top-0 text-center"
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(2rem,7vw,8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.88,
                  color: "#fff",
                }}
              >
                {line1}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(2rem,7vw,8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.88,
                  color: "rgba(255,255,255,0.58)",
                  marginTop: "0.12em",
                }}
              >
                {line2}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Separator rule */}
        <motion.div
          className="h-px"
          style={{
            width: "min(12rem,70vw)",
            marginTop: 32,
            marginBottom: 28,
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.20) 50%,transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        />

        {/* Sub-copy */}
        <div style={{ overflow: "hidden" }}>
          <p
            data-r
            className="max-w-sm text-[12px] leading-loose"
            style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.07em" }}
          >
            Brand systems · Digital experiences · Motion identity
            <br />
            for the brands that define what comes next.
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div style={{ overflow: "hidden" }}>
            <a
              data-r
              href="/#work"
              className="group flex items-center gap-3"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              <span
                className="inline-block h-px transition-all duration-500 ease-out group-hover:w-14"
                style={{ width: 22, background: "currentColor" }}
              />
              <span className="text-[9px] uppercase tracking-[0.32em] transition-colors duration-300 group-hover:text-white">
                Selected Work
              </span>
            </a>
          </div>
          <div style={{ overflow: "hidden" }}>
            <a
              data-r
              href="/contact"
              className="rounded-sm border px-5 py-2.5 text-[9px] uppercase tracking-[0.28em] transition-all duration-300"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.42)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(255,255,255,0.45)";
                el.style.color = "#fff";
                el.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(255,255,255,0.12)";
                el.style.color = "rgba(255,255,255,0.42)";
                el.style.background = "transparent";
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>

      {/* Scroll pulse */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2.2 }}
      >
        <motion.div
          className="h-10 w-px"
          style={{
            background:
              "linear-gradient(to bottom,transparent,rgba(255,255,255,0.28),transparent)",
          }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <p
          className="text-[7px] uppercase tracking-[0.38em]"
          style={{ color: "rgba(255,255,255,0.14)" }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
