'use client'
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import Link from 'next/link';
;
import { LandingFooter } from "@/components/landing/LandingFooter";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error:", pathname);
  }, [pathname]);

  return (
    <>
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background text-center px-4">
        <div
          className="mb-4 text-[6rem] font-bold leading-none tracking-[-0.04em] text-foreground/10"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
        >
          404
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mb-8 max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E05510] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(242,101,34,0.20)]"
        >
          Back to Home
        </Link>
      </main>
      <LandingFooter />
    </>
  );
};

export default NotFound;
