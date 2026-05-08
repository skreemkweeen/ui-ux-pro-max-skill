import { useEffect, type RefObject } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CursorGlowProps {
  containerRef: RefObject<HTMLElement>;
  color?: string;
  size?: number;
  opacity?: number;
}

export function CursorGlow({
  containerRef,
  color = '140, 80, 255',
  size = 800,
  opacity = 0.13,
}: CursorGlowProps) {
  const mx = useMotionValue(-size * 2);
  const my = useMotionValue(-size * 2);
  const sx = useSpring(mx, { stiffness: 45, damping: 22, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 45, damping: 22, mass: 0.7 });

  const tx = useTransform(sx, v => v - size / 2);
  const ty = useTransform(sy, v => v - size / 2);

  const coreSize = size * 0.22;
  const coreTx = useTransform(sx, v => v - coreSize / 2);
  const coreTy = useTransform(sy, v => v - coreSize / 2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    const onLeave = () => {
      mx.set(-size * 2);
      my.set(-size * 2);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef, mx, my, size]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      {/* Outer ambient bloom */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          x: tx,
          y: ty,
          background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, rgba(${color}, ${opacity * 0.25}) 45%, transparent 70%)`,
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
      {/* Bright inner core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: coreSize,
          height: coreSize,
          x: coreTx,
          y: coreTy,
          background: `radial-gradient(circle, rgba(${color}, ${opacity * 2.2}) 0%, rgba(${color}, ${opacity * 0.5}) 50%, transparent 80%)`,
          filter: 'blur(18px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
