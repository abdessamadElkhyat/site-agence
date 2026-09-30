import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArticleToc } from "@/components/blog/article-toc";
import type { TocItem } from "@/lib/article-html";
import type { RelatedCard } from "@/components/blog/related-slider";

export function ArticleSidebar({
  headings,
  related,
  labels,
}: {
  headings: TocItem[];
  related: RelatedCard[];
  labels: {
    toc: string;
    related: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
  };
}) {
  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      {headings.length ? (
        <div className="rounded-2xl border border-paper-ink/8 bg-white/70 p-5 backdrop-blur-sm">
          <ArticleToc items={headings} label={labels.toc} />
        </div>
      ) : null}

      {related.length ? (
        <div className="rounded-2xl border border-paper-ink/8 bg-white/70 p-5 backdrop-blur-sm">
          <p className="text-[11px] tracking-[0.2em] text-paper-muted uppercase">{labels.related}</p>
          <ul className="mt-4 space-y-4">
            {related.slice(0, 3).map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/${item.slug}`} className="group grid grid-cols-[72px_1fr] gap-3">
                  <div className="relative aspect-square overflow-hidden bg-ink">
                    {item.cover ? (
                      <Image
                        src={item.cover}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="72px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.14em] text-paper-muted uppercase">{item.category}</p>
                    <p className="mt-1 font-serif text-lg leading-snug transition group-hover:opacity-80">{item.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl bg-ink p-5 text-ivory">
        <p className="font-serif text-2xl leading-tight">{labels.ctaTitle}</p>
        <p className="mt-2 text-sm text-ivory/70">{labels.ctaText}</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex rounded-full bg-accent px-4 py-2.5 text-sm text-accent-ink transition hover:brightness-95"
        >
          {labels.ctaButton}
        </Link>
      </div>
    </aside>
  );
}
