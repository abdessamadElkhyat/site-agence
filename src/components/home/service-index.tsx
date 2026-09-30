"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/types/content";

export function ServiceIndex({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const current = services[active] ?? services[0];
  if (!current) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <ol>
        {services.map((service, index) => {
          const selected = index === active;
          return (
            <li key={service.slug} className="border-t border-paper-ink/10">
              <button
                type="button"
                className="flex w-full items-baseline gap-4 py-4 text-start"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-expanded={selected}
              >
                <span className="w-8 text-xs text-paper-muted">0{index + 1}</span>
                <span className={`font-serif text-2xl md:text-4xl ${selected ? "" : "text-paper-ink/45"}`}>{service.name}</span>
              </button>
              {selected ? <p className="pb-5 ps-12 text-sm leading-6 text-paper-muted md:hidden">{service.summary}</p> : null}
            </li>
          );
        })}
      </ol>
      <aside className="sticky top-28 hidden lg:block">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
          <Image src={current.image} alt="" fill className="object-cover" sizes="40vw" />
        </div>
        <p className="mt-4 text-sm leading-6 text-paper-muted">{current.summary}</p>
        <Link href={`/services/${current.slug}`} className="mt-3 inline-block text-sm underline underline-offset-4">
          {current.name}
        </Link>
      </aside>
    </div>
  );
}
