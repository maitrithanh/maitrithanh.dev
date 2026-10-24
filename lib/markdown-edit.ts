// Pure text edits behind the CMS markdown toolbar. Each returns the range to
// replace and the selection to restore, so the editor can apply it with
// execCommand and keep native undo.
export type TextEdit = { from: number; to: number; insert: string; selStart: number; selEnd: number };

const LINE_MARKER = /^(#{1,6} |> |[-*+] \[[ x]\] |[-*+] |\d+\. )/;

export function wrap(value: string, s: number, e: number, before: string, after: string, placeholder: string): TextEdit {
  // Markers can't sit next to whitespace ("**word **" renders raw), so shrink
  // the selection past any leading/trailing spaces, e.g. from a double-click.
  while (s < e && /\s/.test(value[s])) s++;
  while (e > s && /\s/.test(value[e - 1])) e--;
  const sel = value.slice(s, e);
  // Already wrapped → unwrap (toggle).
  if (sel && value.slice(s - before.length, s) === before && value.slice(e, e + after.length) === after) {
    const from = s - before.length;
    return { from, to: e + after.length, insert: sel, selStart: from, selEnd: from + sel.length };
  }
  const text = sel || placeholder;
  return { from: s, to: e, insert: before + text + after, selStart: s + before.length, selEnd: s + before.length + text.length };
}

export function link(value: string, s: number, e: number, url = "https://"): TextEdit {
  const sel = value.slice(s, e);
  const text = sel || "link text";
  const insert = `[${text}](${url})`;
  // With text selected, select the URL next; otherwise select the text.
  return sel
    ? { from: s, to: e, insert, selStart: s + text.length + 3, selEnd: s + insert.length - 1 }
    : { from: s, to: e, insert, selStart: s + 1, selEnd: s + 1 + text.length };
}

// Toggle a prefix on every line the selection touches, replacing any other
// line marker (so a bullet can become a heading in one click).
export function linePrefix(value: string, s: number, e: number, prefix: string | ((i: number) => string), match: RegExp): TextEdit {
  const from = value.lastIndexOf("\n", s - 1) + 1;
  const end = value.indexOf("\n", e);
  const to = end === -1 ? value.length : end;
  const lines = value.slice(from, to).split("\n");
  const off = lines.every((l) => match.test(l));
  const insert = lines
    .map((l, i) => (off ? l.replace(match, "") : (typeof prefix === "function" ? prefix(i) : prefix) + l.replace(LINE_MARKER, "")))
    .join("\n");
  return { from, to, insert, selStart: s === e ? from + insert.length : from, selEnd: from + insert.length };
}

// Insert a block on its own paragraph, selecting `select` inside it.
export function block(value: string, s: number, e: number, text: string, select = ""): TextEdit {
  const before = s > 0 && value[s - 1] !== "\n" ? "\n\n" : "";
  const after = e < value.length && value[e] !== "\n" ? "\n\n" : "";
  const insert = before + text + after;
  const at = select ? text.indexOf(select) : text.length;
  return { from: s, to: e, insert, selStart: s + before.length + at, selEnd: s + before.length + at + select.length };
}

// Enter inside a list/quote: continue it, or end it if the item is empty.
export function continueList(value: string, pos: number): TextEdit | null {
  const from = value.lastIndexOf("\n", pos - 1) + 1;
  const m = /^(\s*)([-*+] \[[ x]\] |[-*+] |(\d+)\. |> )(.*)$/.exec(value.slice(from, pos));
  if (!m) return null;
  if (!m[4].trim()) return { from, to: pos, insert: "", selStart: from, selEnd: from };
  const insert = "\n" + m[1] + (m[3] ? `${Number(m[3]) + 1}. ` : m[2].replace("[x]", "[ ]"));
  return { from: pos, to: pos, insert, selStart: pos + insert.length, selEnd: pos + insert.length };
}

export function readTime(content: string[] | undefined) {
  const words = (content ?? []).join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
