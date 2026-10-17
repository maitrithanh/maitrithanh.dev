// Supabase rows are snake_case; the UI is camelCase. One mapper per table so
// the API routes, server reads, seed script and client pages all agree.
// Client-safe: no server-only imports, so pages can import these too.

export const toProject = (p: any) => ({
  name: p.name,
  date: p.date,
  description: p.description || "",
  image: p.image,
  preview: p.preview,
  linkSource: p.link_source,
  tag: p.tags || [],
});

export const toBlogPost = (p: any) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  summary: p.summary,
  publishedAt: p.published_at,
  readTime: p.read_time,
  cover: p.cover,
  content: p.content || [],
});

export const toSkill = (s: any) => ({ name: s.name, link: s.link, image: s.image });

export const toExperience = (e: any) => ({
  company: e.company,
  role: e.role,
  period: e.period,
  location: e.location,
  highlights: e.highlights || [],
});

export const projectRow = (p: any) => ({
  name: p.name,
  date: p.date,
  description: p.description || "",
  image: p.image,
  preview: p.preview,
  link_source: p.linkSource,
  tags: p.tag || [],
});

export const blogPostRow = (p: any) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  summary: p.summary,
  published_at: p.publishedAt,
  read_time: p.readTime,
  cover: p.cover,
  content: p.content || [],
});
