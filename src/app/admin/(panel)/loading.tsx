import { RouteLoader } from "@/components/layout/route-loader";

export default function AdminLoading() {
  return (
    <div className="rounded-2xl border border-paper-ink/8 bg-white">
      <RouteLoader />
    </div>
  );
}
