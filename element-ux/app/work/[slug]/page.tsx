import { notFound }       from 'next/navigation'
import type { Metadata }   from 'next'
import { getCase, getAllSlugs, type CaseStudy } from '@/lib/cases'
import { CaseHero }        from '@/components/work/CaseHero'
import { CaseBody }        from '@/components/work/CaseBody'
import { CaseNav }         from '@/components/work/CaseNav'
import { Footer }          from '@/components/layout/Footer'

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const cs = getCase(params.slug)
  if (!cs) return {}

  return {
    title:       `${cs.title} — ${cs.category}`,
    description: cs.overview,
    openGraph: {
      title:       `${cs.title} — ${cs.category}`,
      description: cs.overview,
      images:      cs.heroImage ? [{ url: cs.heroImage }] : [],
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCase(params.slug)
  if (!cs) notFound()

  return (
    <>
      <CaseHero cs={cs} />
      <CaseBody cs={cs} />
      <CaseNav  cs={cs} />
      <Footer />
    </>
  )
}
