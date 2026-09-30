import { Save } from "lucide-react";
import { AdminButton, AdminCard, adminFieldClass, adminTextareaClass } from "@/components/admin/ui";
import { asResults, asStringArray } from "@/lib/db";
import { saveProject } from "@/server/cms";

type ProjectRow = {
  id: string;
  locale: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  excerpt: string;
  description: string;
  coverUrl: string | null;
  gallery: unknown;
  technologies: unknown;
  objectives: unknown;
  results: unknown;
  websiteUrl: string | null;
  testimonial: string | null;
  featured: boolean;
  sortOrder: number;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-paper-muted">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function ProjectForm({ project }: { project?: ProjectRow }) {
  const value = (name: keyof ProjectRow) => (project ? String(project[name] ?? "") : "");
  return (
    <AdminCard className="max-w-3xl p-6">
      <form action={saveProject} className="grid gap-4 text-sm md:grid-cols-2">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}
        <Field label="Langue"><input name="locale" defaultValue={project?.locale || "fr"} className={adminFieldClass} /></Field>
        <Field label="Statut">
          <select name="status" defaultValue={project?.status || "PUBLISHED"} className={adminFieldClass}>
            <option>DRAFT</option>
            <option>PUBLISHED</option>
            <option>SCHEDULED</option>
          </select>
        </Field>
        <Field label="Titre"><input name="title" required defaultValue={value("title")} className={adminFieldClass} /></Field>
        <Field label="Slug"><input name="slug" defaultValue={value("slug")} className={adminFieldClass} /></Field>
        <Field label="Client"><input name="client" defaultValue={value("client")} className={adminFieldClass} /></Field>
        <Field label="Catégorie"><input name="category" defaultValue={project?.category || "site-web"} className={adminFieldClass} /></Field>
        <div className="md:col-span-2">
          <Field label="Extrait"><textarea name="excerpt" defaultValue={value("excerpt")} rows={2} className={adminTextareaClass} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Description"><textarea name="description" defaultValue={value("description")} rows={5} className={adminTextareaClass} /></Field>
        </div>
        <Field label="Image principale"><input name="coverUrl" defaultValue={project?.coverUrl || ""} className={adminFieldClass} /></Field>
        <Field label="Lien du site"><input name="websiteUrl" defaultValue={project?.websiteUrl || ""} className={adminFieldClass} /></Field>
        <div className="md:col-span-2">
          <Field label="Galerie (une URL par ligne)"><textarea name="gallery" defaultValue={project ? asStringArray(project.gallery).join("\n") : ""} rows={3} className={adminTextareaClass} /></Field>
        </div>
        <Field label="Technologies"><textarea name="technologies" defaultValue={project ? asStringArray(project.technologies).join("\n") : ""} rows={3} className={adminTextareaClass} /></Field>
        <Field label="Objectifs"><textarea name="objectives" defaultValue={project ? asStringArray(project.objectives).join("\n") : ""} rows={3} className={adminTextareaClass} /></Field>
        <div className="md:col-span-2">
          <Field label="Résultats (libellé | valeur)"><textarea name="results" defaultValue={project ? asResults(project.results).map((item) => `${item.label} | ${item.value}`).join("\n") : ""} rows={3} className={adminTextareaClass} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Témoignage"><textarea name="testimonial" defaultValue={project?.testimonial || ""} rows={3} className={adminTextareaClass} /></Field>
        </div>
        <Field label="SEO title"><input name="seoTitle" defaultValue={project?.seoTitle || ""} className={adminFieldClass} /></Field>
        <Field label="Ordre"><input name="sortOrder" defaultValue={String(project?.sortOrder ?? 0)} className={adminFieldClass} /></Field>
        <div className="md:col-span-2">
          <Field label="Meta description"><textarea name="seoDescription" defaultValue={project?.seoDescription || ""} rows={2} className={adminTextareaClass} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="rounded border-paper-ink/20" />
          Mis en avant sur la homepage
        </label>
        <div className="md:col-span-2">
          <AdminButton type="submit" variant="primary">
            <Save className="h-4 w-4" />
            Enregistrer
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
