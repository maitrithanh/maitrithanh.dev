"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Briefcase, Code, DocumentText, Element3, FolderOpen, Global, Logout, Setting2, type Icon } from "iconsax-reactjs";

export type AdminTab = "projects" | "blog" | "skills" | "experience" | "modules" | "settings";
const AdminTabContext = createContext<{ tab: AdminTab; setTab: (tab: AdminTab) => void } | null>(null);

export function useAdminTab() {
  const context = useContext(AdminTabContext);
  if (!context) throw new Error("Admin tabs require AdminLayout");
  return context;
}

const tabs: { key: AdminTab; label: string; icon: Icon }[] = [
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "blog", label: "Blog", icon: DocumentText },
  { key: "skills", label: "Skills", icon: Code },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "modules", label: "Modules", icon: Element3 },
  { key: "settings", label: "Settings", icon: Setting2 },
];

// Auth is enforced by proxy.ts before this renders; API calls that come back
// 401 (expired session) send the user back to the login page.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [tab, setTabState] = useState<AdminTab>("projects");
  const router = useRouter();
  const pathname = usePathname();

  // The tab lives in the URL hash so refresh and back/forward keep your place.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (tabs.some((t) => t.key === hash)) setTabState(hash as AdminTab);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (pathname === "/qlmtt/login") return <>{children}</>;

  const setTab = (next: AdminTab) => {
    window.location.hash = next;
    setTabState(next);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/qlmtt/login");
    router.refresh();
  };

  return (
    <AdminTabContext.Provider value={{ tab, setTab }}>
      <div className="min-h-screen bg-muted/30 md:flex">
        <aside className="z-20 border-b border-border/60 bg-card/90 backdrop-blur md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-5">
            <span className="text-sm font-semibold tracking-tight text-foreground">CMS</span>
            <div className="flex items-center gap-1 md:hidden">
              <Link href="/" target="_blank" aria-label="View site" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Global size={18} /></Link>
              <button onClick={handleLogout} aria-label="Logout" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Logout size={18} /></button>
            </div>
          </div>
          <nav aria-label="CMS sections" className="flex gap-1 overflow-x-auto px-3 pb-2 md:flex-col md:px-3 md:pb-0">
            {tabs.map(({ key, label, icon: TabIcon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-current={key === tab ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${key === tab ? "bg-foreground font-medium text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <TabIcon size={16} variant={key === tab ? "Bold" : "Linear"} />
                {label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 hidden w-full space-y-1 border-t border-border/60 p-3 md:block">
            <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Global size={16} />View site</Link>
            <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Logout size={16} />Logout</button>
          </div>
        </aside>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </AdminTabContext.Provider>
  );
}
