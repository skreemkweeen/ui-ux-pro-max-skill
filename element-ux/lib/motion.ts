// Element UX — Animation System
// All timing, easing, and variant definitions live here.
// Components import from this file — never define inline.

// ── Duration scale ────────────────────────────────────────────────────────────
export const DURATION = {
  instant:  0.08,  // toggle: active, checked, selected
  micro:    0.15,  // hover: border, color, opacity
  fast:     0.22,  // hover lift, icon swap
  base:     0.35,  // scroll reveal, enter
  moderate: 0.45,  // page enter, hero
  slow:     0.60,  // stagger orchestration
  ambient: 12.00,  // background glow loop
} as const

// ── Easing curves ─────────────────────────────────────────────────────────────
// expo.out (ui) — starts fast, decelerates. Confident, never sluggish.
// ease-out (enter) — gentle deceleration for entering content.
// ease-in (exit) — accelerates away, clean departure.
export const EASE = {
  ui:     [0.16, 1, 0.3, 1]  as const,
  enter:  [0.0,  0, 0.2, 1]  as const,
  exit:   [0.4,  0, 1,   1]  as const,
  micro:  [0.4,  0, 0.2, 1]  as const,
  spring: { type: 'spring', stiffness: 380, damping: 30, mass: 1 },
  bounce: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 },
} as const

// ── Page load — orchestrated entrance sequence ────────────────────────────────
// t=0ms nav | t=100ms label | t=220ms statement | t=420ms sub | t=580ms cta
export const pageLoad = {
  nav: {
    initial:    { opacity: 0, y: -8 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: DURATION.moderate, ease: EASE.enter, delay: 0 },
  },
  heroLabel: {
    initial:    { opacity: 0 },
    animate:    { opacity: 1 },
    transition: { duration: DURATION.fast, ease: EASE.enter, delay: 0.1 },
  },
  heroStatement: {
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: DURATION.slow, ease: EASE.enter, delay: 0.22 },
  },
  heroSub: {
    initial:    { opacity: 0, y: 12 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: DURATION.moderate, ease: EASE.enter, delay: 0.42 },
  },
  heroCta: {
    initial:    { opacity: 0, y: 8 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: DURATION.base, ease: EASE.enter, delay: 0.58 },
  },
  scrollIndicator: {
    initial:    { opacity: 0 },
    animate:    { opacity: 0.4 },
    transition: { duration: DURATION.base, ease: EASE.enter, delay: 0.82 },
  },
} as const

// ── Stagger containers ────────────────────────────────────────────────────────
export const stagger = {
  container: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
    exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  },
  containerSlow: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.10 } },
  },
  containerFast: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0 } },
  },
} as const

// ── Stagger children ──────────────────────────────────────────────────────────
export const staggerChild = {
  fadeUp: {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0,    transition: { duration: DURATION.base,  ease: EASE.enter } },
    exit:    { opacity: 0, y: -8,   transition: { duration: DURATION.micro, ease: EASE.exit  } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1,          transition: { duration: DURATION.base,  ease: EASE.enter } },
  },
  scaleFade: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1,    transition: { duration: DURATION.base, ease: EASE.ui } },
  },
  slideRight: {
    hidden:  { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0,   transition: { duration: DURATION.base,  ease: EASE.enter } },
  },
} as const

// ── Page transition ───────────────────────────────────────────────────────────
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: DURATION.moderate, ease: EASE.enter } },
  exit:    { opacity: 0, y: -8, transition: { duration: DURATION.fast,     ease: EASE.exit  } },
} as const

// ── Card hover ────────────────────────────────────────────────────────────────
export const cardHover = {
  thumbnail: {
    rest:  { scale: 1 },
    hover: { scale: 1.03, transition: { duration: DURATION.moderate, ease: EASE.ui } },
  },
  overlay: {
    rest:  { opacity: 0, y: 8 },
    hover: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.ui } },
  },
  body: {
    rest:  { y: 0 },
    hover: { y: -2, transition: { duration: DURATION.fast, ease: EASE.ui } },
  },
} as const

// ── Button hover ──────────────────────────────────────────────────────────────
export const buttonHover = {
  primary: {
    rest:    { scale: 1 },
    hover:   { scale: 1.02, transition: { duration: DURATION.micro, ease: EASE.micro } },
    pressed: { scale: 0.97, transition: { duration: DURATION.instant } },
  },
  ghost: {
    rest:    { opacity: 0.75 },
    hover:   { opacity: 1,    transition: { duration: DURATION.micro, ease: EASE.micro } },
    pressed: { scale: 0.98, opacity: 1, transition: { duration: DURATION.instant } },
  },
  glow: {
    rest:  { opacity: 0,    scale: 0.8 },
    hover: { opacity: 0.35, scale: 1.1, transition: { duration: DURATION.fast, ease: EASE.enter } },
  },
} as const
