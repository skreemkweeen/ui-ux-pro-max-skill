// Case study content — replace with MDX or CMS in production.
// Typed here so every case study has identical, enforced structure.

export interface CaseStudy {
  slug:        string
  title:       string
  tagline:     string
  category:    string
  year:        string
  client:      string
  role:        string
  duration:    string
  thumbnail:   string
  heroImage:   string

  overview:    string
  problem:     string
  process:     ProcessSection[]
  result:      string
  metrics:     Metric[]

  images:      CaseImage[]
  nextSlug:    string | null
  prevSlug:    string | null
}

export interface ProcessSection {
  phase:       string
  description: string
  outputs:     string[]
}

export interface Metric {
  value:  string
  label:  string
}

export interface CaseImage {
  src:    string
  alt:    string
  full?:  boolean   // full-bleed vs contained
}

// ── Sample data ───────────────────────────────────────────────────────────────

export const CASES: CaseStudy[] = [
  {
    slug:      'apex-brand-identity',
    title:     'Apex',
    tagline:   'A brand built to lead, not follow.',
    category:  'Brand Identity',
    year:      '2024',
    client:    'Apex Capital',
    role:      'Brand Strategy · Visual Identity',
    duration:  '8 weeks',
    thumbnail: '/work/apex.webp',
    heroImage: '/work/apex-hero.webp',

    overview:
      'Apex Capital needed a visual identity that matched their market ' +
      'position — first-mover, category-defining, and unmistakably serious. ' +
      'The brief: look like the firm you want to be, not the firm you are.',

    problem:
      'Their previous identity was indistinguishable from every other ' +
      'mid-market fund — dark navy, serif wordmark, generic icon. It communicated ' +
      '"we exist" rather than "we lead." Senior partners were losing pitches ' +
      'not on substance, but on first impression.',

    process: [
      {
        phase:       'Research & Audit',
        description: 'Mapped 40 competitor identities across three tiers of the market. Identified the visual codes that signal authority vs. aspiration vs. incumbency. Found a clear white space: no firm in their tier owned geometric precision + warmth.',
        outputs:     ['Competitive matrix', 'Visual territory map', 'Brand positioning brief'],
      },
      {
        phase:       'Identity Development',
        description: 'Explored three directions: Typographic Authority, Geometric Mark, and Editorial Restraint. The winning direction combined a custom wordmark with tight negative-space geometry — a mark that reads as a signature at small sizes and a statement at large.',
        outputs:     ['3 identity directions', 'Logo system', 'Color & type system'],
      },
      {
        phase:       'System & Rollout',
        description: 'Built a complete brand system covering digital, print, and environmental applications. Delivered 80-page brand guidelines, production-ready assets, and a 30-minute onboarding video for their internal team.',
        outputs:     ['Brand guidelines', 'Asset library', 'Application templates'],
      },
    ],

    result:
      'Launched at their annual investor day. Three LPs commented on the identity ' +
      'unprompted. The managing partner used it as an example of "what category ' +
      'leadership looks like" in a keynote two months later.',

    metrics: [
      { value: '3×',   label: 'pitch deck open rate' },
      { value: '+40%', label: 'website session duration' },
      { value: '8wk',  label: 'concept to launch' },
    ],

    images: [
      { src: '/work/apex-1.webp', alt: 'Apex logo mark on dark background', full: true },
      { src: '/work/apex-2.webp', alt: 'Business card and stationery system' },
      { src: '/work/apex-3.webp', alt: 'Brand color palette and type specimens' },
      { src: '/work/apex-4.webp', alt: 'Digital application — investor portal', full: true },
    ],

    prevSlug: null,
    nextSlug: 'flow-product-design',
  },
  {
    slug:      'flow-product-design',
    title:     'Flow',
    tagline:   'Complexity, made invisible.',
    category:  'Product Design',
    year:      '2024',
    client:    'Flow Technologies',
    role:      'UX Research · Product Design · Design System',
    duration:  '14 weeks',
    thumbnail: '/work/flow.webp',
    heroImage: '/work/flow-hero.webp',

    overview:
      'Flow builds workflow automation for operations teams at mid-market ' +
      'SaaS companies. Their product had powerful capabilities buried under ' +
      'an interface that required a 3-hour onboarding call to navigate.',

    problem:
      'Time-to-value was 11 days. Churn at 90 days was 34%. Exit surveys ' +
      'cited "too complicated" despite users confirming the underlying ' +
      'functionality was exactly what they needed.',

    process: [
      {
        phase:       'Research',
        description: 'Ran 14 user interviews across three customer segments. Mapped the full activation journey and identified 7 distinct failure points — all in the first session.',
        outputs:     ['Interview synthesis', 'Journey map', 'Failure point analysis'],
      },
      {
        phase:       'Information Architecture',
        description: 'Rebuilt the nav and information model from zero. Replaced a flat menu of 22 items with a task-based hierarchy of 5 primary actions. Card-sorted with 12 users to validate.',
        outputs:     ['IA model', 'Card sort results', 'Navigation prototype'],
      },
      {
        phase:       'Design & Testing',
        description: 'Three rounds of usability testing across 8 weeks. Each round targeted the highest-friction tasks from the previous round. Shipped a full design system alongside the redesign.',
        outputs:     ['Figma design system', 'Interactive prototype', 'Dev specs'],
      },
    ],

    result:
      'Time-to-value dropped from 11 days to 3.2. 90-day churn fell to 18%. ' +
      'The onboarding call was eliminated. NPS moved from 24 to 61 in the ' +
      'first quarter post-launch.',

    metrics: [
      { value: '71%',  label: 'reduction in time-to-value' },
      { value: '−16%', label: 'churn at 90 days' },
      { value: '+37',  label: 'NPS points gained' },
    ],

    images: [
      { src: '/work/flow-1.webp', alt: 'Flow dashboard — new information architecture', full: true },
      { src: '/work/flow-2.webp', alt: 'Workflow builder — simplified drag interface' },
      { src: '/work/flow-3.webp', alt: 'Design system component library' },
      { src: '/work/flow-4.webp', alt: 'Mobile responsive views', full: true },
    ],

    prevSlug: 'apex-brand-identity',
    nextSlug: 'harvest-web-design',
  },
]

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find(c => c.slug === slug)
}

export function getAllSlugs(): string[] {
  return CASES.map(c => c.slug)
}
