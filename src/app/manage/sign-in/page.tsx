"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageSignInPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/post/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (data.role !== "owner") {
        setError("This passcode only has posting access. Use your owner passcode to manage the site.");
        setBusy(false);
        return;
      }
      router.push("/manage");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-headline text-3xl italic">MOVEL Manage</h1>
      <p className="max-w-xs opacity-70">Enter your owner passcode to edit the site.</p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="rounded border border-detail/40 bg-transparent px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy || !passcode}
          className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
        >
          {busy ? "Checking…" : "Continue"}
        </button>
      </form>
      {error && <p className="max-w-xs text-sm text-accent">{error}</p>}
    </div>
  );
}
