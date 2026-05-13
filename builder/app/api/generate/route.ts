import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an elite web developer and UI/UX designer. Your job is to build stunning, production-quality websites based on user descriptions.

When generating websites:
1. Output a COMPLETE, self-contained HTML file with all CSS and JavaScript included inline
2. Use modern CSS: CSS Grid, Flexbox, CSS custom properties, smooth transitions/animations
3. Make it visually polished: gradients, shadows, micro-animations, hover effects
4. Ensure full responsiveness for mobile, tablet, and desktop
5. Use semantic HTML5 for accessibility (aria labels, roles, etc.)
6. Include realistic placeholder content that fits the described product
7. Import Google Fonts via @import in CSS when needed for typography
8. Add subtle JavaScript interactions where appropriate (smooth scroll, modals, etc.)
9. The result should look like a real, professional website — not a template

ALWAYS wrap the HTML in a markdown code block:
\`\`\`html
<!DOCTYPE html>
...
</html>
\`\`\`

After the code block, write 2–3 sentences explaining what was built and key design decisions.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await request.json();
    messages = body.messages;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 8096,
          system: SYSTEM_PROMPT,
          messages,
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(encoder.encode(`\n\nError: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
