import { signIn } from "@/auth";

export default function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-headline text-3xl italic">MOVEL Quick Post</h1>
      <p className="max-w-xs opacity-70">Sign in with the Google account Mo uses for this site.</p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/post" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper"
        >
          Continue with Google
        </button>
      </form>
      <SearchParamsError searchParams={searchParams} />
    </div>
  );
}

async function SearchParamsError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p className="max-w-xs text-sm text-accent">
      That Google account doesn&rsquo;t have access to Quick Post yet. Ask Mo to add it in the admin under Site
      Settings → Assistant access.
    </p>
  );
}
