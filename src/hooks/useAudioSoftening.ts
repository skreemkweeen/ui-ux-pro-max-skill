'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export interface AudioSofteningState {
  isActive: boolean
  highFrequencyReduction: number // 0-1, where 1 = full reduction (~8dB)
}

export const useAudioSoftening = (enabled = true) => {
  const stateRef = useRef<AudioSofteningState>({
    isActive: false,
    highFrequencyReduction: 0,
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Initialize Web Audio API on first interaction
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const initAudio = () => {
      if (audioContextRef.current) return

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        // Create a high-shelf filter for reducing high frequencies (3-20kHz range)
        const filter = audioContext.createBiquadFilter()
        filter.type = 'highshelf'
        filter.frequency.value = 4000 // Reduce frequencies above 4kHz
        filter.gain.value = 0 // Start at 0 reduction
        filterRef.current = filter

        // In a real implementation, this would connect to the audio output
        // For now, we just manage the filter state for potential future audio integration
      } catch (e) {
        console.warn('Audio context initialization failed (may be normal in test environments)')
      }
    }

    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('mousemove', initAudio, { once: true })

    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('mousemove', initAudio)
    }
  }, [enabled])

  // Apply softening effect
  const applySoftening = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    stateRef.current.isActive = true

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current.isActive = false
      },
    })

    // Reduce high frequencies over 0.2s (imperceptible fade in)
    tl.to(stateRef.current, {
      highFrequencyReduction: 1,
      duration: 0.2,
      ease: 'power1.in',
      onUpdate: () => {
        if (filterRef.current) {
          // Map reduction (0-1) to filter gain (-24dB to 0dB)
          filterRef.current.gain.value = -(stateRef.current.highFrequencyReduction * 8)
        }
      },
    }, 0)

    // Sustain reduced state while paradox is visible (1.2s)
    tl.to(stateRef.current, {
      duration: 1.2,
    }, 0.2)

    // Restore high frequencies over 0.5s (soft return)
    tl.to(stateRef.current, {
      highFrequencyReduction: 0,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        if (filterRef.current) {
          filterRef.current.gain.value = -(stateRef.current.highFrequencyReduction * 8)
        }
      },
    }, 1.4)

    timelineRef.current = tl
  }

  return {
    state: stateRef.current,
    applySoftening,
  }
}

export default useAudioSoftening
