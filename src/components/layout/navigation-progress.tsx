"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const trickleRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  function clearTimers() {
    if (trickleRef.current) window.clearInterval(trickleRef.current);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    trickleRef.current = null;
    hideRef.current = null;
  }

  function start() {
    clearTimers();
    visibleRef.current = true;
    setVisible(true);
    setProgress(12);
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
    if (!visibleRef.current) return;
    visibleRef.current = false;
    setProgress(100);
    hideRef.current = window.setTimeout(() => {
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

    const close = () => done();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", close);
    window.addEventListener("pageshow", close);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", close);
      window.removeEventListener("pageshow", close);
      clearTimers();
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] overflow-hidden transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      <div
        className="h-full origin-left bg-accent shadow-[0_0_12px_rgba(214,255,63,0.55)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function NavigationProgress(_props: { variant?: "public" | "admin" }) {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
