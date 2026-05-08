import { useState } from 'react';
import { motion } from 'framer-motion';

interface HolographicRibbonProps {
  title: string;
  phrases: string[];
  /** Pixels per second */
  speed?: number;
  reverse?: boolean;
  size?: 'large' | 'small';
  accentColor?: string;
}

function buildSegment(title: string, phrases: string[]): string {
  return [title, ...phrases].join(' — ') + ' — ';
}

export function HolographicRibbon({
  title,
  phrases,
  speed = 42,
  reverse = false,
  size = 'large',
  accentColor = '120, 80, 255',
}: HolographicRibbonProps) {
  const [hovered, setHovered] = useState(false);

  const segment = buildSegment(title, phrases);
  // Doubled content: animate from 0% to -50% for a seamless loop
  const doubled = segment + segment;

  const baseDuration = 220 / (speed / 42);
  const duration = hovered ? baseDuration * 2.8 : baseDuration;

  const isLarge = size === 'large';
  const animFrom = reverse ? '-50%' : '0%';
  const animTo = reverse ? '0%' : '-50%';

  const fontSize = isLarge
    ? 'clamp(2.6rem, 6.5vw, 5.2rem)'
    : 'clamp(0.75rem, 1.8vw, 1.4rem)';
  const fontWeight = isLarge ? 900 : 700;
  const letterSpacing = isLarge ? '-0.025em' : '0.18em';
  const glow = `rgba(${accentColor}, 0.7)`;
  const textShadow = isLarge
    ? `0 0 28px ${glow}, 0 0 70px rgba(${accentColor}, 0.28), 0 0 120px rgba(${accentColor}, 0.1)`
    : 'none';

  return (
    <div
      className={`relative overflow-hidden ${isLarge ? 'py-4 md:py-6' : 'py-2 md:py-3'}`}
      style={{ perspective: '1400px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3-D perspective wrapper */}
      <div
        style={{
          transform: isLarge
            ? 'rotateX(6deg) scaleX(1.06)'
            : 'rotateX(-4deg) scaleX(1.03)',
          transformOrigin: isLarge ? '50% 0%' : '50% 100%',
          willChange: 'transform',
        }}
      >
        {/* Scanline texture */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
          }}
        />

        {/* RGB aberration — red channel */}
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          aria-hidden="true"
          style={{ mixBlendMode: 'screen' }}
        >
          <motion.div
            className="whitespace-nowrap"
            initial={{ x: animFrom }}
            animate={{ x: animTo }}
            transition={{ duration: duration * 0.965, ease: 'linear', repeat: Infinity }}
            style={{
              fontSize,
              fontWeight,
              letterSpacing,
              color: 'rgba(255, 38, 38, 0.28)',
              transform: 'translateX(-3px)',
              filter: 'blur(0.6px)',
              userSelect: 'none',
              willChange: 'transform',
            }}
          >
            {doubled}
          </motion.div>
        </div>

        {/* RGB aberration — blue channel */}
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          aria-hidden="true"
          style={{ mixBlendMode: 'screen' }}
        >
          <motion.div
            className="whitespace-nowrap"
            initial={{ x: animFrom }}
            animate={{ x: animTo }}
            transition={{ duration: duration * 1.035, ease: 'linear', repeat: Infinity }}
            style={{
              fontSize,
              fontWeight,
              letterSpacing,
              color: 'rgba(38, 90, 255, 0.28)',
              transform: 'translateX(3px)',
              filter: 'blur(0.6px)',
              userSelect: 'none',
              willChange: 'transform',
            }}
          >
            {doubled}
          </motion.div>
        </div>

        {/* Primary marquee text */}
        <motion.div
          className="whitespace-nowrap"
          initial={{ x: animFrom }}
          animate={{ x: animTo }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{
            fontSize,
            fontWeight,
            letterSpacing,
            color: isLarge ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)',
            textShadow,
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          {doubled}
        </motion.div>

        {/* Glow sweep — large variant only */}
        {isLarge && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            aria-hidden="true"
            animate={{ x: ['-65%', '165%'] }}
            transition={{
              duration: 3.2,
              ease: [0.2, 0, 0.38, 1],
              repeat: Infinity,
              repeatDelay: 4.5,
            }}
            style={{
              width: '45%',
              background: `linear-gradient(90deg, transparent 0%, rgba(${accentColor}, 0.07) 28%, rgba(255,255,255,0.14) 50%, rgba(${accentColor}, 0.07) 72%, transparent 100%)`,
            }}
          />
        )}

        {/* Lateral edge vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-40"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg, #000 0%, transparent 7%, transparent 93%, #000 100%)',
          }}
        />

        {/* Bottom accent line — large variant */}
        {isLarge && (
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${accentColor}, 0.55) 50%, transparent)`,
              boxShadow: `0 0 14px rgba(${accentColor}, 0.45)`,
            }}
          />
        )}

        {/* Top accent line — large variant */}
        {isLarge && (
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${accentColor}, 0.18) 50%, transparent)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
