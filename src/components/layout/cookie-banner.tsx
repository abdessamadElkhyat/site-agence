"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("lyne-consent");
    if (!stored) setVisible(true);
  }, []);

  function choose(value: "all" | "essential") {
    window.localStorage.setItem("lyne-consent", value);
    setVisible(false);
    if (value === "all") {
      fetch("/api/public/visit", { method: "POST" }).catch(() => undefined);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl border border-line bg-ink-soft p-4 text-sm text-ivory md:inset-x-auto md:end-6 md:start-auto">
      <p>{t("text")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => choose("all")} className="bg-accent px-3 py-2 text-accent-ink">
          {t("accept")}
        </button>
        <button type="button" onClick={() => choose("essential")} className="border border-line px-3 py-2">
          {t("refuse")}
        </button>
        <Link href="/politique-cookies" className="text-brass underline-offset-4 hover:underline">
          {t("more")}
        </Link>
      </div>
    </div>
  );
}
