import React, { useState, useEffect, useRef, HTMLAttributes } from "react";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface GalleryItem {
  common: string;    // service title
  binomial: string;  // category tagline
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;      // service number ("01", "02", …)
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  /** External rotation offset — used by prev/next arrow navigation */
  rotationOffset?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 600,
      autoRotateSpeed = 0.015,
      rotationOffset = 0,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Scroll → rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        setRotation(scrollProgress * 360);
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // Auto-rotate when idle
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) setRotation((prev) => prev + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;
    const effectiveRotation = rotation + rotationOffset;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Service Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          className
        )}
        style={{ perspective: "2000px" }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${effectiveRotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = effectiveRotation % 360;
            const relativeAngle =
              ((itemAngle + totalRotation) % 360 + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.22, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute w-[300px] h-[400px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-150px",
                  marginTop: "-200px",
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                {/* ── Card shell ── */}
                <div
                  className="relative w-full h-full rounded-sm overflow-hidden"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,4,0.75)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Photo layer */}
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || "center" }}
                  />

                  {/* Cinematic dark gradient over photo */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(0,0,6,0.52) 0%, rgba(0,0,3,0.90) 100%)",
                    }}
                  />

                  {/* Subtle grid texture matching hero */}
                  <div
                    className="absolute inset-0 opacity-100"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)," +
                        "linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* ── Card content ── */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Top row: number + dash */}
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.42em",
                          color: "rgba(255,255,255,0.26)",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.photo.by}
                      </span>
                      <div
                        style={{
                          height: "1px",
                          width: "30px",
                          background: "rgba(255,255,255,0.14)",
                        }}
                      />
                    </div>

                    {/* Center: category tag + service title */}
                    <div className="text-center">
                      <p
                        style={{
                          fontSize: "7px",
                          letterSpacing: "0.32em",
                          color: "rgba(255,255,255,0.30)",
                          textTransform: "uppercase",
                          marginBottom: "10px",
                        }}
                      >
                        {item.binomial}
                      </p>
                      <h2
                        style={{
                          fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                          fontWeight: 800,
                          color: "#fff",
                          letterSpacing: "-0.025em",
                          lineHeight: 1.1,
                        }}
                      >
                        {item.common}
                      </h2>
                    </div>

                    {/* Bottom: accent rule */}
                    <div
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";
export { CircularGallery };
