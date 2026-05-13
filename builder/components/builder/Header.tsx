"use client";

interface HeaderProps {
  projectName: string;
  onExport: () => void;
}

export default function Header({ projectName, onExport }: HeaderProps) {
  return (
    <header
      className="glass-dark flex h-14 shrink-0 items-center justify-between px-4 sm:px-6"
      style={{ borderBottom: "1px solid rgba(71,85,105,0.3)", zIndex: 40 }}
    >
      {/* Logo + project name */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#f8fafc" }}>Antigravity</span>
        </a>
        <span style={{ color: "#334155" }}>/</span>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
          <span className="max-w-[180px] truncate text-sm font-medium" style={{ color: "#94a3b8" }}>
            {projectName}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#86efac",
            cursor: "pointer",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = "rgba(34,197,94,0.2)";
            el.style.borderColor = "rgba(34,197,94,0.4)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = "rgba(34,197,94,0.12)";
            el.style.borderColor = "rgba(34,197,94,0.25)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>
    </header>
  );
}
