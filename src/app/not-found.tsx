import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-24 text-center">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5]">
        Page not found
      </h1>
      <p className="mt-4 text-[#757575]">
        This page doesn&rsquo;t exist yet &mdash; or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[#A43718] underline underline-offset-4 transition-colors hover:text-[#151515]"
      >
        Go back home
      </Link>
    </div>
  );
}
