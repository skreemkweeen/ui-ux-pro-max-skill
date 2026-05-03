'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/*
  Custom cursor — only renders on pointer:fine devices (mouse/trackpad).
  Uses mix-blend-mode: difference so it inverts against any background.
  The ring follows with a lazy lerp to give it inertia/weight.
*/
export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef<number>(0);
  const visible = useRef(false);

  useEffect(() => {
    /* Only attach on pointer:fine devices */
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (!dotRef.current || !ringRef.current) return;

    gsap.set([dotRef.current, ringRef.current], { opacity: 0 });

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      /* Snap dot immediately */
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });

      if (!visible.current) {
        visible.current = true;
        gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.4 });
      }
    };

    const onLeave = () => {
      gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.3 });
      visible.current = false;
    };

    /* Lerp ring behind the dot */
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      gsap.set(ringRef.current, { x: ring.current.x, y: ring.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Solid dot — snaps instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'white',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {/* Ring — lags behind for inertia effect */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.28)',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  );
}
