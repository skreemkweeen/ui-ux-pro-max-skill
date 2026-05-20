// Responsive layout utilities for ELEMENT UX

export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const BREAKPOINTS: Breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Get current breakpoint
export const getCurrentBreakpoint = (width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): keyof Breakpoints => {
  if (width < BREAKPOINTS.sm) return 'xs'
  if (width < BREAKPOINTS.md) return 'sm'
  if (width < BREAKPOINTS.lg) return 'md'
  if (width < BREAKPOINTS.xl) return 'lg'
  if (width < BREAKPOINTS['2xl']) return 'xl'
  return '2xl'
}

// Check if below breakpoint
export const isBelowBreakpoint = (breakpoint: keyof Breakpoints, width?: number): boolean => {
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1024)
  return w < BREAKPOINTS[breakpoint]
}

// Check if above breakpoint
export const isAboveBreakpoint = (breakpoint: keyof Breakpoints, width?: number): boolean => {
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1024)
  return w >= BREAKPOINTS[breakpoint]
}

// Get responsive value
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof Breakpoints, T>>,
  width?: number
): T | undefined => {
  const breakpoint = getCurrentBreakpoint(width)
  const breakpoints: (keyof Breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpoints.indexOf(breakpoint)

  // Find the closest defined value
  for (let i = currentIndex; i >= 0; i--) {
    if (values[breakpoints[i]] !== undefined) {
      return values[breakpoints[i]]
    }
  }

  return undefined
}

// Responsive spacing
export const getResponsiveSpacing = (
  small: number,
  medium: number,
  large: number,
  width?: number
): number => {
  const breakpoint = getCurrentBreakpoint(width)

  if (breakpoint === 'xs' || breakpoint === 'sm') return small
  if (breakpoint === 'md' || breakpoint === 'lg') return medium
  return large
}

// Responsive grid columns
export const getGridColumns = (width?: number): number => {
  const breakpoint = getCurrentBreakpoint(width)

  switch (breakpoint) {
    case 'xs':
      return 1
    case 'sm':
      return 2
    case 'md':
      return 2
    case 'lg':
      return 3
    case 'xl':
      return 4
    case '2xl':
      return 4
    default:
      return 3
  }
}

// Responsive font size
export const getResponsiveFontSize = (
  mobile: number,
  tablet: number,
  desktop: number,
  width?: number
): number => {
  const breakpoint = getCurrentBreakpoint(width)

  if (breakpoint === 'xs' || breakpoint === 'sm') return mobile
  if (breakpoint === 'md' || breakpoint === 'lg') return tablet
  return desktop
}

// Container width
export const getContainerWidth = (width?: number): number => {
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1024)
  const padding = getResponsiveSpacing(16, 24, 48, w)

  if (w < BREAKPOINTS.sm) return w - padding * 2
  if (w < BREAKPOINTS.md) return w - padding * 2
  if (w < BREAKPOINTS.lg) return w - padding * 2
  if (w < BREAKPOINTS.xl) return Math.min(w - padding * 2, 1024)
  if (w < BREAKPOINTS['2xl']) return Math.min(w - padding * 2, 1280)
  return Math.min(w - padding * 2, 1400)
}

// Aspect ratio calculator
export const getAspectRatioPadding = (width: number, height: number): number => {
  return (height / width) * 100
}

export default {
  BREAKPOINTS,
  getCurrentBreakpoint,
  isBelowBreakpoint,
  isAboveBreakpoint,
  getResponsiveValue,
  getResponsiveSpacing,
  getGridColumns,
  getResponsiveFontSize,
  getContainerWidth,
  getAspectRatioPadding,
}
