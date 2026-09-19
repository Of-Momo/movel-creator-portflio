import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 pt-16 text-center">
      <p className="font-headline text-4xl italic sm:text-5xl">This page is out of print.</p>
      <p className="max-w-md opacity-75">
        Whatever you were looking for isn&rsquo;t in this issue. The good stuff is this way.
      </p>
      <Link href="/work" className="mt-4 rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper">
        Back to the work
      </Link>
    </div>
  );
}
