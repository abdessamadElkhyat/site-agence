import { AdminPageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader title="Nouveau projet" description="Remplissez les champs puis enregistrez." />
      <ProjectForm />
    </div>
  );
}
