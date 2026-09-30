import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/shell";
import { NavigationProgress } from "@/components/layout/navigation-progress";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return (
    <>
      <NavigationProgress variant="admin" />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
