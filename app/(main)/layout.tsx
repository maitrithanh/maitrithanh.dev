import Link from "next/link";
import Navbar from "../components/navbar/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-24 md:px-8 md:pt-28">{children}</main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Mai Trí Thành, Ho Chi Minh City</p>
        <ul className="flex gap-5">
          <li><a href="https://github.com/maitrithanh" target="_blank" rel="noopener noreferrer" className="link-sweep hover:text-foreground">GitHub</a></li>
          <li><a href="mailto:maitrithanh06@gmail.com" className="link-sweep hover:text-foreground">Email</a></li>
          <li><Link href="/blog" className="link-sweep hover:text-foreground">Blog</Link></li>
        </ul>
      </footer>
    </div>
  );
}
