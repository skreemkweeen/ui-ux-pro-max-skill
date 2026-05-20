# ELEMENT UX - Skills Quick Reference

## Installed & Available Skills

### ✅ INSTALLED (2/20)

#### anydesign
Extract design systems from visual sources (websites, Figma, images, screenshots)
```bash
/anydesign analyze https://activetheory.net
/anydesign extract-tokens figma-link
/anydesign design-system screenshot.png
```
**Use for**: Inspiration analysis, competitor research, design system extraction

#### gsap-animation-helper-skill
Expert GSAP animation guidance for timelines, ScrollTrigger, and effects
```bash
/gsap-animation-helper-skill choreograph scroll sequence
/gsap-animation-helper-skill timeline staggered reveal
```
**Use for**: Motion choreography, scroll animations, timeline composition

---

### ⏳ PENDING (18/20)

## Creative Direction / Design

#### wilwaldon/Claude-Code-Frontend-Design-Toolkit
Frontend design patterns and component architecture
- Design system fundamentals
- Component specifications
- Responsive layout patterns
```bash
npx skillfish add wilwaldon/Claude-Code-Frontend-Design-Toolkit
```

#### luukalleman/premium-design-skill
Luxury brand design and high-end aesthetic patterns
- Premium color systems
- Refined typography hierarchies
- Luxury component patterns
```bash
npx skillfish add luukalleman/premium-design-skill
```

#### yasserstudio/creative-first-ui
Creative-driven UI design approaches
- Artistic component design
- Unconventional layouts
- Creative interactions
```bash
npx skillfish add yasserstudio/creative-first-ui
```

#### hammerheart92/StoryForge
Narrative structure and story-driven design
- Story arcs and pacing
- Character development in design
- Plot-driven layouts
```bash
npx skillfish add hammerheart92/StoryForge
```

#### wang1212/storytelling-web
Web-specific storytelling techniques
- Narrative scrolling
- Story sequencing
- Emotional pacing online
```bash
npx skillfish add wang1212/storytelling-web
```

---

## Immersive / Three.js / WebGL

#### CloudAI-X/threejs-skills (10 skills)
Comprehensive Three.js skill suite covering all aspects
- threejs-animation
- threejs-fundamentals
- threejs-geometry
- threejs-interaction
- threejs-lighting
- threejs-loaders
- threejs-materials
- threejs-postprocessing
- threejs-shaders
- threejs-textures
```bash
npx skillfish add CloudAI-X/threejs-skills --all
```

#### OpenAEC-Foundation/Three.js-Claude-Skill-Package
Advanced Three.js patterns and workflows
- Complex scene management
- Advanced lighting techniques
- Custom rendering pipelines
```bash
npx skillfish add OpenAEC-Foundation/Three.js-Claude-Skill-Package --all
```

#### duanhong169/claude-r3f-template
React Three Fiber integration template
- Component-based 3D architecture
- Fiber best practices
- React + Three.js patterns
```bash
npx skillfish add duanhong169/claude-r3f-template
/claude-r3f-template create scene with parallax
```

#### adamperlis/awwwards-motion
Award-winning motion techniques and patterns
- Cinematic animation choreography
- High-end interaction design
- Awwwards Gold standard patterns
```bash
npx skillfish add adamperlis/awwwards-motion
/awwwards-motion cinematic scroll sequence
```

#### JudyZZ/threejs-parallax-skill
Parallax depth systems and layered effects
- Multi-layer parallax
- Depth perception techniques
- Performance-optimized parallax
```bash
npx skillfish add JudyZZ/threejs-parallax-skill
/threejs-parallax-skill create depth system
```

---

## Motion Systems

#### thehetpatel/claude-gsap (18 skills)
Comprehensive GSAP plugin and animation suite
- gsap-3d
- gsap-canvas
- gsap-core
- gsap-custom-ease
- gsap-devtools
- gsap-draggable
- gsap-effects
- gsap-flip
- gsap-framework
- gsap-performance
- gsap-physics
- gsap-scroll-smoother
- gsap-scroll
- gsap-svg
- gsap-text
- gsap-timeline
- gsap-utils
- gsap
```bash
npx skillfish add thehetpatel/claude-gsap --all
/gsap timeline complex choreography
/gsap-scroll create scroll trigger sequence
```

#### kxwxn/gsap-animation-helper-skill (Already Installed ✓)
See above - already available

#### ali-abassi/framer-motion-skill
React component-level animation library
- Component animation patterns
- Gesture-based interactions
- Layout animations
```bash
npx skillfish add ali-abassi/framer-motion-skill
/framer-motion-skill animate on mount sequence
```

---

## Typography / Atmosphere

#### sliday/google-fonts-skill
Google Fonts integration and typography optimization
- Font pairing recommendations
- Performance optimization
- Typography hierarchy
```bash
npx skillfish add sliday/google-fonts-skill
/google-fonts-skill font pairing luxury portfolio
/google-fonts-skill optimize typography performance
```

#### ryanthedev/design-for-ai
AI-friendly design system and workflows
- Design tokens for AI
- Semantic color systems
- AI-optimized layouts
```bash
npx skillfish add ryanthedev/design-for-ai
/design-for-ai create ai-friendly design system
```

#### dannyjpwilliams/ui-sound-design-skill
Audio design and sonic branding
- Interaction sounds
- Ambient soundscapes
- Audio branding
```bash
npx skillfish add dannyjpwilliams/ui-sound-design-skill
/ui-sound-design-skill hover interaction sound
```

#### SrWhiskers/css-atmospheric-backgrounds-skill-claude
Atmospheric CSS effects and backgrounds
- Backdrop filters
- Glow and shadow effects
- Depth perception CSS
- Grain and texture overlays
```bash
npx skillfish add SrWhiskers/css-atmospheric-backgrounds-skill-claude
/css-atmospheric-backgrounds-skill create depth effect
```

---

## Engineering / Memory / Workflow

#### vbcherepanov/total-agent-memory
Long-session memory and context management
- Session memory persistence
- Context window optimization
- Information retrieval
```bash
npx skillfish add vbcherepanov/total-agent-memory
```
**Use for**: Long development sessions, maintaining project context

#### ErlichLiu/DeepClaude
Deep code analysis and optimization
- Performance analysis
- Code quality improvement
- Optimization recommendations
```bash
npx skillfish add ErlichLiu/DeepClaude
```
**Use for**: Performance profiling, code review, optimization

#### vercel-labs/agent-skills
Vercel deployment and performance tools
- Deployment automation
- Performance monitoring
- Edge function optimization
```bash
npx skillfish add vercel-labs/agent-skills
```
**Use for**: Deployment, performance optimization, edge computing

---

## Installation Status

### Current: 2/20 Installed ✓
- anydesign
- gsap-animation-helper-skill

### Pending: 18/20
Use the automated installation script:
```bash
bash install-element-ux-skills.sh
```

Or manually install in groups when rate limit resets:
```bash
# Creative Direction (5 skills)
npx skillfish add wilwaldon/Claude-Code-Frontend-Design-Toolkit
npx skillfish add luukalleman/premium-design-skill
npx skillfish add yasserstudio/creative-first-ui
npx skillfish add hammerheart92/StoryForge
npx skillfish add wang1212/storytelling-web

# Immersive (5 skills)
npx skillfish add CloudAI-X/threejs-skills --all
npx skillfish add OpenAEC-Foundation/Three.js-Claude-Skill-Package --all
npx skillfish add duanhong169/claude-r3f-template
npx skillfish add adamperlis/awwwards-motion
npx skillfish add JudyZZ/threejs-parallax-skill

# Motion (2 skills)
npx skillfish add thehetpatel/claude-gsap --all
npx skillfish add ali-abassi/framer-motion-skill

# Typography/Atmosphere (4 skills)
npx skillfish add sliday/google-fonts-skill
npx skillfish add ryanthedev/design-for-ai
npx skillfish add dannyjpwilliams/ui-sound-design-skill
npx skillfish add SrWhiskers/css-atmospheric-backgrounds-skill-claude

# Engineering (3 skills)
npx skillfish add vbcherepanov/total-agent-memory
npx skillfish add ErlichLiu/DeepClaude
npx skillfish add vercel-labs/agent-skills
```

---

## Workflow Integration

### Inspiration & Reference
```bash
# 1. Analyze inspiration
/anydesign analyze https://example-luxury-portfolio.com

# 2. Extract design tokens
/design-for-ai create color system from analysis

# 3. Define typography
/google-fonts-skill luxury serif and sans-serif pairing
```

### Scene & Animation Setup
```bash
# 1. Create Three.js scene
/threejs-fundamentals setup scene with cameras

# 2. Add React Three Fiber
/claude-r3f-template create component architecture

# 3. Plan choreography
/gsap-animation-helper-skill design scroll choreography
```

### Component Development
```bash
# 1. Design components
/creative-first-ui design case study card component

# 2. Add animation
/framer-motion-skill animate on hover states

# 3. Implement atmospheric effects
/css-atmospheric-backgrounds-skill add depth glow
```

### Performance & Optimization
```bash
# 1. Profile performance
/DeepClaude analyze animation performance

# 2. Optimize assets
/google-fonts-skill optimize font loading

# 3. Deploy with monitoring
/vercel-labs/agent-skills deploy and monitor
```

---

## Skill Combinations

### For Hero Section
- `premium-design-skill` (visual language)
- `awwwards-motion` (cinematic entrance)
- `gsap-animation-helper-skill` (timeline choreography)
- `threejs-parallax-skill` (depth parallax)

### For Case Study Cards
- `creative-first-ui` (component design)
- `framer-motion-skill` (hover animations)
- `css-atmospheric-backgrounds-skill` (card atmosphere)
- `google-fonts-skill` (typography)

### For Full Page Scroll Experience
- `StoryForge` + `storytelling-web` (narrative structure)
- `gsap-animation-helper-skill` + `claude-gsap` (choreography)
- `threejs-parallax-skill` (depth effects)
- `framer-motion-skill` (component transitions)

---

## Quick Commands

```bash
# Check installed skills
ls -1 ~/.claude/skills/ | sort

# Install all pending skills
bash install-element-ux-skills.sh

# Load environment
source .env.element-ux

# Start development
npm run dev

# Profile performance
npm run profile

# Deploy
npm run build && npm run deploy
```

---

**Last Updated**: 2026-05-20  
**Status**: 2/20 skills installed, 18 pending (rate limited)  
**Next**: Retry installations after GitHub API rate limit reset
