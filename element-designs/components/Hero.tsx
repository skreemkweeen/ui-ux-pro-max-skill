'use client';

import { useRef, useEffect, Suspense, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

/* Scene is client-only; SSR=false prevents hydration mismatch with Three.js */
const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function Hero() {
  /* ── DOM refs ─────────────────────────────────────── */
  const containerRef  = useRef<HTMLDivElement>(null);
  const navRef        = useRef<HTMLElement>(null);
  const accentRef     = useRef<HTMLDivElement>(null);
  const headline1Ref  = useRef<HTMLSpanElement>(null);
  const headline2Ref  = useRef<HTMLSpanElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const metaRef       = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);

  /* ── Mouse state for 3D parallax (ref = no re-render) ─ */
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /* ── Mouse tracking ──────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth)  *  2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * -2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── GSAP entrance timeline ──────────────────────────── */
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        /* Skip animation — just reveal everything immediately */
        gsap.set(
          [navRef.current, accentRef.current, headline1Ref.current,
           headline2Ref.current, subRef.current, metaRef.current,
           ctaRef.current, scrollRef.current],
          { opacity: 1, y: 0, yPercent: 0, scaleX: 1, clearProps: 'all' },
        );
        return;
      }

      /* Initial hidden state */
      gsap.set(navRef.current,                             { opacity: 0, y: -24 });
      gsap.set(accentRef.current,                          { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
      /* yPercent moves by % of the element's own height — correct for line-clip mask reveal */
      gsap.set([headline1Ref.current, headline2Ref.current], { opacity: 0, yPercent: 110 });
      gsap.set(subRef.current,                             { opacity: 0, y: 32 });
      gsap.set(metaRef.current,                            { opacity: 0, y: 20 });
      gsap.set(ctaRef.current,                             { opacity: 0, y: 24 });
      gsap.set(scrollRef.current,                          { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.15,
      });

      tl
        /* Nav slides down */
        .to(navRef.current, { opacity: 1, y: 0, duration: 1 })
        /* Red accent square scales in from left */
        .to(accentRef.current, { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, '-=0.5')
        /* Headline ELEMENT */
        .to(headline1Ref.current, { opacity: 1, yPercent: 0, duration: 1.1 }, '-=0.25')
        /* Headline DESIGNS — offset stagger */
        .to(headline2Ref.current, { opacity: 1, yPercent: 0, duration: 1.1 }, '-=0.92')
        /* Subline */
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.85 }, '-=0.7')
        /* Meta row */
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
        /* CTA */
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        /* Scroll hint fades in last */
        .to(scrollRef.current, { opacity: 1, duration: 1 }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      {/* ── Grain texture overlay ────────────────────── */}
      <div className="grain" aria-hidden="true" />

      {/* ── Three.js scene (full bleed, pointer-events off) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <Scene mousePos={mousePos as MutableRefObject<{ x: number; y: number }>} />
        </Suspense>
      </div>

      {/* ── Radial vignette — deepens edges ─────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 50%, transparent 25%, rgba(0,0,0,0.72) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Navigation ──────────────────────────────── */}
      <nav
        ref={navRef}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 lg:px-14 pt-8 pb-4"
        aria-label="Main navigation"
      >
        <a
          href="/"
          className="text-white text-[11px] font-medium tracking-[0.28em] uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
        >
          Element Designs
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10" role="list">
          {['Work', 'About', 'Contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-white/45 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:text-white"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:text-white"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.25">
            <line x1="2" y1="7"  x2="20" y2="7" />
            <line x1="2" y1="15" x2="20" y2="15" />
          </svg>
        </button>
      </nav>

      {/* ── Hero content — bottom-left anchor ───────── */}
      {/*
        Intentional asymmetry: text anchored bottom-left while the
        3D orb floats right-of-center — creates editorial tension.
      */}
      <div className="absolute bottom-0 left-0 z-10 px-8 lg:px-14 pb-16 md:pb-24 w-full max-w-screen-2xl">

        {/* Red accent square — small brand detail */}
        <div
          ref={accentRef}
          className="w-[5px] h-[5px] bg-red-500 mb-8 md:mb-11"
          aria-hidden="true"
        />

        {/* ── Headline ─────────────────────────────── */}
        <h1 aria-label="Element Designs">
          {/* Outer .line-clip hides the element while it translates in */}
          <span className="line-clip">
            <span
              ref={headline1Ref}
              className="block font-black text-white leading-[0.87] tracking-[-0.045em] select-none"
              style={{ fontSize: 'clamp(3.8rem, 11.5vw, 13.5rem)' }}
              aria-hidden="true"
            >
              ELEMENT
            </span>
          </span>
          <span className="line-clip">
            <span
              ref={headline2Ref}
              className="block font-black text-white leading-[0.87] tracking-[-0.045em] select-none"
              style={{ fontSize: 'clamp(3.8rem, 11.5vw, 13.5rem)' }}
              aria-hidden="true"
            >
              DESIGNS
            </span>
          </span>
        </h1>

        {/* ── Subheadline ───────────────────────────── */}
        {/*
          Slightly offset from headline left to create depth in layout.
          Breaking across two lines intentionally breaks perfect symmetry.
        */}
        <p
          ref={subRef}
          className="mt-7 md:mt-9 text-white/30 text-[11px] md:text-[12px] leading-relaxed tracking-[0.22em] uppercase font-light max-w-xs md:max-w-sm ml-[2px]"
        >
          Design that elevates
          <br />
          digital presence
        </p>

        {/* ── Meta row ─────────────────────────────── */}
        <div
          ref={metaRef}
          className="mt-6 flex items-center gap-5"
          aria-label="Studio established 2024"
        >
          <span className="text-white/18 text-[10px] tracking-[0.35em] uppercase">
            Est.&nbsp;2024
          </span>
          <span className="block w-7 h-px bg-white/12" aria-hidden="true" />
          <span className="text-white/18 text-[10px] tracking-[0.35em] uppercase">
            Digital Studio
          </span>
        </div>

        {/* ── CTA ──────────────────────────────────── */}
        <div ref={ctaRef} className="mt-10 md:mt-12">
          <button
            className="
              group relative inline-flex items-center gap-5
              border border-white/18 px-8 py-3.5
              text-[11px] tracking-[0.28em] uppercase text-white
              hover:border-white/55 transition-[border-color] duration-500
              focus-visible:outline-none focus-visible:border-white/70
            "
            aria-label="View our work"
          >
            <span className="relative z-10">View Work</span>
            {/* Arrow line — extends on hover */}
            <span
              className="relative block h-px bg-white/40 w-4 group-hover:w-9 transition-[width] duration-500 ease-out"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* ── Scroll hint — right edge ─────────────── */}
      <div
        ref={scrollRef}
        className="absolute right-8 lg:right-14 bottom-16 z-20 hidden md:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span
          className="text-white/22 text-[9px] tracking-[0.4em] uppercase"
          style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
        >
          Scroll
        </span>
        {/* Animated progress line */}
        <div className="w-px h-14 bg-white/10 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-full bg-white/45 animate-scroll-line" />
        </div>
      </div>
    </div>
  );
}
