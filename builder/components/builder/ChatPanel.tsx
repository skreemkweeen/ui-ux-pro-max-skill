"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { stripCodeBlock } from "@/lib/extractCode";
import PromptInput from "./PromptInput";

interface ChatPanelProps {
  messages: Message[];
  prompt: string;
  onPromptChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

function renderContent(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].slice(3).trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <div key={i} className="my-2 relative group">
          {lang && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-t-lg text-[11px] font-mono"
              style={{ background: "#020617", borderBottom: "1px solid #1e293b", color: "#64748b" }}>
              <span>{lang}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(71,85,105,0.4)", color: "#94a3b8", cursor: "pointer" }}
              >
                Copy
              </button>
            </div>
          )}
          <pre className={`chat-code-block ${lang ? "rounded-t-none" : ""}`}>
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Inline code: `code`
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((inline, j) => {
          if (inline.startsWith("`") && inline.endsWith("`")) {
            return <code key={j} className="chat-inline-code">{inline.slice(1, -1)}</code>;
          }
          // Bold: **text**
          const boldParts = inline.split(/(\*\*[^*]+\*\*)/g);
          return (
            <span key={j}>
              {boldParts.map((b, k) => {
                if (b.startsWith("**") && b.endsWith("**")) {
                  return <strong key={k} style={{ color: "#f1f5f9", fontWeight: 600 }}>{b.slice(2, -2)}</strong>;
                }
                return <span key={k}>{b}</span>;
              })}
            </span>
          );
        })}
      </span>
    );
  });
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const displayText = isUser ? message.content : stripCodeBlock(message.content);
  const hasOnlyCode = !isUser && displayText === "" && message.content.includes("```html");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed"
          style={isUser ? {
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.2)",
            color: "#e2e8f0",
            borderBottomRightRadius: 6,
          } : {
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(71,85,105,0.3)",
            color: "#cbd5e1",
            borderBottomLeftRadius: 6,
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : hasOnlyCode ? (
            <div className="flex items-center gap-2" style={{ color: "#86efac" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[13px]">Website generated — check the preview!</span>
            </div>
          ) : (
            <div className={`whitespace-pre-wrap ${message.streaming ? "typing-cursor" : ""}`}>
              {renderContent(displayText || message.content)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const WELCOME_SUGGESTIONS = [
  "Build me a landing page for a SaaS startup",
  "Create a portfolio for a photographer",
  "Design a pricing page with 3 tiers",
];

export default function ChatPanel({
  messages,
  prompt,
  onPromptChange,
  onSubmit,
  loading,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a1120" }}>
      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-5 pb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "#f1f5f9" }}>
                Start building
              </h3>
              <p className="text-[13px] leading-relaxed max-w-[220px]" style={{ color: "#64748b" }}>
                Describe any website and AI will build it instantly.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {WELCOME_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { onPromptChange(s); }}
                  className="prompt-chip rounded-xl px-3.5 py-2.5 text-[12.5px] text-left transition-all duration-200"
                  style={{
                    background: "rgba(30,41,59,0.5)",
                    border: "1px solid rgba(71,85,105,0.3)",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Loading dots */}
        {loading && !messages.some(m => m.streaming) && (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div className="rounded-2xl px-4 py-3" style={{
              background: "rgba(30,41,59,0.6)", border: "1px solid rgba(71,85,105,0.3)", borderBottomLeftRadius: 6,
            }}>
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-2 w-2 rounded-full animate-bounce"
                    style={{ background: "#475569", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 pb-4 pt-2" style={{ borderTop: "1px solid rgba(71,85,105,0.2)" }}>
        <PromptInput
          value={prompt}
          onChange={onPromptChange}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
