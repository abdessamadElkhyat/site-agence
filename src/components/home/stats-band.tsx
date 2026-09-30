"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { site } from "@/config/site";
import { Container } from "@/components/ui/container";

export function StatsBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setProgress(1);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <section ref={ref} className="bg-accent text-accent-ink">
      <Container className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:py-16">
        {site.stats.map((stat) => (
          <p key={stat.id}>
            <span className="block font-serif text-5xl md:text-6xl">
              <Count value={stat.value} run={progress === 1} />
              {stat.suffix}
            </span>
            <span className="mt-2 block text-sm">{stat.label}</span>
          </p>
        ))}
      </Container>
    </section>
  );
}

function Count({ value, run }: { value: number; run: boolean }) {
  const [current, setCurrent] = useState(run ? value : 0);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / 900);
      setCurrent(Math.round(value * (1 - Math.pow(1 - ratio, 3))));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return <>{current}</>;
}
