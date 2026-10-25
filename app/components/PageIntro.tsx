// Big condensed page title with a short intro, shared by the list pages.
export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <header className="pb-12 pt-6 md:pb-16 md:pt-10">
      <h1 className="text-[clamp(3.5rem,11vw,8rem)] font-bold leading-[0.85] tracking-[-0.04em] [font-stretch:78%]">{title}</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{children}</p>
    </header>
  );
}
