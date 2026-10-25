type Item = { company: string; role: string; period: string; location: string; highlights: string[] };

// Roles newest first; the first one is the current job and gets the marigold dot.
export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="relative space-y-12 border-l pl-8">
      {items.map((item, i) => (
        <li key={`${item.company}-${item.period}`} className="relative">
          <span aria-hidden className={`absolute -left-[37px] top-1.5 size-2.5 rounded-full ring-4 ring-background ${i === 0 ? "bg-marigold" : "bg-border"}`} />
          <p className="text-sm tabular-nums text-muted-foreground">{item.period}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">{item.role}</h3>
          <p className="mt-0.5 text-muted-foreground">
            <span className="font-medium text-foreground">{item.company}</span>, {item.location}
          </p>
          {item.highlights.length > 0 && (
            <ul className="mt-4 max-w-2xl space-y-2">
              {item.highlights.map((h) => (
                <li key={h} className="flex gap-3 leading-7 text-muted-foreground">
                  <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-muted-foreground/50" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
