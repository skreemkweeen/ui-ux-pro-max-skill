"use client";

import { useRef, useEffect } from "react";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  placeholder?: string;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  loading,
  placeholder = "Describe a change or ask a question...",
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) onSubmit();
    }
  }

  return (
    <div
      className="relative glass rounded-xl"
      style={{ border: "1px solid rgba(71,85,105,0.4)" }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={loading}
        className="w-full resize-none rounded-xl px-4 pt-3.5 pb-12 text-[13.5px] leading-relaxed outline-none transition-colors placeholder:opacity-40 disabled:opacity-60"
        style={{
          background: "transparent",
          color: "#f8fafc",
          caretColor: "#22c55e",
          minHeight: 52,
        }}
      />

      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: "#475569" }}>
          {loading ? "Generating…" : "⏎ Send · Shift+⏎ newline"}
        </span>
        <button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
          style={{
            background: loading || !value.trim() ? "rgba(71,85,105,0.3)" : "#22c55e",
            cursor: loading || !value.trim() ? "not-allowed" : "pointer",
          }}
          aria-label="Send message"
        >
          {loading ? (
            <svg
              className="animate-spin"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={value.trim() ? "#0f172a" : "#64748b"} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
