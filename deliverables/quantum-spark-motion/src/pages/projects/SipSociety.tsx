import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { LiquidStack } from "@/components/LiquidStack";
import { CinematicProjectFooter } from "@/components/footer/CinematicProjectFooter";
import sipHero from "@/assets/sip-hero.png";
import sipSplash from "@/assets/sip-splash.png";
import sipPackaging from "@/assets/sip-packaging.png";
import sipFlavors from "@/assets/sip-flavors.png";
import sipFlavorSystem from "@/assets/sip-flavor-system.png";
import sipBenefits from "@/assets/sip-benefits.png";
import sipAd from "@/assets/sip-ad.png";
import sipApp from "@/assets/sip-app.png";

const meta = [
  { k: "Client", v: "Sip Society" },
  { k: "Year", v: "2026" },
  { k: "Scope", v: "Brand · Packaging · Web · App" },
  { k: "Category", v: "Functional Beverage" },
];

const SipSociety = () => (
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
              Healthy soda · Real benefits
            </p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="mt-6 text-[clamp(3.5rem,14vw,12rem)] font-semibold leading-[0.85] tracking-tight">
              SIP SOCIETY
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--muted-fg))]">
              A modern functional soda brand built around prebiotics, low sugar,
              and everyday rituals — spanning identity, packaging, web, and a
              companion mobile app.
            </p>
          </Reveal>
          <Reveal delay={280}>
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

      <section className="px-6 py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Overview
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-2xl leading-relaxed tracking-tight">
              Sip Society reimagines soda as a daily ritual. The system pairs
              warm, natural tones with a clean editorial type voice — letting
              ingredients, function, and craft speak for themselves.
            </p>
          </Reveal>
        </div>
      </section>

      <LiquidStack
        className="pb-24"
        overlap={100}
        baseTone="40 30% 96%"
        images={[
          { src: sipHero, alt: "Sip Society hero", ratio: 16 / 10, tone: "20 80% 88%" },
          { src: sipPackaging, alt: "Sip Society packaging system", ratio: 16 / 10, tone: "350 70% 85%" },
          { src: sipSplash, alt: "Sip Society splash photography", ratio: 16 / 10, tone: "50 90% 80%" },
          { src: sipFlavorSystem, alt: "Sip Society flavor system page", ratio: 16 / 10, tone: "90 60% 80%" },
          { src: sipFlavors, alt: "Sip Society flavors page", ratio: 16 / 10, tone: "20 90% 82%" },
          { src: sipBenefits, alt: "Sip Society benefits page", ratio: 16 / 10, tone: "30 70% 90%" },
          { src: sipApp, alt: "Sip Society mobile app screens", ratio: 16 / 10, tone: "200 50% 88%" },
          { src: sipAd, alt: "Sip Society social ad", ratio: 4 / 5, tone: "350 75% 85%" },
        ]}
      />
    </main>

    <CinematicProjectFooter
      projectTitle="SIP SOCIETY"
      ribbonPhrases={["FUNCTIONAL SODA", "BRAND SYSTEM", "PACKAGING", "EDITORIAL DESIGN"]}
      ribbonColor="warm"
      nextProject={{ title: "Vanta", slug: "vanta" }}
      ctaText="Start Something Exceptional."
    />
  </div>
);

export default SipSociety;
