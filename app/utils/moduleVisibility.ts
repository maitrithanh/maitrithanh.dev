export type ModuleRow = { section: string; visible: boolean };

// Turns one page's module rows into isVisible(section) / order(section).
// ponytail: a missing row means "visible", so pages still render before
// the table is seeded.
export function moduleVisibility(rows: ModuleRow[]) {
  const index = new Map(rows.map((m, i) => [m.section, { visible: m.visible, position: i + 1 }]));
  return {
    isVisible: (section: string) => index.get(section)?.visible ?? true,
    order: (section: string, fallback: number) => index.get(section)?.position ?? fallback,
  };
}
