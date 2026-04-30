import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Nav }             from '@/components/layout/Nav'
import { Cursor }          from '@/components/ui/Cursor'
import { PageTransition }  from '@/components/ui/motion/PageTransition'
import { LenisProvider }   from '@/components/ui/LenisProvider'
import { LoadingScreen }   from '@/components/ui/LoadingScreen'

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'Element UX — UX Design & Brand Strategy',
    template: '%s · Element UX',
  },
  description:
    'UX design and brand strategy for companies that care about the ' +
    'difference between good and deliberate.',
  keywords: ['UX design', 'brand strategy', 'product design', 'design systems'],
  authors:  [{ name: 'Element UX' }],
  creator:  'Element UX',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://elementux.co',
    siteName:    'Element UX',
    title:       'Element UX — UX Design & Brand Strategy',
    description: 'UX design and brand strategy for companies that care about the difference between good and deliberate.',
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Element UX — UX Design & Brand Strategy',
    creator: '@elementux',
  },
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:           true,
      follow:          true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':   -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor:    '#080809',
  colorScheme:   'dark',
  width:         'device-width',
  initialScale:   1,
}

// ── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Skip link — must be first focusable element in DOM */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        {/* Loading screen — blocks paint on first visit, skipped thereafter */}
        <LoadingScreen />

        {/* Custom cursor — hidden on touch devices via CSS */}
        <Cursor />

        {/* Sticky navigation */}
        <Nav />

        {/* Lenis smooth scroll + page content */}
        <LenisProvider>
          <PageTransition>
            <main id="main" tabIndex={-1}>
              {children}
            </main>
          </PageTransition>
        </LenisProvider>
      </body>
    </html>
  )
}
