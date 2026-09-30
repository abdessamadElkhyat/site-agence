"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/article-html";

export function ArticleToc({ items, label }: { items: TocItem[]; label: string }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label={label}>
      <p className="text-[11px] tracking-[0.2em] text-paper-muted uppercase">{label}</p>
      <ul className="mt-4 space-y-2.5 border-s border-paper-ink/10 ps-3">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ps-3" : undefined}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm leading-snug transition",
                activeId === item.id ? "text-paper-ink" : "text-paper-muted hover:text-paper-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
