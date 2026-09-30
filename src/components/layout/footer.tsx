import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { staticServices } from "@/content/services";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import type { Locale } from "@/i18n/routing";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const services = staticServices(locale).slice(0, 6);

  return (
    <footer className="border-t border-line bg-ink text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted">{t("blurb")}</p>
          <p className="mt-6 text-xs tracking-[0.16em] text-brass uppercase">{site.hours}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs tracking-[0.18em] text-brass uppercase">{t("navigate")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/services">{nav("services")}</Link></li>
            <li><Link href="/realisations">{nav("work")}</Link></li>
            <li><Link href="/a-propos">{nav("about")}</Link></li>
            <li><Link href="/blog">{nav("blog")}</Link></li>
            <li><Link href="/contact">{nav("contact")}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs tracking-[0.18em] text-brass uppercase">{t("services")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs tracking-[0.18em] text-brass uppercase">{t("contact")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{site.hours}</li>
            <li>Remote-first · Worldwide</li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm text-muted">
            <a href={site.socials.instagram}>Instagram</a>
            <a href={site.socials.linkedin}>LinkedIn</a>
            <a href={site.socials.facebook}>Facebook</a>
          </div>
        </div>
        <div className="md:col-span-12">
          <NewsletterForm />
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. {t("rights")}</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales">{t("legal")}</Link>
            <Link href="/politique-confidentialite">{t("privacy")}</Link>
            <Link href="/politique-cookies">{t("cookies")}</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
