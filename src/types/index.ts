// ELEMENT UX Type Definitions

// Scene and Three.js types
export interface SceneConfig {
  backgroundColor?: string
  ambientIntensity?: number
  directionalIntensity?: number
  cameraPosition?: [number, number, number]
  enableShadows?: boolean
  enableFog?: boolean
}

export interface MeshConfig {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
}

// Animation types
export interface AnimationConfig {
  duration: number
  ease: string
  delay?: number
  stagger?: number
}

export interface TimelineConfig {
  paused?: boolean
  repeat?: number
  repeatDelay?: number
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface InteractiveProps extends BaseComponentProps {
  onClick?: () => void
  onHover?: (hovered: boolean) => void
  disabled?: boolean
}

// Device and performance types
export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type QualityLevel = 'high' | 'medium' | 'low'
export type PerformanceLevel = 'excellent' | 'good' | 'fair' | 'poor'

export interface DeviceProfile {
  type: DeviceType
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  isTouchCapable: boolean
  isRetina: boolean
  hasGPU: boolean
}

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  avgFrameTime: number
  memoryUsage: number
  gpuMemory: number
}

// Gesture types
export type GestureType = 'tap' | 'longPress' | 'swipe' | 'pinch' | 'rotate'
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface GestureEvent {
  type: GestureType
  direction?: SwipeDirection
  velocity?: number
  scale?: number
  rotation?: number
  timestamp: number
}

// Color and styling types
export interface ColorToken {
  name: string
  value: string
  category: 'primitive' | 'semantic' | 'component'
}

export interface TokenSet {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, any>
  animation: Record<string, AnimationConfig>
}

// Content types
export interface CaseStudy {
  id: string
  title: string
  description: string
  image?: string
  tags?: string[]
  link?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

export interface PageMeta {
  title: string
  description?: string
  image?: string
  keywords?: string[]
}

// Shader types
export interface ShaderConfig {
  vertexPath: string
  fragmentPath: string
  uniforms?: Record<string, any>
  defines?: Record<string, string | number>
}

export interface ShaderMaterial {
  material: any // THREE.ShaderMaterial
  uniforms: Record<string, any>
  update: (key: string, value: any) => void
}

// Export all types
export default {
  SceneConfig,
  MeshConfig,
  AnimationConfig,
  TimelineConfig,
  BaseComponentProps,
  InteractiveProps,
  DeviceType,
  QualityLevel,
  PerformanceLevel,
  DeviceProfile,
  PerformanceMetrics,
  GestureType,
  SwipeDirection,
  GestureEvent,
  ColorToken,
  TokenSet,
  CaseStudy,
  NavItem,
  PageMeta,
  ShaderConfig,
  ShaderMaterial,
}
