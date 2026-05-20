// ELEMENT UX - Luxury Color System
// Three-layer token architecture: Primitive → Semantic → Component

// === PRIMITIVE COLORS ===
// Base palette from design system

export const primitiveColors = {
  // Luxury neutrals
  black: '#0a0a0a',
  charcoal: '#1a1a1a',
  darkGray: '#2d2d2d',
  mediumGray: '#4a4a4a',
  lightGray: '#7a7a7a',
  silver: '#a8a8a8',
  lightSilver: '#d4d4d4',
  white: '#ffffff',

  // Metallics
  gold: '#d4af37',
  platinum: '#e5e4e2',
  bronze: '#8b7355',
  copper: '#b87333',

  // Accent colors
  deepBlue: '#0f3a7d',
  teal: '#008080',
  emerald: '#50c878',
  crimson: '#a71930',

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

// === SEMANTIC COLORS ===
// Intent-based colors for UI patterns

export const semanticColors = {
  // Background layers
  background: {
    primary: primitiveColors.black,
    secondary: primitiveColors.charcoal,
    tertiary: primitiveColors.darkGray,
    overlay: 'rgba(10, 10, 10, 0.8)',
    modal: 'rgba(10, 10, 10, 0.95)',
  },

  // Text hierarchy
  text: {
    primary: primitiveColors.white,
    secondary: primitiveColors.lightSilver,
    tertiary: primitiveColors.silver,
    disabled: primitiveColors.mediumGray,
  },

  // Interactive states
  interactive: {
    default: primitiveColors.gold,
    hover: primitiveColors.platinum,
    active: primitiveColors.bronze,
    disabled: primitiveColors.mediumGray,
  },

  // Borders & dividers
  border: {
    default: 'rgba(168, 168, 168, 0.2)',
    light: 'rgba(168, 168, 168, 0.1)',
    strong: 'rgba(168, 168, 168, 0.4)',
  },

  // Atmospheric
  atmosphere: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },

  // Shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.4)',
    strong: 'rgba(0, 0, 0, 0.6)',
  },

  // Status
  status: {
    success: primitiveColors.success,
    warning: primitiveColors.warning,
    error: primitiveColors.error,
    info: primitiveColors.info,
  },
}

// === COMPONENT COLORS ===
// Specific component applications

export const componentColors = {
  button: {
    primary: {
      background: semanticColors.interactive.default,
      text: semanticColors.background.primary,
      hover: semanticColors.interactive.hover,
    },
    secondary: {
      background: 'transparent',
      text: semanticColors.interactive.default,
      border: semanticColors.border.default,
      hover: semanticColors.atmosphere.medium,
    },
  },

  card: {
    background: semanticColors.background.secondary,
    border: semanticColors.border.light,
    hover: semanticColors.atmosphere.light,
  },

  input: {
    background: semanticColors.background.tertiary,
    border: semanticColors.border.default,
    text: semanticColors.text.primary,
    placeholder: semanticColors.text.tertiary,
  },

  navigation: {
    background: 'rgba(10, 10, 10, 0.9)',
    text: semanticColors.text.primary,
    active: semanticColors.interactive.default,
  },

  caseStudy: {
    overlay: 'rgba(212, 175, 55, 0.1)',
    accent: semanticColors.interactive.default,
  },
}

// === CSS CUSTOM PROPERTIES ===
// Export as CSS variables

export const getCSSColorVariables = () => ({
  '--color-primary': primitiveColors.black,
  '--color-secondary': primitiveColors.charcoal,
  '--color-accent': primitiveColors.gold,
  '--color-accent-light': primitiveColors.platinum,

  '--text-primary': semanticColors.text.primary,
  '--text-secondary': semanticColors.text.secondary,
  '--text-tertiary': semanticColors.text.tertiary,

  '--bg-primary': semanticColors.background.primary,
  '--bg-secondary': semanticColors.background.secondary,
  '--bg-overlay': semanticColors.background.overlay,

  '--border-light': semanticColors.border.light,
  '--border-default': semanticColors.border.default,
  '--border-strong': semanticColors.border.strong,

  '--shadow-light': semanticColors.shadow.light,
  '--shadow-medium': semanticColors.shadow.medium,
  '--shadow-strong': semanticColors.shadow.strong,
})

export default {
  primitiveColors,
  semanticColors,
  componentColors,
  getCSSColorVariables,
}
