'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

export interface NavLink {
  label: string
  href: string
}

export interface NavigationBarProps {
  logo?: string
  links?: NavLink[]
  accentColor?: string
  sticky?: boolean
  onNavClick?: (href: string) => void
}

export const NavigationBar = ({
  logo = 'ELEMENT',
  links = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ],
  accentColor = '#d4af37',
  sticky = true,
  onNavClick,
}: NavigationBarProps) => {
  const navRef = useRef<HTMLNavElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate nav on scroll
  useEffect(() => {
    if (!navRef.current) return

    if (isScrolled) {
      gsap.to(navRef.current, {
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
      })
    } else {
      gsap.to(navRef.current, {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        duration: 0.3,
      })
    }
  }, [isScrolled])

  const handleLinkClick = (href: string) => {
    onNavClick?.(href)
    setIsMobileOpen(false)
  }

  return (
    <nav
      ref={navRef}
      className={`w-full z-50 transition-all duration-300 ${
        sticky ? 'fixed' : 'relative'
      } top-0 left-0`}
      style={{
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-serif font-bold text-white">
          {logo}
          <span style={{ color: accentColor }}>.</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              {link.label}
              <span
                className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: accentColor }}
              />
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className="hidden md:block px-6 py-2 rounded text-sm font-semibold transition-all duration-300"
          style={{
            backgroundColor: accentColor,
            color: '#0a0a0a',
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.05,
              duration: 0.2,
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.2,
            })
          }}
        >
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span
            className="w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={{
              transform: isMobileOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none',
            }}
          />
          <span
            className="w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={{
              opacity: isMobileOpen ? 0 : 1,
            }}
          />
          <span
            className="w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={{
              transform: isMobileOpen ? 'rotate(-45deg) translate(8px, -8px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-6 py-4 space-y-4">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="block w-full text-left text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavigationBar
