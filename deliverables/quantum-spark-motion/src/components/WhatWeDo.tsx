import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";

// ─── Service data ─────────────────────────────────────────────────────────────
// Fields mapped to GalleryItem:
//   common   → service title
//   binomial → category tagline (shown above the title on each card)
//   photo.by → service number ("01"…"08")
const serviceData: GalleryItem[] = [
  {
    common: "UX / UI Design",
    binomial: "RESEARCH · PROTOTYPE · SHIP",
    photo: {
      url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=900&auto=format&fit=crop&q=80",
      text: "UI design interface on screen",
      pos: "center",
      by: "01",
    },
  },
  {
    common: "Graphic Design",
    binomial: "VISUAL · EDITORIAL · PRINT",
    photo: {
      url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format&fit=crop&q=80",
      text: "abstract graphic design",
      pos: "center",
      by: "02",
    },
  },
  {
    common: "Art Direction",
    binomial: "CONCEPT · VISION · EXECUTE",
    photo: {
      url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&auto=format&fit=crop&q=80",
      text: "art direction creative work",
      pos: "center",
      by: "03",
    },
  },
  {
    common: "Brand Identity",
    binomial: "MARK · SYSTEM · LANGUAGE",
    photo: {
      url: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=900&auto=format&fit=crop&q=80",
      text: "brand identity colour system",
      pos: "center",
      by: "04",
    },
  },
  {
    common: "Web Design",
    binomial: "LAYOUT · MOTION · CODE",
    photo: {
      url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&auto=format&fit=crop&q=80",
      text: "web design on laptop screen",
      pos: "center",
      by: "05",
    },
  },
  {
    common: "Motion Design",
    binomial: "ANIMATE · SEQUENCE · FEEL",
    photo: {
      url: "https://images.unsplash.com/photo-1574717024652-8a8fad0f3e98?w=900&auto=format&fit=crop&q=80",
      text: "motion design animation blur",
      pos: "center",
      by: "06",
    },
  },
  {
    common: "Marketing",
    binomial: "REACH · CONVERT · GROW",
    photo: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
      text: "digital marketing analytics",
      pos: "center",
      by: "07",
    },
  },
  {
    common: "Strategy",
    binomial: "DEFINE · ALIGN · EXECUTE",
    photo: {
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&auto=format&fit=crop&q=80",
      text: "business strategy planning",
      pos: "center",
      by: "08",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function WhatWeDo() {
  const anglePerItem = 360 / serviceData.length; // 45° per card
  const [rotationOffset, setRotationOffset] = useState(0);

  const prev = () => setRotationOffset((o) => o - anglePerItem);
  const next = () => setRotationOffset((o) => o + anglePerItem);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#050508", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      {/* Grid texture — matches hero density exactly */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Thin top separator */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.055) 20%, rgba(255,255,255,0.055) 80%, transparent)",
        }}
      />

      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 mb-14">
        <Reveal>
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.38em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Our Expertise
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-bold leading-[0.85] tracking-tight"
            style={{
              fontSize: "clamp(3rem,10vw,8rem)",
              color: "#fff",
            }}
          >
            WHAT WE DO
          </h2>
        </Reveal>
      </div>

      {/* ── Circular 3D gallery ─────────────────────────────────────── */}
      <div className="relative z-10 w-full" style={{ height: "560px" }}>
        <CircularGallery
          items={serviceData}
          radius={650}
          autoRotateSpeed={0.012}
          rotationOffset={rotationOffset}
        />
      </div>

      {/* ── Bottom bar: arrows + description ───────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 mt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          {/* Prev / Next arrows — styled to match the portfolio */}
          <Reveal>
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous service"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.35)";
                  el.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <ArrowLeft size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
              </button>
              <button
                onClick={next}
                aria-label="Next service"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.35)";
                  el.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
              </button>
            </div>
          </Reveal>

          {/* Studio descriptor */}
          <Reveal delay={120}>
            <div className="max-w-sm md:text-right">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.04em",
                }}
              >
                We craft digital systems and experiences that not only meet but
                exceed the expectations of the brands we build for.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Thin bottom separator */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.055) 20%, rgba(255,255,255,0.055) 80%, transparent)",
        }}
      />
    </section>
  );
}
