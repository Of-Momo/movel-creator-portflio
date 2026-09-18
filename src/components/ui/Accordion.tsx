"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Faq } from "@/lib/types";

export function Accordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="divide-y divide-detail/30 border-y border-detail/30">
      {items.map((item) => {
        const open = openId === item._id;
        return (
          <div key={item._id}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item._id)}
            >
              <span className="font-headline text-lg italic sm:text-xl">{item.question}</span>
              <CaretDown
                size={18}
                className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ${
                open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 text-sm leading-relaxed opacity-90">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
