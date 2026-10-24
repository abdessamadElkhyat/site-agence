"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { contactSchema, reservationSchema } from "@/lib/validators";
import type { z } from "zod";

type ContactValues = z.infer<typeof contactSchema>;
type BookingValues = z.infer<typeof reservationSchema>;

const sources: Record<Locale, string[]> = {
  fr: ["Google", "Instagram", "Recommandation", "LinkedIn", "Autre"],
  en: ["Google", "Instagram", "Referral", "LinkedIn", "Other"],
};
const types: Record<Locale, string[]> = {
  fr: ["Appel découverte", "Audit SEO", "Projet de site", "Campagne publicitaire", "Autre"],
  en: ["Intro call", "SEO audit", "Website project", "Ad campaign", "Other"],
};
const hours = ["09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"];

export function ContactPanel({ services }: { services: string[] }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [tab, setTab] = useState<"message" | "booking">("message");

  return (
    <div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setTab("message")} className={`rounded-full px-4 py-2 text-sm ${tab === "message" ? "bg-ink text-ivory" : "bg-white"}`}>{t("contact.messageTab")}</button>
        <button type="button" onClick={() => setTab("booking")} className={`rounded-full px-4 py-2 text-sm ${tab === "booking" ? "bg-ink text-ivory" : "bg-white"}`}>{t("contact.bookingTab")}</button>
      </div>
      <div className="mt-8">
        {tab === "message" ? <MessageForm services={services} locale={locale} /> : <BookingForm locale={locale} />}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

const inputClass = "h-11 w-full border border-paper-ink/15 bg-white px-3 outline-none focus:border-paper-ink";

function MessageForm({ services, locale }: { services: string[]; locale: Locale }) {
  const t = useTranslations();
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "db">("idle");
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { firstName: "", lastName: "", email: "", phone: "", company: "", service: "", budget: "", message: "", source: "" } });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    const response = await fetch("/api/public/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (response.status === 503) setStatus("db");
    else if (!response.ok) setStatus("error");
    else {
      setStatus("ok");
      form.reset();
    }
  }

  const err = (name: keyof ContactValues) => (form.formState.errors[name] ? t("form.required") : undefined);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2" noValidate>
      <Field label={t("form.firstName")} error={err("firstName")}><input className={inputClass} {...form.register("firstName")} /></Field>
      <Field label={t("form.lastName")} error={err("lastName")}><input className={inputClass} {...form.register("lastName")} /></Field>
      <Field label={t("form.email")} error={form.formState.errors.email ? t("form.invalidEmail") : undefined}><input type="email" className={inputClass} {...form.register("email")} /></Field>
      <Field label={t("form.phone")}><input className={inputClass} {...form.register("phone")} /></Field>
      <Field label={t("form.company")}><input className={inputClass} {...form.register("company")} /></Field>
      <Field label={t("form.service")}>
        <select className={inputClass} {...form.register("service")}>
          <option value="">{t("form.select")}</option>
          {services.map((service) => <option key={service}>{service}</option>)}
        </select>
      </Field>
      <Field label={t("form.source")}>
        <select className={inputClass} {...form.register("source")}>
          <option value="">{t("form.select")}</option>
          {sources[locale].map((item) => <option key={item}>{item}</option>)}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label={t("form.message")} error={err("message")}><textarea rows={5} className={`${inputClass} h-auto py-2`} {...form.register("message")} /></Field>
      </div>
      <div className="md:col-span-2">
        <button disabled={form.formState.isSubmitting} className="rounded-full bg-ink px-5 py-3 text-sm text-ivory disabled:opacity-60">
          {form.formState.isSubmitting ? t("form.sending") : t("form.send")}
        </button>
        {status === "ok" ? <p className="mt-3 text-sm">{t("contact.success")}</p> : null}
        {status === "error" ? <p className="mt-3 text-sm text-red-700">{t("contact.error")}</p> : null}
        {status === "db" ? <p className="mt-3 text-sm">{t("contact.dbError")}</p> : null}
      </div>
    </form>
  );
}

function BookingForm({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "db">("idle");
  const form = useForm<BookingValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", company: "", type: "", date: "", time: "10:30", message: "" },
  });

  async function onSubmit(values: BookingValues) {
    const response = await fetch("/api/public/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (response.status === 503) setStatus("db");
    else if (!response.ok) setStatus("error");
    else {
      setStatus("ok");
      form.reset();
    }
  }

  const err = (name: keyof BookingValues) => (form.formState.errors[name] ? t("form.required") : undefined);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2" noValidate>
      <Field label={t("form.firstName")} error={err("firstName")}><input className={inputClass} {...form.register("firstName")} /></Field>
      <Field label={t("form.lastName")} error={err("lastName")}><input className={inputClass} {...form.register("lastName")} /></Field>
      <Field label={t("form.email")} error={form.formState.errors.email ? t("form.invalidEmail") : undefined}><input type="email" className={inputClass} {...form.register("email")} /></Field>
      <Field label={t("form.phone")} error={err("phone")}><input className={inputClass} {...form.register("phone")} /></Field>
      <Field label={t("form.company")}><input className={inputClass} {...form.register("company")} /></Field>
      <Field label={t("form.type")} error={err("type")}>
        <select className={inputClass} {...form.register("type")}>
          <option value="">{t("form.select")}</option>
          {types[locale].map((item) => <option key={item}>{item}</option>)}
        </select>
      </Field>
      <Field label={t("form.date")} error={err("date")}><input type="date" className={inputClass} {...form.register("date")} /></Field>
      <Field label={t("form.time")}>
        <select className={inputClass} {...form.register("time")}>{hours.map((hour) => <option key={hour}>{hour}</option>)}</select>
      </Field>
      <div className="md:col-span-2">
        <Field label={t("form.message")}><textarea rows={4} className={`${inputClass} h-auto py-2`} {...form.register("message")} /></Field>
      </div>
      <div className="md:col-span-2">
        <button disabled={form.formState.isSubmitting} className="rounded-full bg-ink px-5 py-3 text-sm text-ivory disabled:opacity-60">
          {form.formState.isSubmitting ? t("form.sending") : t("form.book")}
        </button>
        {status === "ok" ? <p className="mt-3 text-sm">{t("contact.bookingSuccess")}</p> : null}
        {status === "error" ? <p className="mt-3 text-sm text-red-700">{t("contact.error")}</p> : null}
        {status === "db" ? <p className="mt-3 text-sm">{t("contact.dbError")}</p> : null}
      </div>
    </form>
  );
}
