'use client'

import React, { useRef } from 'react'
import NavigationBar from '@components/layout/NavigationBar'
import ImmersiveHero from '@components/sections/ImmersiveHero'
import EditorialHeadline from '@components/sections/EditorialHeadline'
import CaseStudyCard from '@components/sections/CaseStudyCard'
import useScrollChoreography from '@hooks/useScrollChoreography'

const caseStudies = [
  {
    id: '1',
    title: 'Active Theory Reimagined',
    description: 'Cinematic motion design for luxury brand portfolio',
    tags: ['Motion', 'WebGL', 'Design'],
  },
  {
    id: '2',
    title: 'Immersive Commerce',
    description: 'E-commerce experience with 3D product visualization',
    tags: ['React Three Fiber', 'Commerce', 'Animation'],
  },
  {
    id: '3',
    title: 'Editorial Archive',
    description: 'Digital publishing platform with scroll choreography',
    tags: ['GSAP', 'ScrollTrigger', 'Typography'],
  },
  {
    id: '4',
    title: 'Motion System',
    description: 'Comprehensive easing curves and timing library',
    tags: ['GSAP', 'Lenis', 'Performance'],
  },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollTo, createParallaxLayer, createScrollAnimation } = useScrollChoreography()

  React.useEffect(() => {
    // Create parallax effect for background elements
    createParallaxLayer('.parallax-element', 0.3, {
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
    })
  }, [createParallaxLayer])

  return (
    <div ref={containerRef} className="bg-black min-h-screen">
      {/* Navigation */}
      <NavigationBar
        logo="ELEMENT UX"
        links={[
          { label: 'Work', href: '#work' },
          { label: 'About', href: '#about' },
          { label: 'Services', href: '#services' },
          { label: 'Contact', href: '#contact' },
        ]}
        accentColor="#d4af37"
        onNavClick={(href) => scrollTo(href, { duration: 1.5 })}
      />

      {/* Hero Section */}
      <ImmersiveHero
        title="ELEMENT UX"
        subtitle="Luxury-Tech Cinematic Design System"
        ctaText="Explore"
        onCTAClick={() => scrollTo('#work', { duration: 2 })}
        meshColor="#d4af37"
      />

      {/* About Section */}
      <EditorialHeadline
        eyebrow="About"
        headline="Crafted for the demands of Awwwards-quality experiences"
        subheadline="ELEMENT UX combines cutting-edge WebGL rendering, cinematic scroll choreography, and luxury-focused design principles to create immersive digital experiences that captivate and inspire."
        accentColor="#d4af37"
        animateOnScroll={true}
      />

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'React Three Fiber',
              description: 'Component-based 3D rendering',
            },
            {
              title: 'GSAP Timeline',
              description: 'Master choreography system',
            },
            {
              title: 'Lenis Scroll',
              description: 'Physics-based smooth scrolling',
            },
            {
              title: 'Performance First',
              description: 'Adaptive quality scaling',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-800 rounded-lg hover:border-gold-accent transition-colors duration-300 group"
            >
              <div
                className="w-12 h-1 mb-4 rounded-full group-hover:w-16 transition-all duration-300"
                style={{ backgroundColor: '#d4af37' }}
              />
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="work" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <EditorialHeadline
          eyebrow="Work"
          headline="Featured Projects"
          subheadline="Showcasing the power of immersive design and cutting-edge technology"
          accentColor="#d4af37"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {caseStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              title={study.title}
              description={study.description}
              tags={study.tags}
              accentColor="#d4af37"
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-gray-800">
        <EditorialHeadline
          eyebrow="Services"
          headline="What We Build"
          accentColor="#d4af37"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {[
            {
              title: 'Immersive Design Systems',
              description: 'Complete design token architecture, component libraries, and motion systems for luxury brands.',
              features: ['Design Tokens', 'Component Library', 'Motion System'],
            },
            {
              title: 'WebGL Experiences',
              description: 'Custom 3D scenes, real-time rendering, and interactive visualizations using Three.js.',
              features: ['3D Scenes', 'Real-time Rendering', 'Custom Shaders'],
            },
            {
              title: 'Scroll Choreography',
              description: 'Cinematic animations synchronized with scroll, scroll-triggered scenes, and parallax effects.',
              features: ['Scroll Triggers', 'Parallax', 'Choreography'],
            },
          ].map((service, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-white">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, fidx) => (
                  <li
                    key={fidx}
                    className="text-sm text-gray-400 flex items-center gap-2"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#d4af37' }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-gray-800">
        <div className="text-center space-y-8">
          <EditorialHeadline
            headline="Ready to Create Something Extraordinary?"
            accentColor="#d4af37"
            animateOnScroll={false}
          />
          <button
            className="px-8 py-4 rounded text-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#d4af37',
              color: '#0a0a0a',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© 2026 ELEMENT UX. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
