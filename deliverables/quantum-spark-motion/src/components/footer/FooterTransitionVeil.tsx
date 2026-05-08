import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FooterTransitionVeilProps {
  accentColor?: string;
}

export function FooterTransitionVeil({ accentColor = '80, 50, 180' }: FooterTransitionVeilProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'],
  });

  const mainOp = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const beamOp = useTransform(scrollYProgress, [0.1, 0.65], [0, 0.9]);
  const hazeOp = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const beamY = useTransform(scrollYProgress, [0, 1], ['-12%', '0%']);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative"
      style={{ height: 400, marginBottom: -180 }}
    >
      {/* Primary dark descent */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: mainOp,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 22%, rgba(0,0,0,0.88) 52%, #000 80%, #000 100%)',
        }}
      />

      {/* Left volumetric cone */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: beamOp,
          y: beamY,
          background: `conic-gradient(from 93deg at 12% 110%, transparent 32%, rgba(${accentColor}, 0.13) 46%, transparent 58%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Right volumetric cone */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: beamOp,
          y: beamY,
          background: `conic-gradient(from -93deg at 88% 110%, transparent 32%, rgba(${accentColor}, 0.09) 46%, transparent 58%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Centre depth haze bloom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '65%',
          opacity: hazeOp,
          background: `radial-gradient(ellipse 110% 70% at 50% 100%, rgba(${accentColor}, 0.17) 0%, transparent 65%)`,
        }}
      />

      {/* Lateral edge vignettes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Faint horizontal scan pulse */}
      <motion.div
        className="absolute inset-x-0"
        style={{
          height: 1,
          bottom: '40%',
          opacity: hazeOp,
          background: `linear-gradient(90deg, transparent, rgba(${accentColor}, 0.4) 50%, transparent)`,
          boxShadow: `0 0 18px 2px rgba(${accentColor}, 0.25)`,
        }}
      />
    </div>
  );
}
