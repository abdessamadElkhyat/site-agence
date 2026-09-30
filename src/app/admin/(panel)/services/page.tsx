import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  adminFieldClass,
  adminTextareaClass,
  statusTone,
} from "@/components/admin/ui";
import { asFaq, asSteps, asStringArray, getPrisma } from "@/lib/db";
import { getPagination, parsePage } from "@/lib/pagination";
import { deleteService, saveService } from "@/server/cms";

export default async function ServicesAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.service.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.service.findMany({
    orderBy: [{ locale: "asc" }, { sortOrder: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Services" description="Contenu des pages /services. Ouvrez une ligne pour modifier." />

      <AdminCard className="mb-6 overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium">
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau service
            </span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="border-t border-paper-ink/8 px-5 py-4">
            <ServiceFields />
          </div>
        </details>
      </AdminCard>

      <div className="space-y-3">
        {rows.map((row) => (
          <AdminCard key={row.id} className="overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminBadge tone={statusTone(row.status)}>{row.status}</AdminBadge>
                    <span className="text-xs uppercase tracking-wide text-paper-muted">{row.locale}</span>
                  </div>
                  <p className="mt-1 truncate font-medium">{row.name}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-paper-muted">
                  Modifier
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </span>
              </summary>
              <div className="border-t border-paper-ink/8 px-5 py-4">
                <ServiceFields
                  values={{
                    id: row.id,
                    locale: row.locale,
                    name: row.name,
                    slug: row.slug,
                    summary: row.summary,
                    description: row.description,
                    icon: row.icon,
                    imageUrl: row.imageUrl || "",
                    problem: row.problem,
                    solution: row.solution,
                    benefits: asStringArray(row.benefits).join("\n"),
                    tools: asStringArray(row.tools).join("\n"),
                    process: asSteps(row.process).map((step) => `${step.title} | ${step.text}`).join("\n"),
                    faq: asFaq(row.faq).map((item) => `${item.q} | ${item.a}`).join("\n"),
                    sortOrder: String(row.sortOrder),
                    status: row.status,
                    seoTitle: row.seoTitle || "",
                    seoDescription: row.seoDescription || "",
                  }}
                />
                <form action={deleteService} className="mt-4">
                  <input type="hidden" name="id" value={row.id} />
                  <AdminButton type="submit" variant="danger" className="!px-3 !py-1.5 text-xs">
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </AdminButton>
                </form>
              </div>
            </details>
          </AdminCard>
        ))}
      </div>
      <AdminPagination
        basePath="/admin/services"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        from={pagination.from}
        to={pagination.to}
      />
    </div>
  );
}

function ServiceFields({ values }: { values?: Record<string, string> }) {
  const field = (name: string, label: string, area = false) =>
    area ? (
      <label key={name} className="block text-xs text-paper-muted">
        {label}
        <textarea name={name} defaultValue={values?.[name] || ""} rows={4} className={`${adminTextareaClass} mt-1.5`} />
      </label>
    ) : (
      <label key={name} className="block text-xs text-paper-muted">
        {label}
        <input name={name} defaultValue={values?.[name] || ""} className={`${adminFieldClass} mt-1.5`} />
      </label>
    );

  return (
    <form action={saveService} className="grid gap-3">
      {values?.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {field("locale", "Langue")}
        {field("status", "Statut (DRAFT / PUBLISHED / SCHEDULED)")}
        {field("name", "Nom")}
        {field("slug", "Slug")}
        {field("icon", "Icône Lucide")}
        {field("sortOrder", "Ordre")}
        {field("imageUrl", "Image")}
        {field("seoTitle", "SEO title")}
      </div>
      {field("summary", "Résumé", true)}
      {field("description", "Description", true)}
      {field("problem", "Problème", true)}
      {field("solution", "Solution", true)}
      {field("benefits", "Bénéfices, une ligne chacun", true)}
      {field("tools", "Outils, une ligne chacun", true)}
      {field("process", "Processus : titre | texte", true)}
      {field("faq", "FAQ : question | réponse", true)}
      {field("seoDescription", "Meta description", true)}
      <AdminButton type="submit" variant="primary" className="w-fit">
        <Save className="h-4 w-4" />
        Enregistrer les modifications
      </AdminButton>
    </form>
  );
}
