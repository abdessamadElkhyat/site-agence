import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  { href: site.socials.instagram, label: "Instagram", icon: InstagramIcon },
  { href: site.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: site.socials.facebook, label: "Facebook", icon: FacebookIcon },
] as const;

export function SocialLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  return (
    <div className={cn("flex gap-3", className)}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border transition-colors",
            itemClassName,
          )}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <IconFrame>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}

function LinkedinIcon() {
  return (
    <IconFrame>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10.5V17" />
      <path d="M8 7.5h.01" />
      <path d="M12 17v-3.5a2 2 0 0 1 4 0V17" />
      <path d="M12 13.5V10.5" />
    </IconFrame>
  );
}

function FacebookIcon() {
  return (
    <IconFrame>
      <path d="M14 8h2.5V5H14a3 3 0 0 0-3 3v2H8.5v3H11v6h3v-6h2.5l.5-3H14V8.5c0-.3.2-.5.5-.5H16" />
    </IconFrame>
  );
}
