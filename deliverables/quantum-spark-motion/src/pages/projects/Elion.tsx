import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { CinematicProjectFooter } from "@/components/footer/CinematicProjectFooter";
import elionInterface from "@/assets/elion-interface.png";
import elionBrandSystem from "@/assets/elion-brand-system.png";
import elionSoundbarSystem from "@/assets/elion-soundbar-system.png";
import elionConcepts from "@/assets/elion-concepts.png";
import elionIdentityBoard from "@/assets/elion-identity-board.png";
import elionHeadphones from "@/assets/elion-headphones.png";
import elionHeadphonesSystem from "@/assets/elion-headphones-system.png";
import elionBillboards from "@/assets/elion-billboards.png";

const meta = [
  { k: "Client", v: "Elion" },
  { k: "Year", v: "2026" },
  { k: "Scope", v: "Brand · Product · Experience" },
  { k: "Category", v: "Audio Technology" },
];

const Elion = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Nav />
    <main>
      <section className="relative px-6 pt-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              to="/#work"
              className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))] hover:text-foreground"
            >
              ← Selected Work
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Engineered frequency · Physical impact
            </p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="mt-6 text-[clamp(3.5rem,14vw,12rem)] font-semibold leading-[0.85] tracking-tight">
              ELION
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[hsl(var(--accent-line))] pt-8 md:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k}>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
                    {m.k}
                  </div>
                  <div className="mt-2 text-sm">{m.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full-width interface image */}
      <section className="px-6 pt-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="overflow-hidden rounded-sm">
              <img
                src={elionInterface}
                alt="Elion interface"
                className="w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Overview
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-2xl leading-relaxed tracking-tight">
              Elion treats sound as a visual and tactile medium. The system
              pairs deep blacks, precision metallic finishes, and controlled
              violet-blue accents to build a brand that communicates frequency,
              weight, and precision without a single word.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Identity system */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h3 className="mb-10 text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Identity System
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal delay={60}>
              <img src={elionBrandSystem} alt="Elion brand system" className="w-full object-cover" />
            </Reveal>
            <Reveal delay={120}>
              <img src={elionIdentityBoard} alt="Elion identity board" className="w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Product system */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h3 className="mb-10 text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Product System
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal delay={60}>
              <img src={elionSoundbarSystem} alt="Elion soundbar system" className="w-full object-cover" />
            </Reveal>
            <Reveal delay={120}>
              <img src={elionConcepts} alt="Elion product concepts" className="w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Headphones showcase */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h3 className="mb-10 text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Headphones
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal delay={60}>
              <img src={elionHeadphones} alt="Elion headphones" className="w-full object-cover" />
            </Reveal>
            <Reveal delay={120}>
              <img src={elionHeadphonesSystem} alt="Elion headphones system" className="w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Campaign */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h3 className="mb-10 text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Campaign Execution
            </h3>
          </Reveal>
          <Reveal delay={80}>
            <img src={elionBillboards} alt="Elion campaign billboards" className="w-full object-cover" />
          </Reveal>
        </div>
      </section>
    </main>

    <CinematicProjectFooter
      projectTitle="ELION"
      ribbonPhrases={["AUDIO TECHNOLOGY", "SONIC ENGINEERING", "IMMERSIVE SOUND", "INDUSTRIAL DESIGN"]}
      ribbonColor="cool"
      nextProject={{ title: "Sip Society", slug: "sip-society" }}
      ctaText="Design Beyond Static."
    />
  </div>
);

export default Elion;
