import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FooterTypographyProps {
  ctaText?: string;
  ghostWord?: string;
  accentColor?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};

const wordVariants = {
  hidden: { y: '105%', opacity: 0, rotateX: 12 },
  visible: {
    y: '0%',
    opacity: 1,
    rotateX: 0,
    transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
  },
};

function WordReveal({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-[0.22em] ${className ?? ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ perspective: '600px' }}>
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FooterTypography({
  ctaText = 'Start Something Exceptional.',
  ghostWord,
  accentColor = '140, 80, 255',
}: FooterTypographyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  const ghost = ghostWord ?? ctaText.split(' ')[0];

  return (
    <div ref={ref} className="relative px-6 py-24 md:px-12 lg:px-20">

      {/* Ghost oversized background word */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: 'clamp(7rem, 22vw, 24rem)',
            fontWeight: 900,
            letterSpacing: '-0.06em',
            lineHeight: 0.82,
            color: 'rgba(255,255,255,0.022)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {ghost}
        </span>
      </div>

      {/* Secondary ghost — offset, smaller */}
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden select-none pb-12 pr-8"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: 'clamp(2rem, 6vw, 7rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'rgba(255,255,255,0.016)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {ctaText}
        </span>
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Eyebrow label */}
        <motion.p
          variants={fadeUpVariants}
          className="mb-10 text-[10px] uppercase tracking-[0.42em]"
          style={{ color: 'rgba(255,255,255,0.32)' }}
        >
          Ready to create
        </motion.p>

        {/* Main CTA headline */}
        <h2
          style={{
            fontSize: 'clamp(3rem, 8.5vw, 9.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 0.88,
            color: 'rgba(255,255,255,0.96)',
          }}
        >
          <WordReveal text={ctaText} />
        </h2>

        {/* Ruled separator line */}
        <motion.div
          variants={lineVariants}
          className="my-10 h-px origin-left"
          style={{
            background: `linear-gradient(90deg, rgba(${accentColor}, 0.5) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)`,
            boxShadow: `0 0 12px rgba(${accentColor}, 0.2)`,
          }}
        />

        {/* Sub copy */}
        <motion.p
          variants={fadeUpVariants}
          className="max-w-lg"
          style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.015em',
          }}
        >
          Every exceptional project begins with a single decision.
          <br />
          Let's make something that endures.
        </motion.p>
      </motion.div>
    </div>
  );
}
