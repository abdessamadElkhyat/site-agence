import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { DbMissing } from "@/components/admin/db-missing";
import { AdminPageHeader } from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();
  return (
    <div>
      <AdminPageHeader title={project.title} description="Modifiez le projet puis enregistrez." />
      <ProjectForm project={project} />
    </div>
  );
}
