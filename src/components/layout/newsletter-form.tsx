"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    await fetch("/api/public/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    setPending(false);
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-end">
      <div className="flex-1">
        <p className="text-sm font-medium">{t("newsletter")}</p>
        <p className="mt-1 text-sm text-muted">{t("newsletterText")}</p>
        {done ? <p className="mt-3 text-sm text-accent">{t("newsletterOk")}</p> : null}
      </div>
      {done ? null : (
        <div className="flex w-full gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="newsletter-email">{t("newsletterPlaceholder")}</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("newsletterPlaceholder")}
            className="h-11 w-full border border-line bg-transparent px-3 text-sm outline-none sm:w-56"
          />
          <button type="submit" disabled={pending} className="h-11 shrink-0 bg-ivory px-4 text-sm text-ink">
            {t("newsletterCta")}
          </button>
        </div>
      )}
    </form>
  );
}
