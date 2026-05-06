import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';

interface FooterNavigationProps {
  nextProject?: { title: string; slug: string };
  email?: string;
  location?: string;
  copyrightName?: string;
  accentColor?: string;
}

function item(delay: number) {
  return {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay },
    },
  };
}

export function FooterNavigation({
  nextProject,
  email = 'studio@elementux.co',
  location = 'Lisbon · New York',
  copyrightName = 'Elementux',
  accentColor = '140, 80, 255',
}: FooterNavigationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const year = new Date().getFullYear();

  return (
    <div
      ref={ref}
      className="relative px-6 pb-16 pt-10 md:px-12 lg:px-20"
    >
      {/* Top rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 h-px origin-left"
        style={{
          background: `linear-gradient(90deg, rgba(${accentColor}, 0.35) 0%, rgba(255,255,255,0.07) 55%, transparent 100%)`,
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8">

          {/* — Back to Work */}
          <motion.div
            variants={item(0)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p
              className="mb-5 text-[9px] uppercase tracking-[0.38em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              Navigation
            </p>
            <Link
              to="/#work"
              className="group flex items-center gap-3"
            >
              <span
                className="h-px transition-all duration-500 ease-out group-hover:w-14"
                style={{
                  width: '2rem',
                  background: 'rgba(255,255,255,0.4)',
                  display: 'inline-block',
                }}
              />
              <span
                className="text-xs uppercase tracking-[0.22em] transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.95)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
              >
                Back to Work
              </span>
            </Link>
          </motion.div>

          {/* — Next Project */}
          <motion.div
            variants={item(0.1)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p
              className="mb-5 text-[9px] uppercase tracking-[0.38em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {nextProject ? 'Next Project' : ''}
            </p>
            {nextProject && (
              <Link
                to={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-4"
              >
                <span
                  style={{
                    fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.75)',
                    transition: 'color 0.35s ease',
                  }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
                >
                  {nextProject.title}
                </span>
                <ArrowRight
                  size={22}
                  className="shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2"
                  style={{ color: `rgba(${accentColor}, 0.7)` }}
                />
              </Link>
            )}
          </motion.div>

          {/* — Contact */}
          <motion.div
            variants={item(0.2)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p
              className="mb-5 text-[9px] uppercase tracking-[0.38em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              Contact
            </p>
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-2"
            >
              <span
                className="text-sm tracking-wide underline underline-offset-4 decoration-transparent transition-all duration-300 group-hover:decoration-current"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
              >
                {email}
              </span>
              <ArrowUpRight
                size={13}
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              />
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.5 }}
          className="mt-20 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <MapPin size={11} />
            <span className="text-[10px] uppercase tracking-[0.22em]">{location}</span>
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(255,255,255,0.14)' }}
          >
            © {year} {copyrightName}. All rights reserved.
          </span>
        </motion.div>
      </div>
    </div>
  );
}
