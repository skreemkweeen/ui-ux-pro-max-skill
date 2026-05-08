import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";

// ─── ELEMENT UX Circular Badge ────────────────────────────────────────────────
function ElementUXBadge({ glitch = false }: { glitch?: boolean }) {
  // 64 tick marks radiating from center, every 8th is major
  const ticks = Array.from({ length: 64 }, (_, i) => {
    const rad = (((i * 360) / 64 - 90) * Math.PI) / 180;
    const r1 = 141;
    const r2 = i % 8 === 0 ? 154 : i % 4 === 0 ? 149 : 145;
    return {
      x1: 200 + r1 * Math.cos(rad),
      y1: 200 + r1 * Math.sin(rad),
      x2: 200 + r2 * Math.cos(rad),
      y2: 200 + r2 * Math.sin(rad),
      major: i % 8 === 0,
    };
  });

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Arc paths for circular text */}
        <path id="euxTopArc" d="M 26,200 A 174,174 0 0,1 374,200" />
        <path id="euxBotArc" d="M 38,214 A 164,164 0 0,0 362,214" />
        <radialGradient id="badgeFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.035)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Subtle fill */}
      <circle cx="200" cy="200" r="184" fill="url(#badgeFill)" />

      {/* Outer ring — primary */}
      <circle
        cx="200" cy="200" r="184"
        fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5"
      />
      {/* Outer ring — secondary faint */}
      <circle
        cx="200" cy="200" r="177"
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5"
      />

      {/* Curved text — top */}
      <text
        fontSize="17"
        fill="white"
        letterSpacing="9"
        fontWeight="700"
        fontFamily="'Inter', 'Space Grotesk', sans-serif"
        opacity="0.9"
      >
        <textPath href="#euxTopArc" startOffset="50%" textAnchor="middle">
          ELEMENT UX
        </textPath>
      </text>

      {/* Curved text — bottom */}
      <text
        fontSize="17"
        fill="white"
        letterSpacing="9"
        fontWeight="700"
        fontFamily="'Inter', 'Space Grotesk', sans-serif"
        opacity="0.9"
      >
        <textPath href="#euxBotArc" startOffset="50%" textAnchor="middle">
          ELEMENT UX
        </textPath>
      </text>

      {/* Tick mark ring */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.major ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)"}
          strokeWidth={t.major ? 1.5 : 0.7}
        />
      ))}

      {/* Inner circle */}
      <circle
        cx="200" cy="200" r="128"
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"
      />

      {/* Diamond tick marks at N / E / S / W */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const r = 159;
        const cx = 200 + r * Math.cos(rad);
        const cy = 200 + r * Math.sin(rad);
        return (
          <rect
            key={deg}
            x={cx - 4} y={cy - 4}
            width="8" height="8"
            fill="white" opacity="0.72"
            transform={`rotate(45,${cx},${cy})`}
          />
        );
      })}

      {/* Four-dot clusters at 12 and 6 o'clock */}
      {[0, 180].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const bx = 200 + 160 * Math.cos(rad);
        const by = 200 + 160 * Math.sin(rad);
        return (
          <g key={deg} opacity="0.45">
            <rect x={bx - 6} y={by - 8} width="4" height="4" fill="white" />
            <rect x={bx + 2} y={by - 8} width="4" height="4" fill="white" />
            <rect x={bx - 6} y={by + 4} width="4" height="4" fill="white" />
            <rect x={bx + 2} y={by + 4} width="4" height="4" fill="white" />
          </g>
        );
      })}

      {/* ESTD bordered label */}
      <rect x="56" y="191" width="42" height="18" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <text x="77" y="204" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.62)" fontFamily="monospace" letterSpacing="2.5" fontWeight="600">
        ESTD
      </text>

      {/* 2024 bordered label */}
      <rect x="302" y="191" width="42" height="18" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <text x="323" y="204" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.62)" fontFamily="monospace" letterSpacing="2.5" fontWeight="600">
        2024
      </text>

      {/* ── Centre E mark ── */}

      {/* Red chromatic ghost (offset left+down) */}
      <g transform="translate(-3,1)" opacity={glitch ? 0.75 : 0.32}>
        <rect x="160" y="162" width="80" height="14" fill="rgba(255,30,30,0.75)" />
        <rect x="160" y="193" width="52" height="14" fill="rgba(255,30,30,0.75)" />
        <rect x="160" y="224" width="80" height="14" fill="rgba(255,30,30,0.75)" />
        <rect x="160" y="162" width="14" height="76" fill="rgba(255,30,30,0.75)" />
      </g>

      {/* Cyan chromatic ghost (offset right+up) */}
      <g transform="translate(3,-1)" opacity={glitch ? 0.75 : 0.32}>
        <rect x="160" y="162" width="80" height="14" fill="rgba(0,225,255,0.55)" />
        <rect x="160" y="193" width="52" height="14" fill="rgba(0,225,255,0.55)" />
        <rect x="160" y="224" width="80" height="14" fill="rgba(0,225,255,0.55)" />
        <rect x="160" y="162" width="14" height="76" fill="rgba(0,225,255,0.55)" />
      </g>

      {/* Primary white E mark */}
      {/* top bar */}
      <rect x="160" y="162" width="80" height="14" fill="white" />
      {/* middle bar — shorter, creates E not F */}
      <rect x="160" y="193" width="52" height="14" fill="white" />
      {/* bottom bar */}
      <rect x="160" y="224" width="80" height="14" fill="white" />
      {/* left vertical spine */}
      <rect x="160" y="162" width="14" height="76" fill="white" />
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function AboutStudio() {
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>, {
    once: true,
    margin: "-10% 0px",
  });

  // Spring-physics cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [16, -16]), {
    stiffness: 52,
    damping: 16,
    mass: 0.8,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-16, 16]), {
    stiffness: 52,
    damping: 16,
    mass: 0.8,
  });

  // Moving sheen — light reflection tracks tilt direction
  const sheenX = useTransform(mouseX, [-1, 1], ["28%", "72%"]);
  const sheenY = useTransform(mouseY, [-1, 1], ["28%", "72%"]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.065) 0%, transparent 58%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={{
        background: "#050508",
        paddingTop: "5rem",
        paddingBottom: "7rem",
        minHeight: "100vh",
      }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Top divider */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.055) 20%,rgba(255,255,255,0.055) 80%,transparent)",
        }}
      />

      {/* ── Three-column layout ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">

          {/* Left — studio copy */}
          <div className="flex flex-col gap-10 lg:pt-14">
            <Reveal>
              <div>
                <p
                  className="text-[9px] uppercase leading-[2.4] tracking-[0.44em]"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                >
                  ABOUT
                  <br />
                  STUDIO
                </p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <p
                className="text-sm leading-loose"
                style={{
                  color: "rgba(255,255,255,0.30)",
                  letterSpacing: "0.04em",
                  maxWidth: "16rem",
                }}
              >
                Strong &amp; Unique
                <br />
                Digital and Interface
                <br />
                Experience
              </p>
            </Reveal>
          </div>

          {/* Center — 3D badge */}
          <div className="mx-auto">
            {/* Ambient glow behind badge */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute rounded-full blur-3xl"
                style={{ width: 280, height: 280, background: "rgba(255,255,255,0.04)" }}
                animate={isHovered ? { opacity: 1, scale: 1.18 } : { opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Hit area for mouse tracking */}
              <div
                className="relative cursor-pointer"
                style={{ width: 340, height: 340 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsHovered(true)}
              >
                <motion.div
                  style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 920,
                    width: "100%",
                    height: "100%",
                  }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Moving sheen overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none z-10"
                    style={{ background: sheenBg }}
                  />
                  <ElementUXBadge glitch={isHovered} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right — credentials */}
          <div className="lg:pt-14 lg:text-right">
            <Reveal>
              <p
                className="text-[9px] uppercase leading-[2.4] tracking-[0.44em]"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                ENGINEERING
                <br />
                DIGITAL SYSTEMS
                <br />
                SINCE — 2024
              </p>
            </Reveal>
          </div>
        </div>

        {/* ── Bottom statement ────────────────────────────────────── */}
        <div className="mt-20 grid grid-cols-1 gap-6 lg:mt-28 lg:grid-cols-2">
          <div className="lg:col-start-2">
            <Reveal>
              <p
                className="font-semibold leading-tight"
                style={{
                  fontSize: "clamp(1.45rem,3.2vw,2.5rem)",
                  color: "#fff",
                  letterSpacing: "-0.022em",
                }}
              >
                Experienced design and engineering studio building brands,
                interfaces, and motion systems for the next era.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <p
                className="mt-6 max-w-md text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.26)",
                  letterSpacing: "0.035em",
                }}
              >
                We are a focused team of designers and engineers creating
                digital identities and experiences that redefine what brands
                can be.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.055) 20%,rgba(255,255,255,0.055) 80%,transparent)",
        }}
      />
    </section>
  );
}
