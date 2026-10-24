import assert from "node:assert/strict";
import { test } from "node:test";
import { block, continueList, link, linePrefix, readTime, wrap } from "../lib/markdown-edit.ts";

const apply = (value, edit) => value.slice(0, edit.from) + edit.insert + value.slice(edit.to);

test("wrap adds, selects and toggles off", () => {
  const on = wrap("hello world", 6, 11, "**", "**", "bold");
  assert.equal(apply("hello world", on), "hello **world**");
  assert.equal(apply("hello world", on).slice(on.selStart, on.selEnd), "world");
  const off = wrap("hello **world**", 8, 13, "**", "**", "bold");
  assert.equal(apply("hello **world**", off), "hello world");
  assert.equal(apply("", wrap("", 0, 0, "_", "_", "italic")), "_italic_");
  // A selection with surrounding spaces keeps them outside the markers.
  assert.equal(apply("a strong b", wrap("a strong b", 1, 9, "**", "**", "bold")), "a **strong** b");
});

test("link selects the url when text is selected", () => {
  const e = link("see docs", 4, 8);
  const out = apply("see docs", e);
  assert.equal(out, "see [docs](https://)");
  assert.equal(out.slice(e.selStart, e.selEnd), "https://");
});

test("linePrefix toggles and swaps markers across lines", () => {
  const v = "a\nb";
  const num = apply(v, linePrefix(v, 0, 3, (i) => `${i + 1}. `, /^\d+\. /));
  assert.equal(num, "1. a\n2. b");
  assert.equal(apply(num, linePrefix(num, 0, num.length, (i) => `${i + 1}. `, /^\d+\. /)), "a\nb");
  assert.equal(apply("- item", linePrefix("- item", 2, 2, "## ", /^## /)), "## item");
});

test("block pads onto its own paragraph", () => {
  assert.equal(apply("text", block("text", 4, 4, "---")), "text\n\n---");
  assert.equal(apply("", block("", 0, 0, "---")), "---");
});

test("continueList continues, increments and ends lists", () => {
  assert.equal(apply("- a", continueList("- a", 3)), "- a\n- ");
  assert.equal(apply("2. a", continueList("2. a", 4)), "2. a\n3. ");
  assert.equal(apply("- [x] done", continueList("- [x] done", 10)), "- [x] done\n- [ ] ");
  assert.equal(apply("- a\n- ", continueList("- a\n- ", 6)), "- a\n");
  assert.equal(continueList("plain", 5), null);
});

test("readTime rounds up to at least a minute", () => {
  assert.equal(readTime([]), "1 min read");
  assert.equal(readTime(["word ".repeat(1000)]), "5 min read");
});
