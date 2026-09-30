"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function NavigationProgressInner({ variant = "public" }: { variant?: "public" | "admin" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [progress, setProgress] = useState(0);
  const trickleRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const badgeRef = useRef<number | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  function clearTimers() {
    if (trickleRef.current) window.clearInterval(trickleRef.current);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    if (badgeRef.current) window.clearTimeout(badgeRef.current);
    trickleRef.current = null;
    hideRef.current = null;
    badgeRef.current = null;
  }

  function start() {
    clearTimers();
    setActive(true);
    setVisible(true);
    setShowBadge(false);
    setProgress(12);
    badgeRef.current = window.setTimeout(() => setShowBadge(true), 280);
    trickleRef.current = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 90) return value;
        const step = value < 40 ? 8 : value < 70 ? 4 : 1.5;
        return Math.min(90, value + step);
      });
    }, 220);
  }

  function done() {
    clearTimers();
    setShowBadge(false);
    setProgress(100);
    hideRef.current = window.setTimeout(() => {
      setActive(false);
      setVisible(false);
      setProgress(0);
    }, 280);
  }

  useEffect(() => {
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        const samePath = url.pathname === window.location.pathname && url.search === window.location.search;
        if (samePath) return;
        start();
      } catch {
        /* ignore invalid href */
      }
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, []);

  const barColor = variant === "admin" ? "bg-accent" : "bg-accent";
  const spinnerBorder = variant === "admin" ? "border-ink/15 border-t-ink" : "border-ink/15 border-t-ink";

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] overflow-hidden transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!active}
      >
        <div
          className={cn("h-full origin-left shadow-[0_0_12px_rgba(214,255,63,0.55)] transition-[width] duration-200 ease-out", barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[99] grid place-items-center transition-opacity duration-200",
          showBadge && active ? "opacity-100" : "opacity-0",
        )}
        aria-live="polite"
        aria-busy={active}
      >
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-paper/90 px-5 py-4 shadow-[0_16px_50px_rgba(22,21,19,0.14)] backdrop-blur-md">
          <div className="relative grid h-11 w-11 place-items-center">
            <span className={cn("absolute inset-0 rounded-full border-2 animate-spin", spinnerBorder)} />
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-serif text-sm text-accent">L</span>
          </div>
          <p className="text-[11px] tracking-[0.18em] text-paper-muted uppercase">LYNE</p>
        </div>
      </div>
    </>
  );
}

export function NavigationProgress({ variant = "public" }: { variant?: "public" | "admin" }) {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner variant={variant} />
    </Suspense>
  );
}
