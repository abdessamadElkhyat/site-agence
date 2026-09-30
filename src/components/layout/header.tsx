"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const links = [
  { href: "/services", key: "services" },
  { href: "/realisations", key: "work" },
  { href: "/a-propos", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

const locales: Locale[] = ["fr", "en", "ar"];

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-ink/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-8 lg:px-12">
        <Link href="/" aria-label="LYNE">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principale">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-ivory/80 transition-colors hover:text-ivory",
                pathname === link.href && "text-ivory",
              )}
            >
              {t(link.key)}
            </Link>
          ))}
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
      {open ? (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-ink px-6 pb-10 pt-8 lg:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="font-serif text-4xl leading-tight text-ivory">
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between">
            <LocaleSwitch locale={locale} onChange={(next) => router.replace(pathname, { locale: next })} />
            <Link href="/contact" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink">
              {t("cta")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LocaleSwitch({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs tracking-[0.14em]">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn("uppercase", item === locale ? "text-accent" : "text-muted")}
          lang={item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
