import Navbar from "../components/navbar/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto mt-14 max-w-4xl px-5 pb-20 pt-10 md:mt-16 md:px-6 md:pt-14">
        {children}
      </main>

      <footer className="mb-12 flex justify-center items-center w-full">
        <div className="overflow-hidden  w-full max-w-4xl mx-5 rounded-3xl py-8 flex items-start justify-center select-none pointer-events-none -mb-px">
          <span
            className="block text-[12vw] sm:text-[6vw] font-black uppercase tracking-[0.14em] text-center leading-none text-transparent opacity-40"
            style={{
              WebkitTextStroke: "2px rgba(121, 141, 198, 0.5)",
              backgroundImage:
                "linear-gradient(rgba(121, 141, 198, 0.6) 0%, rgba(121, 141, 198, 0.05) 100%)",
              backgroundClip: "text",
            }}
          >
            MAI TRI THANH
          </span>
        </div>
      </footer>
    </div>
  );
}
