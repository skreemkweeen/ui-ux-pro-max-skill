"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_PROMPTS = [
  "SaaS landing page for a project management tool",
  "Portfolio website for a UX designer",
  "E-commerce homepage for a premium coffee brand",
  "Analytics dashboard with dark theme",
  "Personal blog with minimal design",
  "Restaurant website with online booking",
];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    title: "AI-Powered Generation",
    desc: "Claude AI writes semantic HTML, CSS, and JavaScript tailored to your description.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: "Live Preview",
    desc: "See your website rendered instantly as the AI generates it — no reload required.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Export Clean Code",
    desc: "Copy or download the generated HTML/CSS/JS — ready to deploy anywhere.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: "Iterate with Chat",
    desc: "Refine your design through natural conversation — just describe what to change.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    router.push(`/builder?prompt=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChipClick(text: string) {
    setPrompt(text);
    textareaRef.current?.focus();
  }

  return (
    <div className="relative min-h-full flex flex-col overflow-x-hidden" style={{ background: "#0f172a" }}>
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="orb animate-float-slow animate-pulse-glow"
          style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", top: "5%", left: "55%", transform: "translate(-50%,-20%)" }}
        />
        <div
          className="orb animate-float-mid animate-pulse-glow"
          style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", top: "30%", left: "10%", animationDelay: "2s" }}
        />
        <div
          className="orb animate-float-slow"
          style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)", bottom: "10%", right: "5%", animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: "#f8fafc" }}>
            Antigravity
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium transition-colors" style={{ color: "#94a3b8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f8fafc")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            Features
          </a>
          <a
            href="/builder"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{ background: "#22c55e", color: "#0f172a" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#16a34a"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#22c55e"; }}
          >
            Open Builder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-20 text-center sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-8 text-xs font-medium animate-fade-in"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22c55e" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22c55e" }} />
          </span>
          Powered by Claude AI
        </div>

        <h1
          className="gradient-text max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl animate-slide-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          Build websites<br />with AI.
        </h1>
        <p
          className="mt-6 max-w-xl text-lg leading-relaxed animate-slide-up"
          style={{ color: "#94a3b8", animationDelay: "0.2s", opacity: 0 }}
        >
          Describe what you want — AI writes the code, renders a live preview, and iterates
          with you until it&apos;s perfect.
        </p>

        {/* Prompt input */}
        <div
          className="mt-10 w-full max-w-2xl glass rounded-2xl p-1.5 animate-slide-up glow-green-sm"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the website you want to build..."
              rows={3}
              className="w-full resize-none rounded-xl px-5 pt-4 pb-14 text-[15px] leading-relaxed outline-none transition-colors placeholder:opacity-50"
              style={{
                background: "rgba(15,23,42,0.5)",
                color: "#f8fafc",
                caretColor: "#22c55e",
              }}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs" style={{ color: "#475569" }}>
                {prompt.length > 0 ? `${prompt.length} chars` : "Enter ↵ to send"}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  background: prompt.trim() ? "#22c55e" : "rgba(71,85,105,0.4)",
                  cursor: prompt.trim() ? "pointer" : "not-allowed",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={prompt.trim() ? "#0f172a" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Example prompt chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl animate-slide-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          {EXAMPLE_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleChipClick(p)}
              className="prompt-chip rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200"
              style={{
                background: "rgba(30,41,59,0.6)",
                border: "1px solid rgba(71,85,105,0.4)",
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#f8fafc" }}>
              Everything you need to ship fast
            </h2>
            <p className="mt-3 text-sm" style={{ color: "#64748b" }}>
              From idea to working website in seconds, not hours.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ cursor: "default" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  {f.icon}
                </div>
                <h3 className="mb-2 text-sm font-semibold" style={{ color: "#f8fafc" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-6 py-6 text-center text-xs" style={{ borderColor: "rgba(71,85,105,0.3)", color: "#475569" }}>
        Built with Claude AI · Antigravity Builder
      </footer>
    </div>
  );
}
