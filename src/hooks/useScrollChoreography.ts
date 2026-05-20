'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollChoreographyState {
  progress: number
  velocity: number
  position: number
}

export const useScrollChoreography = () => {
  const lenisRef = useRef<Lenis | null>(null)
  const stateRef = useRef<ScrollChoreographyState>({
    progress: 0,
    velocity: 0,
    position: 0,
  })

  // Initialize Lenis and sync with GSAP
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create Lenis instance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)

      // Update scroll state
      stateRef.current = {
        progress: lenis.progress,
        velocity: lenis.velocity,
        position: lenis.actualScroll,
      }
    })

    // Update ScrollTrigger on scroll
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    // Redirect scroll events
    const handleWheel = (event: WheelEvent) => {
      lenis.scrollTo(lenis.actualScroll + event.deltaY, {
        immediate: true,
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel)
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Scroll to target with Lenis
  const scrollTo = useCallback((target: number | string, options = {}) => {
    if (!lenisRef.current) return

    lenisRef.current.scrollTo(target, {
      duration: 2,
      ...options,
    })
  }, [])

  // Get current scroll state
  const getScrollState = useCallback(() => stateRef.current, [])

  // Create scroll trigger with parallax
  const createParallaxLayer = useCallback(
    (
      selector: string,
      depthMultiplier: number = 1,
      config: any = {}
    ) => {
      gsap.to(selector, {
        y: (index: number) => -100 * index * depthMultiplier,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          markers: false,
          ...config,
        },
      })
    },
    []
  )

  // Create scroll-triggered animation
  const createScrollAnimation = useCallback(
    (
      selector: string,
      fromVars: any,
      toVars: any,
      triggerConfig: any = {}
    ) => {
      gsap.fromTo(
        selector,
        fromVars,
        {
          ...toVars,
          scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
            markers: false,
            ...triggerConfig,
          },
        }
      )
    },
    []
  )

  return {
    lenis: lenisRef.current,
    scrollTo,
    getScrollState,
    createParallaxLayer,
    createScrollAnimation,
    // Expose state for reactive components
    state: stateRef.current,
  }
}

export default useScrollChoreography
