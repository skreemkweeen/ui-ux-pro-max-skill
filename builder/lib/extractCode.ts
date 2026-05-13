/** Extract the first HTML code block from a markdown string. */
export function extractHtml(text: string): string | null {
  // Match ```html ... ``` (with optional trailing whitespace/newlines)
  const fencedMatch = text.match(/```html\s*\n([\s\S]*?)```/i);
  if (fencedMatch) return fencedMatch[1].trim();

  // Fallback: raw DOCTYPE/html tag
  const rawMatch = text.match(/(<!DOCTYPE html[\s\S]*?<\/html>)/i);
  if (rawMatch) return rawMatch[1].trim();

  return null;
}

/** Strip the HTML code block from text to get the explanation. */
export function stripCodeBlock(text: string): string {
  return text
    .replace(/```html\s*\n[\s\S]*?```/gi, "")
    .replace(/(<!DOCTYPE html[\s\S]*?<\/html>)/gi, "")
    .trim();
}
