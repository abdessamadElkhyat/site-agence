"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projectCategories } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types/content";

export function ProjectGrid({ projects, locale, empty }: { projects: Project[]; locale: Locale; empty: string }) {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.category === filter)),
    [filter, projects],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {projectCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setFilter(category.id)}
            className={`rounded-full px-4 py-2 text-sm ${filter === category.id ? "bg-ink text-ivory" : "bg-white text-paper-ink"}`}
          >
            {category[locale]}
          </button>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-10 text-paper-muted">{empty}</p> : null}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.div
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <Link href={`/realisations/${project.slug}`} className="group block">
                <div className="relative aspect-[16/11] overflow-hidden bg-ink">
                  {project.cover ? <Image src={project.cover} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="50vw" /> : null}
                </div>
                <h2 className="mt-4 font-serif text-3xl">{project.title}</h2>
                <p className="mt-1 text-sm text-paper-muted">{project.client}</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
