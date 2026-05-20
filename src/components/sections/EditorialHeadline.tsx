'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface EditorialHeadlineProps {
  eyebrow?: string
  headline: string
  subheadline?: string
  accentColor?: string
  animateOnScroll?: boolean
  splitText?: boolean
}

const splitIntoChars = (text: string) => {
  return text.split('').map((char) => (char === ' ' ? ' ' : char))
}

export const EditorialHeadline = ({
  eyebrow,
  headline,
  subheadline,
  accentColor = '#d4af37',
  animateOnScroll = true,
  splitText = true,
}: EditorialHeadlineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!animateOnScroll || !headlineRef.current) return

    gsap.to(headlineRef.current, {
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
        markers: false,
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
  }, [animateOnScroll])

  return (
    <section
      ref={containerRef}
      className="relative py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto"
    >
      <div className="space-y-6">
        {/* Eyebrow */}
        {eyebrow && (
          <div
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            <div
              className="w-12 h-px"
              style={{ backgroundColor: accentColor }}
            />
            {eyebrow}
          </div>
        )}

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight"
          style={{
            opacity: animateOnScroll ? 0 : 1,
            transform: animateOnScroll ? 'translateY(20px)' : 'none',
          }}
        >
          {splitText ? (
            <span className="block">
              {splitIntoChars(headline).map((char, idx) => (
                <span
                  key={idx}
                  className="inline-block"
                  style={{
                    opacity: char === ' ' ? 0.3 : 1,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ) : (
            headline
          )}
        </h2>

        {/* Subheadline */}
        {subheadline && (
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light"
          >
            {subheadline}
          </p>
        )}

        {/* Accent Line */}
        <div
          className="w-12 h-1 mt-8"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </section>
  )
}

export default EditorialHeadline
