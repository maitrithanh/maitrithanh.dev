"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Add, ArrowDown2, ArrowUp2, Edit2, SearchNormal1, Trash } from "iconsax-reactjs";
import { useAdminTab } from "../layout";
import { moveItem } from "@/lib/sort";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { readTime } from "@/lib/markdown-edit";
import { BlogPostView } from "@/components/BlogPostView";
import { MarkdownEditor } from "./MarkdownEditor";

// Admin CMS. One screen with tabs (Projects, Blog, Skills, Experience,
// Modules, Settings). Each tab is a "manager": it lists rows, lets you
// add/edit via a form, and calls the matching /api/<resource> endpoint.
// The shared helpers below do the actual HTTP work.

export default function AdminDashboard() {
  const { tab } = useAdminTab();

  return (
    <>
      {tab === "projects" && (
        <CrudManager key="projects" resource="projects" title="Project" listField="name" subField="date" thumbField="image"
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "date", label: "Date", required: true, placeholder: "2025" },
            { key: "description", label: "Description", as: "textarea" },
            { key: "image", label: "Image path", required: true, preview: true, placeholder: "/project.webp" },
            { key: "preview", label: "Preview URL", required: true, type: "url" },
            { key: "link_source", label: "Source URL", required: true, type: "url" },
          ]}
        />
      )}
      {tab === "blog" && (
        <CrudManager key="blog" resource="blog" title="Post" listField="title" subField="category" thumbField="cover"
          markdown={{ key: "content", label: "Content" }}
          preview={{ render: (f) => <BlogPostView preview post={toBlogPost(f)} />, href: (p) => `/blog/${p.slug}` }}
          fields={[
            { key: "title", label: "Title", required: true, wide: true },
            { key: "slug", label: "Slug", required: true, derive: { from: "title", fn: (v) => slugify(v ?? ""), newOnly: true }, pattern: "[a-z0-9-]+" },
            { key: "category", label: "Category", required: true },
            { key: "published_at", label: "Published at", type: "date", required: true },
            { key: "read_time", label: "Read time", required: true, placeholder: "5 min read", derive: { from: "content", fn: readTime } },
            { key: "summary", label: "Summary", as: "textarea", required: true },
            { key: "cover", label: "Cover image", required: true, preview: true, placeholder: "/cover.webp" },
          ]}
        />
      )}
      {tab === "skills" && (
        <CrudManager key="skills" resource="skills" title="Skill" listField="name" subField="link" thumbField="image"
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "link", label: "Link", required: true, type: "url" },
            { key: "image", label: "Image URL", required: true, preview: true },
          ]}
        />
      )}
      {tab === "experience" && (
        <CrudManager key="experiences" resource="experiences" title="Experience" listField="role" subField="company"
          lines={{ key: "highlights", label: "Highlights", addLabel: "Add highlight" }}
          fields={[
            { key: "company", label: "Company", required: true },
            { key: "role", label: "Role", required: true },
            { key: "period", label: "Period", required: true, placeholder: "2023 – Present" },
            { key: "location", label: "Location", required: true },
          ]}
        />
      )}
      {tab === "modules" && <ModulesManager />}
      {tab === "settings" && <SettingsManager />}
      <Toaster />
    </>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────
// Every manager talks to the same kind of REST endpoint. Keeping that
// fetch plumbing here means each manager only says WHAT it saves.

async function api(url: string, method = "GET", body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) {
    window.location.href = "/qlmtt/login";
    throw new Error("Session expired");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const saveRecord = (resource: string, id: string | undefined, body: unknown) =>
  api(id ? `/api/${resource}/${id}` : `/api/${resource}`, id ? "PUT" : "POST", body);
const saveOrder = (resource: string, ids: string[]) => api("/api/sort", "POST", { resource, ids });

// DB row (snake_case) → the shape the public blog page renders.
const toBlogPost = (f: any) => ({
  slug: f.slug ?? "", title: f.title || "Untitled post", category: f.category ?? "", summary: f.summary ?? "",
  publishedAt: f.published_at ?? "", readTime: f.read_time ?? "", cover: f.cover ?? "", content: f.content ?? [],
});

const errorText = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Ctrl/Cmd+S saves, Esc cancels, while the handler is mounted.
function useEditorKeys(onSave: () => void, onCancel?: () => void) {
  const handlers = useRef({ onSave, onCancel });
  handlers.current = { onSave, onCancel };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handlers.current.onSave();
      } else if (e.key === "Escape" && !(e.target as HTMLElement).closest?.("input, textarea")) handlers.current.onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

// Warn before closing the tab with unsaved edits.
function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

// ponytail: module-level toast channel, one <Toaster/> per page
let pushToast: (text: string, error?: boolean) => void = () => {};
const toast = (text: string) => pushToast(text);
const toastError = (e: unknown) => pushToast(errorText(e), true);

function Toaster() {
  const [toasts, setToasts] = useState<{ id: number; text: string; error?: boolean }[]>([]);
  useEffect(() => {
    pushToast = (text, error) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, text, error }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), error ? 5000 : 2500);
    };
    return () => { pushToast = () => {}; };
  }, []);
  return (
    <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div key={t.id} role={t.error ? "alert" : "status"} className={`rounded-full px-4 py-2 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2 ${t.error ? "bg-red-500 text-white" : "bg-foreground text-background"}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

// Shared styling so every panel/button looks the same without repeating classes.
const cardCls = "rounded-2xl border border-border/60 bg-card shadow-sm";
const primaryBtn = "inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50";
const ghostBtn = "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3.5 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50";
const iconBtn = "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30";
const inputCls = "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10";
const kbd = "rounded border border-border/60 bg-muted px-1 font-mono text-[10px]";

function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function ListSkeleton({ rows = 5, thumb }: { rows?: number; thumb?: boolean }) {
  return (
    <div role="status" className={`${cardCls} divide-y divide-border/40`}>
      <span className="sr-only">Loading...</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          {thumb && <Skeleton className="h-10 w-10 rounded-lg" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-7 w-16" />
        </div>
      ))}
    </div>
  );
}

// ─── Manager Components ───────────────────────────────────────────

// One manager drives Projects, Skills, Blog and Experience. Each is just a
// config: which API resource, which fields, and (optionally) a list-of-lines
// editor like a post's paragraphs or an experience's highlights.
type FieldDef = {
  key: string;
  label: string;
  required?: boolean;
  as?: "textarea";
  type?: string;
  placeholder?: string;
  pattern?: string;
  wide?: boolean; // span both columns
  preview?: boolean; // show an image preview of the value
  derive?: { from: string; fn: (v: any) => string; newOnly?: boolean }; // auto-fill until edited by hand
};
type LinesDef = { key: string; label: string; addLabel: string };
type MarkdownDef = { key: string; label: string };

function CrudManager({
  resource, title, listField, subField, thumbField, fields, lines, markdown, preview,
}: {
  resource: string;
  title: string; // singular, e.g. "Post"
  listField: string;
  subField?: string;
  thumbField?: string;
  fields: FieldDef[];
  lines?: LinesDef;
  markdown?: MarkdownDef;
  preview?: PreviewDef;
}) {
  const [items, setItems] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState(false);
  const draggedId = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await api(`/api/${resource}`));
    } catch (e) {
      toastError(e);
      setItems([]);
    }
  }, [resource]);
  useEffect(() => { load(); }, [load]);

  const remove = async (item: any) => {
    if (!confirm(`Delete "${item[listField]}"? This cannot be undone.`)) return;
    try {
      await api(`/api/${resource}/${item.id}`, "DELETE");
      setItems((prev) => prev?.filter((x) => x.id !== item.id) ?? null);
      toast(`${title} deleted`);
    } catch (e) {
      toastError(e);
    }
  };

  const reorder = async (sourceId: string, targetId: string) => {
    if (sorting || !items) return;
    const next = moveItem(items, sourceId, targetId);
    if (next === items) return;
    setItems(next);
    setSorting(true);
    try {
      await saveOrder(resource, next.map((item) => item.id));
    } catch (e) {
      setItems(items);
      toastError(e);
    } finally {
      setSorting(false);
    }
  };

  if (editing) {
    return (
      <RecordEditor
        resource={resource} title={title} fields={fields} lines={lines} markdown={markdown} preview={preview} item={editing}
        onClose={(saved) => { setEditing(null); if (saved) load(); }}
      />
    );
  }

  const plural = title === "Experience" ? title : `${title}s`;
  const q = query.trim().toLowerCase();
  const visible = q ? items?.filter((item) => fields.some((f) => String(item[f.key] ?? "").toLowerCase().includes(q))) : items;
  const canSort = !q && !!items && items.length > 1;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={plural} subtitle={items ? `${items.length} total${canSort ? " · drag to reorder" : ""}` : undefined}>
        <button onClick={() => setEditing({})} className={primaryBtn}><Add size={16} />New {title.toLowerCase()}</button>
      </PageHeader>

      {items && items.length > 5 && (
        <label className="relative mb-3 block">
          <SearchNormal1 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${plural.toLowerCase()}...`} className={`${inputCls} pl-9`} />
        </label>
      )}

      {!visible ? <ListSkeleton thumb={!!thumbField} /> : visible.length === 0 ? (
        <div className={`${cardCls} px-6 py-14 text-center`}>
          <p className="text-sm text-muted-foreground">{q ? "No matches." : `No ${plural.toLowerCase()} yet.`}</p>
          {!q && <button onClick={() => setEditing({})} className={`${ghostBtn} mt-4`}><Add size={16} />Create the first one</button>}
        </div>
      ) : (
        <ul className={`${cardCls} divide-y divide-border/40 overflow-hidden`}>
          {visible.map((item, index) => (
            <li
              key={item.id}
              onDragOver={(e) => canSort && e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (draggedId.current) reorder(draggedId.current, item.id); draggedId.current = null; }}
              className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40 sm:px-4"
            >
              {canSort && (
                <span draggable={!sorting} onDragStart={(e) => { draggedId.current = item.id; e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { draggedId.current = null; }} aria-hidden className="hidden cursor-grab select-none text-muted-foreground/50 hover:text-foreground active:cursor-grabbing sm:block">⠿</span>
              )}
              {thumbField && <Thumb src={item[thumbField]} />}
              <button onClick={() => setEditing(item)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-foreground">{item[listField]}</p>
                {subField && <p className="truncate text-xs text-muted-foreground">{item[subField]}</p>}
              </button>
              <div className="flex items-center gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                {canSort && <>
                  <button type="button" onClick={() => reorder(item.id, items![index - 1].id)} disabled={sorting || index === 0} aria-label={`Move ${item[listField]} up`} className={iconBtn}><ArrowUp2 size={16} /></button>
                  <button type="button" onClick={() => reorder(item.id, items![index + 1].id)} disabled={sorting || index === items!.length - 1} aria-label={`Move ${item[listField]} down`} className={iconBtn}><ArrowDown2 size={16} /></button>
                </>}
                <button onClick={() => setEditing(item)} aria-label={`Edit ${item[listField]}`} className={iconBtn}><Edit2 size={16} /></button>
                <button onClick={() => remove(item)} aria-label={`Delete ${item[listField]}`} className={cn(iconBtn, "hover:bg-red-500/10 hover:text-red-500")}><Trash size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Thumb({ src }: { src?: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" onError={() => setBroken(true)} className="h-10 w-10 shrink-0 rounded-lg border border-border/40 object-cover" />;
}

type PreviewDef = { render: (form: any) => React.ReactNode; href?: (item: any) => string };

function RecordEditor({ resource, title, fields, lines, markdown, preview, item, onClose }: {
  resource: string;
  title: string;
  fields: FieldDef[];
  lines?: LinesDef;
  markdown?: MarkdownDef;
  preview?: PreviewDef;
  item: any;
  onClose: (saved: boolean) => void;
}) {
  const [form, setForm] = useState<any>(item);
  const [lineValues, setLineValues] = useState<string[]>(lines && item[lines.key]?.length ? item[lines.key] : [""]);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"edit" | "split" | "preview">("split");
  const [initial] = useState(() => JSON.stringify([item, lineValues]));
  const formRef = useRef<HTMLFormElement>(null);
  const dirty = JSON.stringify([form, lineValues]) !== initial;
  useUnsavedWarning(dirty);

  const cancel = () => {
    if (!dirty || confirm("Discard unsaved changes?")) onClose(false);
  };
  useEditorKeys(() => formRef.current?.requestSubmit(), cancel);

  const setField = (key: string, value: unknown) => {
    setForm((prev: any) => {
      const next = { ...prev, [key]: value };
      // Keep derived fields (slug, read time) in sync until edited by hand.
      for (const f of fields) {
        const d = f.derive;
        if (d?.from === key && !(d.newOnly && item.id) && (!prev[f.key] || prev[f.key] === d.fn(prev[key]))) next[f.key] = d.fn(value);
      }
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    // Drop DB-owned fields; attach the line editor's values if present.
    const { id, created_at, updated_at, ...body } = form;
    if (lines) body[lines.key] = lineValues.map((v) => v.trim()).filter(Boolean);
    if (markdown) body[markdown.key] = (body[markdown.key] ?? []).filter((v: string) => v.trim());
    try {
      await saveRecord(resource, item.id, body);
      toast(`${title} saved`);
      onClose(true);
    } catch (e) {
      toastError(e);
      setSaving(false);
    }
  };

  // Below lg there is no room for split view, so "split" shows the editor.
  const views = [["edit", "Write", "max-lg:[&[data-split]]:bg-foreground max-lg:[&[data-split]]:text-background"], ["split", "Split", "hidden lg:block"], ["preview", "Preview", ""]] as const;
  const href = preview?.href && item.id ? preview.href(item) : undefined;

  return (
    <form ref={formRef} onSubmit={save}>
      <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/80 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="min-w-0">
          <button type="button" onClick={cancel} className="text-xs text-muted-foreground hover:text-foreground">← Back</button>
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {item.id ? `Edit ${title.toLowerCase()}` : `New ${title.toLowerCase()}`}
            {dirty && <span className="ml-2 align-middle text-xs font-normal text-amber-500">● Unsaved</span>}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {preview && (
            <div role="tablist" aria-label="Editor view" className="flex rounded-lg border border-border/60 bg-card p-0.5">
              {views.map(([key, label, cls]) => (
                <button key={key} type="button" role="tab" aria-selected={view === key} data-split={key === "edit" && view === "split" ? "" : undefined} onClick={() => setView(key)}
                  className={cn("rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", cls, view === key && "bg-foreground text-background hover:text-background")}>
                  {label}
                </button>
              ))}
            </div>
          )}
          <span className="hidden text-xs text-muted-foreground xl:inline"><kbd className={kbd}>⌘S</kbd> save</span>
          <button type="button" onClick={cancel} className={ghostBtn}>Cancel</button>
          <button type="submit" disabled={saving || (!dirty && !!item.id)} className={primaryBtn}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>

      <div className={preview && view === "split" ? "lg:grid lg:grid-cols-2 lg:items-start lg:gap-6" : "mx-auto max-w-4xl"}>
        <div className={cn("space-y-4", preview && view === "preview" && "hidden")}>
          <div className={`${cardCls} grid gap-x-4 gap-y-5 p-5 sm:grid-cols-2 sm:p-6`}>
            {fields.map((f) => (
              <Field key={f.key} def={f} value={form[f.key] ?? ""} onChange={(v) => setField(f.key, v)} autoFocus={f === fields[0] && !item.id} />
            ))}
          </div>

          {markdown && (
            <MarkdownEditor label={markdown.label} value={(form[markdown.key] ?? []).join("\n\n")} onChange={(v) => setField(markdown.key, [v])} />
          )}

          {lines && (
            <div className={`${cardCls} p-5 sm:p-6`}>
              <LineEditor def={lines} values={lineValues} setValues={setLineValues} />
            </div>
          )}
        </div>

        {preview && (
          <aside aria-label="Live preview" className={cn(
            "rounded-2xl border border-dashed border-border bg-background p-3 sm:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto",
            view === "edit" && "hidden", view === "split" && "hidden lg:block",
          )}>
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live preview</span>
              {href && <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Open published ↗</a>}
            </div>
            <div className="mx-auto max-w-3xl">{preview.render(form)}</div>
          </aside>
        )}
      </div>
    </form>
  );
}

function ModulesManager() {
  const [modules, setModules] = useState<any[] | null>(null);
  const [draft, setDraft] = useState({ page: "", section: "", label: "" });
  const [saving, setSaving] = useState(false);
  const [sorting, setSorting] = useState(false);
  const draggedId = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      setModules(await api("/api/page-modules"));
    } catch (e) {
      toastError(e);
      setModules([]);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  // Flip a section's visibility and persist it right away.
  const toggle = async (m: any, visible: boolean) => {
    setModules((prev) => prev?.map((x) => (x.id === m.id ? { ...x, visible } : x)) ?? null);
    try {
      await saveRecord("page-modules", m.id, { visible });
    } catch (e) {
      toastError(e);
      load(); // revert on failure
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord("page-modules", undefined, { ...draft, visible: true });
      setDraft({ page: "", section: "", label: "" });
      toast("Module added");
      load();
    } catch (e) {
      toastError(e);
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (sourceId: string, targetId: string) => {
    if (!modules || sorting || modules.find((m) => m.id === sourceId)?.page !== modules.find((m) => m.id === targetId)?.page) return;
    const next = moveItem(modules, sourceId, targetId);
    if (next === modules) return;
    setModules(next);
    setSorting(true);
    try {
      await saveOrder("page-modules", next.map((m) => m.id));
    } catch (e) {
      setModules(modules);
      toastError(e);
    } finally {
      setSorting(false);
    }
  };

  // Group rows by page so each page's toggles sit together.
  const byPage: Record<string, any[]> = (modules ?? []).reduce((acc, m) => {
    (acc[m.page] ||= []).push(m);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Modules" subtitle="Show, hide and reorder sections on each page." />
      {!modules ? <ListSkeleton rows={6} /> : (
        <div className="space-y-4">
          {Object.entries(byPage).map(([page, rows]) => (
            <section key={page} className={cardCls}>
              <h2 className="border-b border-border/40 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{page}</h2>
              <ul className="divide-y divide-border/40">
                {rows.map((m, index) => (
                  <li key={m.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (draggedId.current) reorder(draggedId.current, m.id); draggedId.current = null; }} className="group flex items-center gap-3 px-4 py-2.5">
                    <span draggable={!sorting} onDragStart={(e) => { draggedId.current = m.id; e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { draggedId.current = null; }} aria-hidden className="hidden cursor-grab select-none text-muted-foreground/50 hover:text-foreground active:cursor-grabbing sm:block">⠿</span>
                    <span className={`flex-1 text-sm ${m.visible ? "text-foreground" : "text-muted-foreground line-through"}`}>{m.label}</span>
                    <button type="button" onClick={() => reorder(m.id, rows[index - 1].id)} disabled={sorting || index === 0} aria-label={`Move ${m.label} up`} className={iconBtn}><ArrowUp2 size={16} /></button>
                    <button type="button" onClick={() => reorder(m.id, rows[index + 1].id)} disabled={sorting || index === rows.length - 1} aria-label={`Move ${m.label} down`} className={iconBtn}><ArrowDown2 size={16} /></button>
                    <Switch checked={m.visible} onChange={(v) => toggle(m, v)} label={`Show ${m.label}`} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <form onSubmit={add} className={`${cardCls} p-4`}>
            <h2 className="mb-3 text-sm font-medium text-foreground">Add module</h2>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <input required pattern="[A-Za-z0-9_\-]{1,50}" placeholder="Page (e.g. home)" value={draft.page} onChange={(e) => setDraft({ ...draft, page: e.target.value })} className={inputCls} />
              <input required pattern="[A-Za-z0-9_\-]{1,50}" placeholder="Section key" value={draft.section} onChange={(e) => setDraft({ ...draft, section: e.target.value })} className={inputCls} />
              <input required maxLength={100} placeholder="Label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className={inputCls} />
              <button disabled={saving} className={primaryBtn}><Add size={16} />{saving ? "Adding..." : "Add"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-foreground" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

const settingGroups: { title: string; fields: FieldDef[] }[] = [
  { title: "Hero", fields: [
    { key: "hero_badge", label: "Badge" },
    { key: "hero_subtitle", label: "Subtitle" },
  ] },
  { title: "About", fields: [
    { key: "about_me", label: "Paragraph 1", as: "textarea" },
    { key: "about_focus", label: "Paragraph 2", as: "textarea" },
  ] },
  { title: "Call to action", fields: [
    { key: "cta_title", label: "Title" },
    { key: "cta_subtitle", label: "Subtitle" },
  ] },
  { title: "Contact", fields: [
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "location", label: "Location", wide: true },
  ] },
];

function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [initial, setInitial] = useState("");
  const [saving, setSaving] = useState(false);
  const dirty = !!settings && JSON.stringify(settings) !== initial;
  useUnsavedWarning(dirty);

  useEffect(() => {
    api("/api/settings")
      .then((data) => { setSettings(data); setInitial(JSON.stringify(data)); })
      .catch((e) => { toastError(e); setSettings({}); });
  }, []);

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!settings || saving || !dirty) return;
    setSaving(true);
    try {
      await api("/api/settings", "PUT", settings);
      setInitial(JSON.stringify(settings));
      toast("Settings saved");
    } catch (e) {
      toastError(e);
    } finally {
      setSaving(false);
    }
  };
  useEditorKeys(() => save());

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl">
      <PageHeader title="Settings" subtitle="Site-wide copy and contact details.">
        {dirty && <span className="text-xs text-amber-500">● Unsaved</span>}
        <button type="submit" disabled={saving || !dirty} className={primaryBtn}>{saving ? "Saving..." : "Save changes"}</button>
      </PageHeader>
      {!settings ? <ListSkeleton rows={4} /> : (
        <div className="space-y-4">
          {settingGroups.map((group) => (
            <section key={group.title} className={`${cardCls} p-5 sm:p-6`}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h2>
              <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                {group.fields.map((f) => (
                  <Field key={f.key} def={f} value={settings[f.key] ?? ""} onChange={(v) => setSettings({ ...settings, [f.key]: v })} />
                ))}
              </div>
            </section>
          ))}
          <SeedPanel />
        </div>
      )}
    </form>
  );
}

function SeedPanel() {
  const [loading, setLoading] = useState(false);

  const seed = async () => {
    if (!confirm("Seed static data into empty tables?")) return;
    setLoading(true);
    try {
      const data = await api("/api/seed", "POST");
      const parts = Object.entries(data.seeded || {}).map(([k, v]) => `${k}: ${v}`);
      toast(parts.length ? `Seeded — ${parts.join(", ")}` : "Nothing to seed (tables not empty)");
    } catch (e) {
      toastError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${cardCls} flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6`}>
      <div>
        <h2 className="text-sm font-medium text-foreground">Seed data</h2>
        <p className="text-xs text-muted-foreground">Fill empty tables with the bundled static content.</p>
      </div>
      <button type="button" onClick={seed} disabled={loading} className={ghostBtn}>{loading ? "Seeding..." : "Seed data"}</button>
    </section>
  );
}

// ─── Shared Components ───────────────────────────────────────────

function Field({ def, value, onChange, autoFocus }: {
  def: FieldDef;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const wide = def.wide || def.as === "textarea";
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {def.label} {def.required && <span className="text-red-400">*</span>}
      </span>
      {def.as === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={def.required} placeholder={def.placeholder} rows={3} className={`${inputCls} min-h-20 resize-y [field-sizing:content]`} />
      ) : (
        <div className="flex items-center gap-2">
          {def.preview && <Thumb key={value} src={value} />}
          <input
            type={def.type || "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={def.required}
            placeholder={def.placeholder}
            pattern={def.pattern}
            autoFocus={autoFocus}
            className={inputCls}
          />
        </div>
      )}
    </label>
  );
}

// Edits a string[] as a list of lines with add/remove/reorder (an
// experience's highlights). Enter adds a new row below.
function LineEditor({ def, values, setValues }: {
  def: LinesDef;
  values: string[];
  setValues: (v: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusAt = useRef<number | null>(null);
  useEffect(() => {
    if (focusAt.current !== null) refs.current[focusAt.current]?.focus();
    focusAt.current = null;
  });

  const set = (i: number, v: string) => setValues(values.map((x, j) => (j === i ? v : x)));
  const insertAfter = (i: number) => {
    focusAt.current = i + 1;
    setValues([...values.slice(0, i + 1), "", ...values.slice(i + 1)]);
  };
  const move = (i: number, d: number) => {
    const n = [...values];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    setValues(n);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{def.label} <span className="text-muted-foreground/60">({values.filter((v) => v.trim()).length})</span></span>
      </div>
      <ol className="space-y-2">
        {values.map((line, i) => (
          <li key={i} className="group flex items-start gap-2">
            <span className="mt-2 w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground/60">{i + 1}</span>
            <input
              ref={(el) => { refs.current[i] = el; }}
              value={line}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertAfter(i); } }}
              placeholder="Write a highlight..."
              className={inputCls}
            />
            <div className="flex shrink-0 flex-col sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className={iconBtn}><ArrowUp2 size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === values.length - 1} aria-label="Move down" className={iconBtn}><ArrowDown2 size={14} /></button>
            </div>
            <button type="button" onClick={() => setValues(values.length > 1 ? values.filter((_, j) => j !== i) : [""])} aria-label="Remove" className={cn(iconBtn, "mt-1 hover:bg-red-500/10 hover:text-red-500")}><Trash size={14} /></button>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => insertAfter(values.length - 1)} className={`${ghostBtn} mt-3 ml-7`}><Add size={16} />{def.addLabel}</button>
    </div>
  );
}
