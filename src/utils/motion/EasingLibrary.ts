// ELEMENT UX - Easing Library
// Luxury-focused easing curves for cinematic motion

import gsap from 'gsap'

export const luxuryEasings = {
  // Entry animations - snappy but refined
  enter: {
    fast: 'power2.out',
    normal: 'power3.out',
    slow: 'back.out(1.3)',
  },

  // Exit animations - smooth departure
  exit: {
    fast: 'power2.inOut',
    normal: 'power3.inOut',
    slow: 'power4.inOut',
  },

  // Hover states - elastic feedback
  hover: {
    light: 'power1.out',
    normal: 'back.out(1.5)',
    strong: 'elastic.out(1, 0.5)',
  },

  // Parallax - linear for smooth effect
  parallax: 'none',

  // Scroll-driven - no easing
  scroll: 'none',

  // Reveal sequences
  reveal: {
    letter: 'power2.inOut',
    word: 'power2.out',
    section: 'power3.out',
  },

  // Interactive
  click: 'back.out(2)',
  drag: 'power2.out',
  release: 'elastic.out(1, 0.6)',
}

// Predefined easing configurations
export const easingConfigs = {
  // Fast snappy interactions
  quick: {
    duration: 0.3,
    ease: 'power2.out',
  },

  // Standard motion
  standard: {
    duration: 0.6,
    ease: 'power3.inOut',
  },

  // Slow cinematic motion
  cinematic: {
    duration: 1.2,
    ease: 'power3.inOut',
  },

  // Very slow atmospheric
  atmospheric: {
    duration: 2.0,
    ease: 'power2.inOut',
  },

  // Elastic reaction
  elastic: {
    duration: 0.8,
    ease: 'elastic.out(1, 0.6)',
  },

  // Bounce entrance
  bounce: {
    duration: 0.6,
    ease: 'back.out(2)',
  },
}

// Stagger timing utilities
export const staggerConfigs = {
  // Tight stagger for fast reveals
  tight: {
    each: 0.05,
    duration: 0.4,
  },

  // Standard stagger
  normal: {
    each: 0.1,
    duration: 0.6,
  },

  // Loose stagger for dramatic effect
  loose: {
    each: 0.2,
    duration: 0.8,
  },

  // Very loose for cinematic entrance
  cinematic: {
    each: 0.3,
    duration: 1.2,
  },
}

// Create custom easing curve
export const createCustomEasing = (
  p0: number,
  p1: number,
  p2: number,
  p3: number
) => {
  return `cubic-bezier(${p0}, ${p1}, ${p2}, ${p3})`
}

// Luxury brand easing curves
export const brandEasings = {
  // Luxury brand characteristic curves
  luxuryEnter: createCustomEasing(0.25, 0.46, 0.45, 0.94),
  luxuryExit: createCustomEasing(0.77, 0.0, 0.175, 1.0),
  luxuryHover: createCustomEasing(0.68, -0.55, 0.265, 1.55),

  // Professional curves
  professionalEnter: createCustomEasing(0.4, 0.0, 0.2, 1.0),
  professionalExit: createCustomEasing(0.4, 0.0, 1.0, 1.0),

  // Smooth curves
  smoothEnter: createCustomEasing(0.34, 1.56, 0.64, 1.0),
  smoothExit: createCustomEasing(0.3, 0.66, 0.66, 1.0),
}

// Export for GSAP
export default {
  luxuryEasings,
  easingConfigs,
  staggerConfigs,
  createCustomEasing,
  brandEasings,
}
