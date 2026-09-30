"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";

export type RelatedCard = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
};

export function RelatedSlider({
  items,
  locale,
  label,
  title,
  readingLabel,
}: {
  items: RelatedCard[];
  locale: string;
  label: string;
  title: string;
  readingLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.min(360, node.clientWidth * 0.8), behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <section className="border-t border-paper-ink/10 bg-[#ebe6dc] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-paper-muted uppercase">{label}</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">{title}</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-paper-ink/15 bg-white transition hover:bg-paper"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-paper-ink/15 bg-white transition hover:bg-paper"
              aria-label="Suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group w-[min(86vw,320px)] shrink-0 snap-start"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-ink">
                {item.cover ? (
                  <Image
                    src={item.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="320px"
                  />
                ) : null}
              </div>
              <p className="mt-3 text-[11px] tracking-[0.16em] text-paper-muted uppercase">
                {item.category} · {formatDate(item.publishedAt, locale)} · {item.readingMinutes} {readingLabel}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight transition group-hover:opacity-80">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-paper-muted">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
