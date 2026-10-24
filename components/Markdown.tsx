import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Raw HTML in the source is ignored and unsafe URLs (javascript: etc.) are
// stripped by react-markdown's defaults, so CMS content can't inject script.
const components: Components = {
  h2: ({ node, ...p }) => <h2 className="mt-10 text-2xl font-semibold tracking-tight text-foreground" {...p} />,
  h3: ({ node, ...p }) => <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground" {...p} />,
  h4: ({ node, ...p }) => <h4 className="mt-6 text-lg font-semibold text-foreground" {...p} />,
  p: ({ node, ...p }) => <p className="mt-4" {...p} />,
  a: ({ node, href, ...p }) => {
    const external = href?.startsWith("http");
    return <a href={href} className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground" {...(external && { target: "_blank", rel: "noopener noreferrer" })} {...p} />;
  },
  strong: ({ node, ...p }) => <strong className="font-semibold text-foreground" {...p} />,
  ul: ({ node, ...p }) => <ul className="mt-4 list-disc space-y-1.5 pl-6 marker:text-muted-foreground [&.contains-task-list]:list-none [&.contains-task-list]:pl-1" {...p} />,
  ol: ({ node, ...p }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6 marker:text-muted-foreground" {...p} />,
  blockquote: ({ node, ...p }) => <blockquote className="mt-6 border-l-2 border-foreground/20 pl-4 italic text-muted-foreground" {...p} />,
  hr: () => <hr className="my-8 border-border/60" />,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={typeof src === "string" && src ? src : undefined} alt={alt ?? ""} loading="lazy" className="mt-6 w-full rounded-xl border border-border/40" />,
  pre: ({ node, ...p }) => <pre className="mt-6 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-100" {...p} />,
  code: ({ node, className, ...p }) => className
    ? <code className={className} {...p} />
    : <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit" {...p} />,
  table: ({ node, ...p }) => <div className="mt-6 overflow-x-auto"><table className="w-full border-collapse text-sm" {...p} /></div>,
  th: ({ node, ...p }) => <th className="border-b border-border px-3 py-2 text-left font-semibold text-foreground" {...p} />,
  td: ({ node, ...p }) => <td className="border-b border-border/50 px-3 py-2" {...p} />,
};

export function Markdown({ source }: { source: string }) {
  return (
    <div className="text-base leading-7 text-foreground/85 [&>*:first-child]:mt-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
