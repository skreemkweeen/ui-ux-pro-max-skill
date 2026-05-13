"use client";

import { useState, useCallback } from "react";
import type { DeviceMode, ViewMode } from "@/lib/types";

interface PreviewPanelProps {
  html: string | null;
  loading: boolean;
}

const DEVICES: { id: DeviceMode; label: string; width: string | number; icon: React.ReactNode }[] = [
  {
    id: "desktop",
    label: "Desktop",
    width: "100%",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "tablet",
    label: "Tablet",
    width: 768,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    width: 375,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

export default function PreviewPanel({ html, loading }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentDevice = DEVICES.find(d => d.id === device)!;

  const handleCopy = useCallback(async () => {
    if (!html) return;
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#060d1a" }}>
      {/* Toolbar */}
      <div
        className="flex h-12 shrink-0 items-center justify-between gap-3 px-4"
        style={{ borderBottom: "1px solid rgba(71,85,105,0.25)", background: "#0a1120" }}
      >
        {/* Device switcher */}
        <div className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)" }}>
          {DEVICES.map(d => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150"
              style={{
                background: device === d.id ? "rgba(34,197,94,0.15)" : "transparent",
                color: device === d.id ? "#86efac" : "#64748b",
                cursor: "pointer",
                border: device === d.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
              }}
              title={d.label}
            >
              {d.icon}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)" }}>
          {(["preview", "code"] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 capitalize"
              style={{
                background: viewMode === m ? "rgba(34,197,94,0.15)" : "transparent",
                color: viewMode === m ? "#86efac" : "#64748b",
                cursor: "pointer",
                border: viewMode === m ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            disabled={!html}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150"
            style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)", cursor: html ? "pointer" : "not-allowed", color: html ? "#94a3b8" : "#334155" }}
            title="Refresh preview"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            disabled={!html}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150"
            style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)", cursor: html ? "pointer" : "not-allowed", color: html ? "#94a3b8" : "#334155" }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: "#22c55e" }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={!html}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150"
            style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)", cursor: html ? "pointer" : "not-allowed", color: html ? "#94a3b8" : "#334155" }}
            title="Download HTML"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden flex items-start justify-center"
        style={{ background: device === "desktop" ? "transparent" : "#050b14", padding: device === "desktop" ? 0 : "20px 16px" }}>

        {viewMode === "preview" ? (
          <>
            {/* Empty state */}
            {!html && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: "#475569" }}>No preview yet</p>
                  <p className="text-xs" style={{ color: "#334155" }}>Send a message to generate your website</p>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {loading && !html && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full animate-spin"
                    style={{ border: "2px solid rgba(34,197,94,0.15)", borderTopColor: "#22c55e" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: "#64748b" }}>Building your website…</p>
              </div>
            )}

            {/* iFrame preview */}
            {html && (
              <div
                className={device !== "desktop" ? "device-shadow rounded-2xl overflow-hidden transition-all duration-300 flex-shrink-0" : "absolute inset-0"}
                style={device !== "desktop" ? {
                  width: typeof currentDevice.width === "number" ? currentDevice.width : "100%",
                  maxWidth: "100%",
                  height: "100%",
                } : undefined}
              >
                <iframe
                  key={refreshKey}
                  srcDoc={html}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  className="w-full h-full border-0"
                  title="Website preview"
                />
              </div>
            )}
          </>
        ) : (
          /* Code view */
          <div className="absolute inset-0 overflow-auto">
            {!html ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm" style={{ color: "#334155" }}>No code generated yet</p>
              </div>
            ) : (
              <pre
                className="p-5 text-[12.5px] leading-relaxed font-mono min-h-full"
                style={{ color: "#94a3b8", background: "transparent" }}
              >
                <code>{html}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
