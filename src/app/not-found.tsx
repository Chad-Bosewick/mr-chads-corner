import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell className="py-24 text-center">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5]">
        Page not found
      </h1>
      <p className="mt-4 text-[var(--color-text-muted)]">
        This page doesn&rsquo;t exist yet, or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[#A43718] underline underline-offset-4 transition-colors hover:text-[#151515]"
      >
        Go back home
      </Link>
    </PageShell>
  );
}
