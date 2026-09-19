"use client";

import { useRouter } from "next/navigation";

export function ManageSignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/post/logout", { method: "POST" });
        router.push("/manage/sign-in");
        router.refresh();
      }}
      className="text-xs uppercase tracking-widest opacity-60 underline"
    >
      Sign out
    </button>
  );
}
