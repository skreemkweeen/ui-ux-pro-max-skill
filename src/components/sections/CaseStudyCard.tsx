'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'

export interface CaseStudyCardProps {
  image?: string
  title: string
  description: string
  tags?: string[]
  accentColor?: string
  onClick?: () => void
}

export const CaseStudyCard = ({
  image,
  title,
  description,
  tags = [],
  accentColor = '#d4af37',
  onClick,
}: CaseStudyCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleHover = () => {
    setIsHovered(true)

    if (cardRef.current && imageRef.current && contentRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        boxShadow: `0 20px 40px rgba(212, 175, 55, 0.15)`,
        duration: 0.4,
        ease: 'power2.out',
      })

      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  const handleHoverEnd = () => {
    setIsHovered(false)

    if (cardRef.current && imageRef.current && contentRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`,
        duration: 0.4,
        ease: 'power2.out',
      })

      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.to(contentRef.current, {
        opacity: 0.8,
        y: 10,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      onClick={onClick}
      className="relative h-96 rounded-lg overflow-hidden bg-gray-900 cursor-pointer group border border-gray-800 transition-all duration-300"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Image Section */}
      <div
        ref={imageRef}
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Static Content */}
        <h3
          className="text-2xl font-serif font-bold text-white mb-2"
          style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h3>

        {/* Hover Content */}
        <div
          ref={contentRef}
          className="space-y-4"
          style={{
            opacity: isHovered ? 1 : 0.8,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.4s ease-out',
          }}
        >
          <p className="text-sm text-gray-300 line-clamp-2">{description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-black/50 border border-gray-700 text-gray-300"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center text-sm font-medium transition-colors duration-300"
               style={{ color: accentColor }}>
            Explore →
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseStudyCard
