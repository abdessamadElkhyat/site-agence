import { site } from "@/config/site";

export function WhatsappButton({ label }: { label: string }) {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      className="fixed bottom-5 end-5 z-40 rounded-full bg-[#1f3d2b] px-4 py-3 text-sm text-ivory shadow-lg"
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}
