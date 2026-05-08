import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { BlendStack } from "@/components/BlendStack";
import { CinematicProjectFooter } from "@/components/footer/CinematicProjectFooter";
import vantaHero from "@/assets/vanta-hero.jpg";
import vantaApp from "@/assets/vanta-app.png";
import vantaScreens from "@/assets/vanta-screens.png";
import vantaFront from "@/assets/vanta-front.png";
import vantaBack from "@/assets/vanta-back.png";

const meta = [
  { k: "Client", v: "Vanta Supply" },
  { k: "Year", v: "2026" },
  { k: "Scope", v: "Brand · Web · App" },
  { k: "Role", v: "Design & Engineering" },
];

const Vanta = () => (
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
              Built in the dark · Made to stand out
            </p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="mt-6 text-[clamp(3.5rem,14vw,12rem)] font-semibold leading-[0.85] tracking-tight">
              VANTA
              <br />
              SUPPLY
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

      <section className="px-6 py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-fg))]">
              Overview
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-2xl leading-relaxed tracking-tight">
              A streetwear identity for the post-digital underground. Vanta
              Supply fuses cinematic photography, glitched typography, and
              engineered motion into a unified system spanning brand,
              e-commerce, and a native drop experience.
            </p>
          </Reveal>
        </div>
      </section>

      <BlendStack
        className="pb-32"
        overlap={14}
        images={[
          { src: vantaHero, alt: "Vanta Supply website hero", ratio: 16 / 10 },
          { src: vantaFront, alt: "Vanta hoodie front", ratio: 4 / 5 },
          { src: vantaBack, alt: "Vanta hoodie back", ratio: 4 / 5 },
          { src: vantaApp, alt: "Vanta app mockup", ratio: 16 / 10 },
          { src: vantaScreens, alt: "Vanta app screens", ratio: 16 / 9 },
        ]}
      />
    </main>

    <CinematicProjectFooter
      projectTitle="VANTA"
      ribbonPhrases={["DIGITAL FASHION", "DROP SYSTEM", "CYBER STREETWEAR", "UI/UX"]}
      ribbonColor="default"
      nextProject={{ title: "Elion", slug: "elion" }}
      ctaText="Build The Next Signal."
    />
  </div>
);

export default Vanta;
