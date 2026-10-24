"use client";
import { useRef } from "react";
import { Code1, Gallery, Grid2, Link1, Minus, QuoteUp, TaskSquare, TextBold, TextItalic, type Icon } from "iconsax-reactjs";
import { block, continueList, link, linePrefix, readTime, wrap, type TextEdit } from "@/lib/markdown-edit";

type Tool = { label: string; icon: Icon | string; keys?: string; run: (v: string, s: number, e: number) => TextEdit };

const tools: (Tool | "|")[] = [
  { label: "Heading 2", icon: "H2", run: (v, s, e) => linePrefix(v, s, e, "## ", /^## /) },
  { label: "Heading 3", icon: "H3", run: (v, s, e) => linePrefix(v, s, e, "### ", /^### /) },
  "|",
  { label: "Bold", icon: TextBold, keys: "B", run: (v, s, e) => wrap(v, s, e, "**", "**", "bold text") },
  { label: "Italic", icon: TextItalic, keys: "I", run: (v, s, e) => wrap(v, s, e, "_", "_", "italic text") },
  { label: "Strikethrough", icon: "S̶", run: (v, s, e) => wrap(v, s, e, "~~", "~~", "text") },
  { label: "Inline code", icon: "</>", keys: "E", run: (v, s, e) => wrap(v, s, e, "`", "`", "code") },
  { label: "Link", icon: Link1, keys: "K", run: (v, s, e) => link(v, s, e) },
  "|",
  { label: "Bulleted list", icon: "•", run: (v, s, e) => linePrefix(v, s, e, "- ", /^[-*+] (?!\[[ x]\] )/) },
  { label: "Numbered list", icon: "1.", run: (v, s, e) => linePrefix(v, s, e, (i) => `${i + 1}. `, /^\d+\. /) },
  { label: "Checklist", icon: TaskSquare, run: (v, s, e) => linePrefix(v, s, e, "- [ ] ", /^[-*+] \[[ x]\] /) },
  { label: "Quote", icon: QuoteUp, run: (v, s, e) => linePrefix(v, s, e, "> ", /^> /) },
  "|",
  { label: "Code block", icon: Code1, run: (v, s, e) => block(v, s, e, "```ts\n" + (v.slice(s, e) || "code") + "\n```", v.slice(s, e) || "code") },
  { label: "Image", icon: Gallery, run: (v, s, e) => wrap(v, s, e, "![", "](/image.webp)", "alt text") },
  { label: "Table", icon: Grid2, run: (v, s, e) => block(v, s, e, "| Column | Column |\n| --- | --- |\n| Cell | Cell |", "Column") },
  { label: "Divider", icon: Minus, run: (v, s, e) => block(v, s, e, "---") },
];

const shortcuts = Object.fromEntries(tools.flatMap((t) => (t !== "|" && t.keys ? [[t.keys.toLowerCase(), t]] : [])));

export function MarkdownEditor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // execCommand keeps the browser's undo stack; fall back to a plain set.
  const apply = (edit: TextEdit | null) => {
    const ta = ref.current;
    if (!ta || !edit) return;
    ta.focus();
    ta.setSelectionRange(edit.from, edit.to);
    if (!document.execCommand("insertText", false, edit.insert)) {
      onChange(ta.value.slice(0, edit.from) + edit.insert + ta.value.slice(edit.to));
    }
    requestAnimationFrame(() => ta.setSelectionRange(edit.selStart, edit.selEnd));
  };
  const run = (tool: Tool) => {
    const ta = ref.current!;
    apply(tool.run(ta.value, ta.selectionStart, ta.selectionEnd));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const tool = (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && shortcuts[e.key.toLowerCase()];
    if (tool) {
      e.preventDefault();
      run(tool);
    } else if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && ta.selectionStart === ta.selectionEnd) {
      const edit = continueList(ta.value, ta.selectionStart);
      if (edit) {
        e.preventDefault();
        apply(edit);
      }
    }
  };

  // Pasting a URL over selected text turns it into a link.
  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const url = e.clipboardData.getData("text/plain").trim();
    if (ta.selectionStart !== ta.selectionEnd && /^https?:\/\/\S+$/.test(url)) {
      e.preventDefault();
      const edit = link(ta.value, ta.selectionStart, ta.selectionEnd, url);
      apply({ ...edit, selStart: edit.from + edit.insert.length, selEnd: edit.from + edit.insert.length });
    }
  };

  const words = value.split(/\s+/).filter(Boolean).length;
  const mod = typeof navigator !== "undefined" && /Mac|iP/.test(navigator.platform) ? "⌘" : "Ctrl+";

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-foreground/10">
      <div role="toolbar" aria-label={`${label} formatting`} className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/40 px-1.5 py-1">
        {tools.map((t, i) => t === "|" ? (
          <span key={i} aria-hidden className="mx-1 h-4 w-px bg-border" />
        ) : (
          <button
            key={t.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // keep the textarea selection
            onClick={() => run(t)}
            title={t.keys ? `${t.label} (${mod}${t.keys})` : t.label}
            aria-label={t.label}
            className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {typeof t.icon === "string" ? t.icon : <t.icon size={16} />}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        spellCheck
        placeholder={"Start writing...\n\n## A heading\nParagraphs, **bold**, _italic_, [links](https://), lists, `code`, tables and images all work."}
        className="block min-h-[28rem] w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none [field-sizing:content]"
      />
      <div className="flex items-center justify-between border-t border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground">
        <span>Markdown · {words} words · {readTime([value])}</span>
        <span className="hidden sm:inline">{mod}B bold · {mod}I italic · {mod}K link · paste URL on text to link</span>
      </div>
    </div>
  );
}
