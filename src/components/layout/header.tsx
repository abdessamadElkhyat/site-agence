"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { routing, type Locale } from "@/i18n/routing";

const links = [
  { href: "/services", key: "services" },
  { href: "/realisations", key: "work" },
  { href: "/a-propos", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

const locales: Locale[] = [...routing.locales];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70]",
        open ? "bg-ink" : scrolled ? "bg-ink/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-8 lg:px-12">
        <Link href="/" aria-label="agencemark">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principale">
          {links.map((link) => {
            const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "text-sm text-ivory/80 underline-offset-[6px] decoration-2 transition-colors hover:text-accent-hover",
                  current && "text-accent underline",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <LocaleSwitch locale={locale} onChange={(next) => router.replace(pathname, { locale: next })} />
          <Link
            href="/contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            {t("cta")}
          </Link>
        </div>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center lg:hidden"
          aria-expanded={open}
          aria-label={open ? t("close") : t("open")}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
    {open ? (
      <div className="fixed inset-0 z-[65] overflow-y-auto bg-ink px-6 pt-24 pb-10 lg:hidden">
        <nav className="border-t border-white/10">
          {links.map((link) => {
            const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-center border-b border-white/10 py-4 font-serif text-[2rem] leading-none text-ivory underline-offset-8 decoration-2 transition-colors hover:text-accent-hover",
                  current && "text-accent underline",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8">
          <LocaleSwitch locale={locale} prominent onChange={(next) => router.replace(pathname, { locale: next })} />
        </div>
        <Link
          href="/contact"
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-ink"
        >
          {t("cta")}
        </Link>
      </div>
    ) : null}
    </>
  );
}

function LocaleSwitch({
  locale,
  onChange,
  prominent = false,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  prominent?: boolean;
}) {
  return (
    <div className={cn("flex items-center", prominent ? "gap-3 text-sm" : "gap-2 text-xs tracking-[0.14em]")}>
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "uppercase transition-colors hover:text-accent-hover",
            item === locale ? "text-accent" : prominent ? "text-ivory/70" : "text-muted",
            prominent && "rounded-full border px-3 py-1.5",
            prominent && item === locale ? "border-accent" : prominent && "border-white/15",
          )}
          lang={item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
