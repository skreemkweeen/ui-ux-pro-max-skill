import { useRef } from 'react';
import { GrainOverlay } from './GrainOverlay';
import { CursorGlow } from './CursorGlow';
import { FooterTransitionVeil } from './FooterTransitionVeil';
import { HolographicRibbon } from './HolographicRibbon';
import { DepthField } from './DepthField';
import { FooterTypography } from './FooterTypography';
import { FooterNavigation } from './FooterNavigation';

export interface CinematicProjectFooterProps {
  /** Project name shown in ribbon + ghost typography */
  projectTitle: string;
  /** Phrases used in the holographic ribbon e.g. ["DIGITAL FASHION", "DROP SYSTEM"] */
  ribbonPhrases: string[];
  /** Accent colour key — maps to matching tint */
  ribbonColor?: 'default' | 'warm' | 'cool';
  /** Next project link shown in footer nav */
  nextProject?: { title: string; slug: string };
  /** Headline CTA copy */
  ctaText?: string;
  email?: string;
  location?: string;
  copyrightName?: string;
}

const ACCENT: Record<string, string> = {
  default: '140, 80, 255',
  warm: '255, 130, 55',
  cool: '55, 140, 255',
};

export function CinematicProjectFooter({
  projectTitle,
  ribbonPhrases,
  ribbonColor = 'default',
  nextProject,
  ctaText = 'Start Something Exceptional.',
  email = 'studio@elementux.co',
  location = 'Lisbon · New York',
  copyrightName = 'Elementux',
}: CinematicProjectFooterProps) {
  const containerRef = useRef<HTMLElement>(null);
  const accent = ACCENT[ribbonColor] ?? ACCENT.default;

  return (
    <>
      {/* ── Cinematic transition from project imagery into darkness ── */}
      <FooterTransitionVeil accentColor={accent} />

      {/* ── Main immersive footer body ── */}
      <footer
        ref={containerRef as React.Ref<HTMLElement>}
        className="relative overflow-hidden"
        style={{ background: '#000' }}
      >
        {/* Ambient radial bloom behind everything */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 90% 55% at 50% -5%, rgba(${accent}, 0.07) 0%, transparent 60%)`,
            zIndex: 0,
          }}
        />

        {/* Canvas depth layer: floating particles + light shafts + mouse parallax */}
        <DepthField containerRef={containerRef as React.RefObject<HTMLElement>} count={58} />

        {/* Spring cursor-reactive glow */}
        <CursorGlow
          containerRef={containerRef as React.RefObject<HTMLElement>}
          color={accent}
          size={820}
          opacity={0.12}
        />

        {/* ── Holographic ribbon — primary, large ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <HolographicRibbon
            title={projectTitle}
            phrases={ribbonPhrases}
            speed={44}
            size="large"
            accentColor={accent}
          />
        </div>

        {/* ── Holographic ribbon — secondary, small, reverse ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <HolographicRibbon
            title={projectTitle}
            phrases={[...ribbonPhrases].reverse()}
            speed={28}
            reverse
            size="small"
            accentColor={accent}
          />
        </div>

        {/* ── Cinematic editorial typography + CTA ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <FooterTypography
            ctaText={ctaText}
            ghostWord={projectTitle}
            accentColor={accent}
          />
        </div>

        {/* ── Embedded navigation: next project · back · email · location ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <FooterNavigation
            nextProject={nextProject}
            email={email}
            location={location}
            copyrightName={copyrightName}
            accentColor={accent}
          />
        </div>

        {/* Animated film grain overlay — topmost */}
        <GrainOverlay opacity={0.038} fps={20} />
      </footer>
    </>
  );
}
