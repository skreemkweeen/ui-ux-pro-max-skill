"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/builder/Header";
import ChatPanel from "@/components/builder/ChatPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import type { Message } from "@/lib/types";
import { extractHtml } from "@/lib/extractCode";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled Project");

  // Resizable pane state
  const [leftWidth, setLeftWidth] = useState(38); // percent
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Send the initial prompt from URL on mount
  const didSendInitial = useRef(false);
  useEffect(() => {
    if (initialPrompt && !didSendInitial.current) {
      didSendInitial.current = true;
      setProjectName(initialPrompt.slice(0, 40) + (initialPrompt.length > 40 ? "…" : ""));
      sendMessage(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: generateId(), role: "user", content: text };
    const aiId = generateId();

    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    // Build history for API
    const history = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Add streaming placeholder
    setMessages(prev => [
      ...prev,
      { id: aiId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error(await res.text());
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });

        setMessages(prev =>
          prev.map(m =>
            m.id === aiId ? { ...m, content: fullText } : m
          )
        );

        // Update preview with partial HTML as it streams
        const partial = extractHtml(fullText);
        if (partial) setPreviewHtml(partial);
      }

      // Finalize message (remove streaming cursor)
      setMessages(prev =>
        prev.map(m =>
          m.id === aiId ? { ...m, content: fullText, streaming: false } : m
        )
      );

      // Final HTML extraction
      const finalHtml = extractHtml(fullText);
      if (finalHtml) setPreviewHtml(finalHtml);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      setMessages(prev =>
        prev.map(m =>
          m.id === aiId
            ? { ...m, content: `Sorry, an error occurred: ${errMsg}`, streaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading]);

  // Resizable pane drag logic
  const handleDividerMouseDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    el.classList.add("active");

    function onMove(ev: PointerEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(Math.max(pct, 25), 70));
    }

    function onUp() {
      isDragging.current = false;
      el.classList.remove("active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const handleExport = useCallback(() => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [previewHtml]);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a1120" }}>
      <Header projectName={projectName} onExport={handleExport} />

      {/* Split pane */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left: Chat */}
        <div className="flex flex-col overflow-hidden" style={{ width: `${leftWidth}%`, minWidth: 280 }}>
          <ChatPanel
            messages={messages}
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={() => sendMessage(prompt)}
            loading={loading}
          />
        </div>

        {/* Divider */}
        <div
          className="resize-handle select-none"
          onPointerDown={handleDividerMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        />

        {/* Right: Preview */}
        <div className="flex flex-col overflow-hidden flex-1">
          <PreviewPanel html={previewHtml} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center" style={{ background: "#0a1120" }}>
        <div className="h-8 w-8 rounded-full animate-spin" style={{ border: "2px solid rgba(34,197,94,0.2)", borderTopColor: "#22c55e" }} />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
