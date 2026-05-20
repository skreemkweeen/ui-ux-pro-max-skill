# ELEMENT UX - Development Guide

## Overview

This guide establishes the complete workflow for developing ELEMENT UX - an immersive, cinematic luxury-tech portfolio experience inspired by Active Theory and Awwwards Gold standards.

---

## Setup & Environment

### Prerequisites
```bash
node -v  # v18+ recommended
npm -v   # v9+
python3 --version  # For design system scripts
```

### Installation
```bash
npm install
# Install all skillfish packages (see: install-element-ux-skills.sh)
bash install-element-ux-skills.sh
```

### Environment Configuration
```bash
cp .env.element-ux .env.local
source .env.local
```

---

## Development Workflow

### Phase 1: Inspiration & Design System

**Use**: `anydesign`, `premium-design-skill`

1. **Collect References**
   - Analyze Awwwards finalists with `anydesign`
   - Extract palette, typography, layout patterns
   - Document motion sequences
   
2. **Define Tokens**
   ```bash
   npm run design:tokens
   ```
   - Color system (base → semantic → component)
   - Typography scale (16 sizes across 3 weights)
   - Spacing scale (8px grid system)
   - Shadow & depth layers

3. **Create Mood Board**
   ```bash
   npm run design:mood-board
   ```
   - Establish visual hierarchy
   - Define emotional tempo
   - Plan interactive moments

### Phase 2: Architecture & Scene Setup

**Use**: `threejs-*`, `claude-r3f-template`, `awwwards-motion`

1. **Scene Structure**
   ```javascript
   // src/scenes/portfolio.scene.ts
   import { useThree } from '@react-three/fiber'
   import { useRef } from 'react'
   
   export const PortfolioScene = () => {
     const sceneRef = useRef()
     const cameraMountRef = useRef()
     
     // Layer 1: Background WebGL
     // Layer 2: Content parallax
     // Layer 3: Interactive overlays
     // Layer 4: UI chrome
   }
   ```

2. **Camera System**
   - Establish focal depth
   - Define transition cinematography
   - Plan parallax calculations

3. **Lighting Setup**
   ```javascript
   // Ambient: Atmospheric
   // Directional: Key light (drama)
   // Point: Accent details
   // Emissive: Self-lighting materials
   ```

4. **Material Library**
   - Glass (refractive, non-transparent)
   - Matte luxury (low-key, high-contrast)
   - Metallic (specular, high-quality)
   - Atmospheric (volumetric, fog-like)

### Phase 3: Motion Choreography

**Use**: `gsap-animation-helper-skill`, `claude-gsap`, `framer-motion-skill`

#### GSAP Timeline Foundation
```javascript
// src/hooks/useChoreography.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useChoreography = () => {
  // Master timeline for orchestrating all sequences
  const masterTl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.inOut', duration: 1 }
  })
  
  // Sequence acts within narrative
  return { masterTl }
}
```

#### Choreography Structure
```
ACT I: Introduction (Scroll 0-25%)
├── Hero emergence (staggered)
├── Title animation (word by word)
├── Background parallax layer build
└── CTA hint (interactive cue)

ACT II: Content Revelation (Scroll 25-70%)
├── Case study slides (cross-fade with parallax)
├── Detail reveals (sequential)
├── Interactive element reveals
└── Atmospheric transitions

ACT III: Conversion (Scroll 70-100%)
├── Testimonials (scrolling carousel)
├── Contact form reveal
├── Final parallax flourish
└── Confetti/celebration (optional)
```

#### Key Animation Patterns
```javascript
// Staggered reveal
gsap.to('.case-study-item', {
  duration: 0.8,
  y: 0,
  opacity: 1,
  stagger: {
    amount: 0.5,
    from: 'edges',
    ease: 'power2.out'
  },
  scrollTrigger: {
    trigger: '.case-studies',
    start: 'top center',
    end: 'center center'
  }
})

// Parallax depth
gsap.to('.bg-layer', {
  y: (index) => index * -100,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    scrub: 1
  }
})

// Cinematic transition
tl.to('.scene', { 
  rotationZ: 0.1, 
  duration: 2,
  ease: 'circ.inOut' 
})
```

### Phase 4: Atmospheric Design

**Use**: `css-atmospheric-backgrounds-skill`, `google-fonts-skill`, `ui-sound-design-skill`

1. **Typography Hierarchy**
   ```css
   /* Headline: Display (52-72px, serif luxury) */
   .headline-1 {
     font-family: 'Playfair Display', serif;
     font-size: 72px;
     font-weight: 700;
     letter-spacing: -2px;
     line-height: 1.1;
   }
   
   /* Subheading: Editorial (24-32px, sans-serif refined) */
   .subtitle {
     font-family: 'Inter', sans-serif;
     font-size: 24px;
     font-weight: 500;
     letter-spacing: 0.5px;
   }
   
   /* Body: Readable (16-18px) */
   .body-text {
     font-family: 'Inter', sans-serif;
     font-size: 18px;
     font-weight: 400;
     line-height: 1.6;
   }
   ```

2. **Atmospheric CSS**
   ```css
   /* Depth blur */
   .bg-atmosphere {
     backdrop-filter: blur(20px);
     background: rgba(255, 255, 255, 0.1);
   }
   
   /* Glow effect */
   .glow-accent {
     box-shadow: 
       0 0 40px rgba(100, 200, 255, 0.3),
       inset 0 0 20px rgba(255, 255, 255, 0.1);
   }
   
   /* Grain overlay */
   .texture-grain::before {
     background-image: url('data:image/svg+xml...');
     opacity: 0.02;
   }
   ```

3. **Color System**
   ```css
   :root {
     /* Primaries - Luxury dark foundation */
     --color-primary: #0a0a0a;
     --color-secondary: #1a1a1a;
     
     /* Accents - Refined metallics */
     --color-gold: #d4af37;
     --color-silver: #c0c0c0;
     
     /* Contextual - Atmospheric */
     --color-atmosphere: rgba(255, 255, 255, 0.1);
     --color-shadow: rgba(0, 0, 0, 0.3);
   }
   ```

### Phase 5: Component Implementation

**Use**: `creative-first-ui`, `StoryForge`, `storytelling-web`

#### Component Strategy
```
Atomic Design hierarchy, storytelling-focused:

Atoms (Stateless, single purpose)
├── Text variants (headline, body, accent)
├── Icon systems
├── Spacers and dividers
└── Raw interactive elements

Molecules (Functional compounds)
├── Buttons with hover states
├── Input fields with validation
├── Navigation components
└── Form elements

Organisms (Complex interactive)
├── Hero sections
├── Content cards
├── Header/footer
└── Modal dialogs

Scenes (Narrative containers)
├── Act I: Introduction
├── Act II: Portfolio
├── Act III: Conversion
└── Ambient environment
```

#### Example Component: Case Study Card
```tsx
// src/components/CaseStudyCard.tsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

interface CaseStudyCardProps {
  title: string
  description: string
  image: string
  color: string
  onHover?: () => void
}

export const CaseStudyCard = ({ 
  title, 
  description, 
  image, 
  color,
  onHover 
}: CaseStudyCardProps) => {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Parallax on scroll
    gsap.to(imageRef.current, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        scrub: 1
      }
    })

    // Hover animation
    const hoverTl = gsap.timeline({ paused: true })
    hoverTl
      .to(imageRef.current, { scale: 1.05, duration: 0.6 }, 0)
      .to(textRef.current, { y: -10, opacity: 1, duration: 0.6 }, 0)

    container.addEventListener('mouseenter', () => hoverTl.play())
    container.addEventListener('mouseleave', () => hoverTl.reverse())

    return () => {
      hoverTl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <article ref={containerRef} className="case-study-card">
      <div className="card-image" ref={imageRef}>
        <img src={image} alt={title} />
      </div>
      <div className="card-text" ref={textRef}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  )
}
```

### Phase 6: Interactive Elements

**Use**: `threejs-interaction`, `framer-motion-skill`

1. **Scroll-Triggered Interactions**
   - Reveal on scroll
   - Parallax depth changes
   - Text animation sequences

2. **Hover States**
   - Scale + glow effects
   - Color transitions
   - Depth emphasis

3. **Click Events**
   - Modal opens
   - Navigation transitions
   - Form interactions

---

## Performance Optimization

### Key Metrics
- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **Frame Rate**: Sustained 60fps

### Optimization Techniques

```javascript
// 1. Lazy Load Off-Screen Content
const useIntersectionObserver = (ref, onIntersect) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onIntersect])
}

// 2. Debounce Expensive Operations
const debouncedScroll = useMemo(
  () => debounce((pos) => updateParallax(pos), 16),
  []
)

// 3. Use RequestAnimationFrame
gsap.defaults({ willChange: 'auto' })
gsap.config({ autoSleep: 60 })

// 4. Optimize Assets
// Images: WebP with fallback, srcset for responsive
// Models: Compressed GLTF, LOD techniques
// Textures: Mipmaps, compressed formats (KTX2)
```

### Asset Pipeline
```bash
# Optimize models
npx gltf-transform optimize model.glb model-optimized.glb
npx gltf-transform quantize model-optimized.glb model-final.glb

# Compress textures
npx basisu input.png -output output.ktx2

# Bundle analysis
npm run build -- --analyze
```

---

## Testing & Quality Assurance

### Visual Testing
```bash
# Lighthouse audit
npm run audit

# Accessibility check
npm run a11y

# Performance profiling
npm run profile
```

### Animation Testing
```javascript
// Test GSAP timelines
describe('Choreography', () => {
  it('should complete hero animation in 2.5s', () => {
    const { masterTl } = useChoreography()
    expect(masterTl.duration()).toBe(2.5)
  })
  
  it('should maintain 60fps during parallax', () => {
    // Monitor frame rate during scroll
  })
})
```

---

## Deployment

### Pre-Deployment Checklist
- [ ] All skills installed successfully
- [ ] Visual regression testing passed
- [ ] Performance metrics meet targets
- [ ] Accessibility audit clean
- [ ] Mobile responsive tested
- [ ] Cross-browser compatibility verified
- [ ] SEO metadata optimized
- [ ] Analytics configured

### Deployment Command
```bash
npm run build
npm run deploy
```

---

## Skill Integration Checklist

- [ ] **anydesign** - Used for inspiration analysis
- [ ] **premium-design-skill** - Token system created
- [ ] **creative-first-ui** - Component architecture planned
- [ ] **StoryForge** - Narrative structure defined
- [ ] **storytelling-web** - Scroll storytelling implemented
- [ ] **threejs-*** - Scene and camera setup complete
- [ ] **claude-r3f-template** - React Three Fiber integrated
- [ ] **awwwards-motion** - Motion patterns implemented
- [ ] **gsap-animation-helper-skill** - Timeline choreography
- [ ] **claude-gsap** - Advanced animation sequences
- [ ] **framer-motion-skill** - Component-level animations
- [ ] **google-fonts-skill** - Typography system complete
- [ ] **design-for-ai** - AI-friendly design workflows
- [ ] **ui-sound-design-skill** - Audio branding integrated
- [ ] **css-atmospheric-backgrounds-skill** - Atmospheric effects
- [ ] **total-agent-memory** - Long-session memory enabled
- [ ] **DeepClaude** - Code analysis and optimization
- [ ] **agent-skills** - Deployment automation

---

## Troubleshooting

### Rate Limiting
If experiencing GitHub API rate limits during skill installation:
```bash
# Wait for reset (typically 1 hour)
# Or run the installation script again
bash install-element-ux-skills.sh
```

### Performance Issues
- Profile with Chrome DevTools
- Check for memory leaks in Three.js scene
- Reduce particle counts / effect intensity
- Defer non-critical animations

### Animation Conflicts
- Use unique timeline references
- Properly kill/destroy timelines on unmount
- Monitor for ScrollTrigger accumulation

---

## Resources

- [Active Theory Portfolio](https://activetheory.net/)
- [Awwwards Archive](https://www.awwwards.com/awwwards/best-of-year/)
- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

---

## Support

For issues with specific skills, use:
```bash
/anydesign <query>
/gsap-animation-helper-skill <request>
/threejs-fundamentals <question>
```

---

**Status**: ELEMENT UX Development Guide v1.0  
**Last Updated**: 2026-05-20  
**Maintained By**: Claude Code
