"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MANAGE_NAV } from "@/lib/manageNav";
import { ManageSignOutButton } from "./ManageSignOutButton";

export function ManageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 border-b border-detail/30 p-4 sm:w-56 sm:border-b-0 sm:border-r sm:p-6">
        <Link href="/manage" className="mb-6 font-headline text-xl italic">
          MOVEL Manage
        </Link>
        <nav className="flex flex-col gap-0.5">
          {MANAGE_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.status === "live" ? item.href : "#"}
                aria-disabled={item.status !== "live"}
                className={`flex items-center justify-between rounded px-2 py-1.5 text-sm ${
                  active ? "bg-ink text-paper" : item.status === "live" ? "hover:bg-detail/10" : "cursor-default opacity-40"
                }`}
                onClick={(e) => {
                  if (item.status !== "live") e.preventDefault();
                }}
              >
                <span>{item.label}</span>
                {item.status === "soon" && <span className="text-[0.65rem] uppercase tracking-widest">Soon</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6">
          <ManageSignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
