import "./globals.css";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "./providers";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

// Display face for headings; Be Vietnam Pro (a Vietnamese-designed family)
// for body text so names like "Mai Trí Thành" set their diacritics properly.
const display = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
});
const sans = Be_Vietnam_Pro({
  weight: ["400", "500", "600"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata = {
  ...createMetadata({ path: "/" }),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  keywords: SITE_KEYWORDS,
  authors: { name: SITE_NAME },
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint so the saved theme never flashes the other one. */}
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}` }} />
      </head>
      <body className={`${display.variable} ${sans.variable} font-sans`}>
        <Providers>{children}</Providers>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: SITE_NAME,
          url: SITE_URL,
          image: `${SITE_URL}/Thanh2.jpg`,
          jobTitle: "Fullstack Developer",
          description: SITE_DESCRIPTION,
          sameAs: ["https://github.com/maitrithanh"],
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }} />
      </body>
    </html>
  );
}
