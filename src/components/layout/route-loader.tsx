import { PageLoader } from "@/components/layout/page-loader";

export function RouteLoader() {
  return (
    <div className="fixed inset-0 z-[85] grid place-items-center bg-ink">
      <PageLoader />
    </div>
  );
}
