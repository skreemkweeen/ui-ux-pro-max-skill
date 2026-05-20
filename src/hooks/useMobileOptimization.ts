'use client'

import { useEffect, useState, useCallback } from 'react'

export interface DeviceProfile {
  type: 'mobile' | 'tablet' | 'desktop'
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  isTouchCapable: boolean
  isRetina: boolean
  hasGPU: boolean
  viewport: {
    width: number
    height: number
    aspect: number
  }
}

export interface OptimizationSettings {
  renderResolution: 0.5 | 0.75 | 1 | 1.25
  particleQuality: 0.3 | 0.5 | 0.75 | 1
  shadowQuality: 'low' | 'medium' | 'high'
  postProcessing: boolean
  bloomEnabled: boolean
  dofEnabled: boolean
  filmGrainEnabled: boolean
  textureCompression: boolean
  maxGeometries: number
  maxLights: number
  autoReduceOnPanic: boolean
}

export const useMobileOptimization = () => {
  const [device, setDevice] = useState<DeviceProfile>({
    type: 'desktop',
    os: 'unknown',
    isTouchCapable: false,
    isRetina: false,
    hasGPU: true,
    viewport: {
      width: typeof window !== 'undefined' ? window.innerWidth : 1280,
      height: typeof window !== 'undefined' ? window.innerHeight : 720,
      aspect: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9,
    },
  })

  const [settings, setSettings] = useState<OptimizationSettings>({
    renderResolution: 1,
    particleQuality: 1,
    shadowQuality: 'high',
    postProcessing: true,
    bloomEnabled: true,
    dofEnabled: true,
    filmGrainEnabled: true,
    textureCompression: false,
    maxGeometries: 1000,
    maxLights: 8,
    autoReduceOnPanic: true,
  })

  // Detect device capabilities on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const detectDevice = (): DeviceProfile => {
      const ua = navigator.userAgent
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = window.devicePixelRatio

      // Detect device type
      let type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (width < 768) type = 'mobile'
      else if (width < 1024) type = 'tablet'

      // Detect OS
      let os: DeviceProfile['os'] = 'unknown'
      if (/iPhone|iPad|iPod/.test(ua)) os = 'ios'
      else if (/Android/.test(ua)) os = 'android'
      else if (/Win/.test(ua)) os = 'windows'
      else if (/Mac/.test(ua)) os = 'macos'
      else if (/Linux/.test(ua)) os = 'linux'

      // Check touch capability
      const isTouchCapable =
        () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

      // Check retina display
      const isRetina = dpr >= 2

      // Check GPU capability (basic WebGL detection)
      let hasGPU = false
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        hasGPU = !!gl
      } catch {
        hasGPU = false
      }

      return {
        type,
        os,
        isTouchCapable: isTouchCapable(),
        isRetina,
        hasGPU,
        viewport: {
          width,
          height,
          aspect: width / height,
        },
      }
    }

    const profile = detectDevice()
    setDevice(profile)

    // Apply initial optimization settings based on device
    applyOptimizationProfile(profile)

    // Handle resize
    const handleResize = () => {
      setDevice((prev) => ({
        ...prev,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          aspect: window.innerWidth / window.innerHeight,
        },
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Apply optimization profile
  const applyOptimizationProfile = useCallback((profile: DeviceProfile) => {
    const newSettings: OptimizationSettings = {
      renderResolution: 1,
      particleQuality: 1,
      shadowQuality: 'high',
      postProcessing: true,
      bloomEnabled: true,
      dofEnabled: true,
      filmGrainEnabled: true,
      textureCompression: false,
      maxGeometries: 1000,
      maxLights: 8,
      autoReduceOnPanic: true,
    }

    if (profile.type === 'mobile') {
      newSettings.renderResolution = 0.75
      newSettings.particleQuality = 0.5
      newSettings.shadowQuality = 'medium'
      newSettings.postProcessing = true
      newSettings.bloomEnabled = false
      newSettings.dofEnabled = false
      newSettings.filmGrainEnabled = true
      newSettings.textureCompression = true
      newSettings.maxGeometries = 500
      newSettings.maxLights = 4
    } else if (profile.type === 'tablet') {
      newSettings.renderResolution = 0.875
      newSettings.particleQuality = 0.75
      newSettings.shadowQuality = 'medium'
      newSettings.postProcessing = true
      newSettings.bloomEnabled = true
      newSettings.dofEnabled = false
      newSettings.filmGrainEnabled = true
      newSettings.textureCompression = false
      newSettings.maxGeometries = 750
      newSettings.maxLights = 6
    }

    // Further reduce if no GPU
    if (!profile.hasGPU) {
      newSettings.renderResolution = 0.5
      newSettings.postProcessing = false
      newSettings.bloomEnabled = false
      newSettings.dofEnabled = false
      newSettings.maxGeometries = 300
    }

    setSettings(newSettings)
  }, [])

  // Panic mode: reduce quality immediately
  const triggerPanicMode = useCallback(() => {
    if (!settings.autoReduceOnPanic) return

    setSettings((prev) => ({
      ...prev,
      renderResolution: Math.max(0.5, prev.renderResolution - 0.25) as any,
      particleQuality: Math.max(0.3, prev.particleQuality - 0.25) as any,
      postProcessing: false,
      bloomEnabled: false,
      dofEnabled: false,
      maxGeometries: Math.floor(prev.maxGeometries * 0.75),
    }))
  }, [settings.autoReduceOnPanic])

  // Restore quality when performance recovers
  const restoreQuality = useCallback(() => {
    applyOptimizationProfile(device)
  }, [device, applyOptimizationProfile])

  // Check if device is low-end
  const isLowEndDevice = useCallback(() => {
    return device.type === 'mobile' || !device.hasGPU
  }, [device])

  return {
    device,
    settings,
    isLowEndDevice,
    triggerPanicMode,
    restoreQuality,
    applyOptimizationProfile,
  }
}

export default useMobileOptimization
